import json
import os
import subprocess

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .db import get_db
from .db_models import ConnectionTest, User
from .models import PipelineConfig
from .schemas.connection_requests import (
    ConnectionTestRequest,
    PostgresConnectionRequest,
    build_jdbc_details,
)
from .schemas.connection_tests import ConnectionTestOut
from .schemas.users import UserCreate, UserOut
from .security import hash_password
from .services.job_store import get_job
from .services.spark_runner import run_pipeline_with_config

app = FastAPI(title="ELT Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "spark_master_url": os.getenv("SPARK_MASTER_URL", ""),
    }


@app.get("/")
def root():
    return {"message": "ELT Studio FastAPI backend is running."}


def _run_connection_test(payload: ConnectionTestRequest, db: Session | None = None):
    spark_master = os.getenv("SPARK_MASTER_URL", "spark://spark-master:7077")
    script_path = os.getenv("SPARK_TEST_SCRIPT", "/opt/spark/jobs/check_connection.py")
    ivy_cache = os.getenv("SPARK_IVY_CACHE", "/tmp/ivy")
    jdbc_url, driver, jdbc_package = build_jdbc_details(payload)

    command = [
        "docker",
        "exec",
        "-i",
        "spark-master",
        "/opt/spark/bin/spark-submit",
        "--master",
        spark_master,
        "--conf",
        f"spark.jars.ivy={ivy_cache}",
    ]
    if jdbc_package:
        command.extend(["--packages", jdbc_package])
    command.extend(
        [
            script_path,
            "--jdbc-url",
            jdbc_url,
            "--driver",
            driver,
            "--user",
            payload.user,
            "--password",
            payload.password,
            "--table",
            payload.table,
            "--options-json",
            json.dumps(payload.options or {}),
        ]
    )

    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        timeout=payload.timeout_seconds,
    )

    combined_output = "\n".join([result.stdout.strip(), result.stderr.strip()]).strip()
    last_json = None
    for line in reversed(result.stdout.splitlines()):
        line = line.strip()
        if line.startswith("{") and line.endswith("}"):
            last_json = line
            break

    if last_json:
        response_payload = json.loads(last_json)
    else:
        response_payload = {
            "ok": result.returncode == 0,
            "message": "Connection established"
            if result.returncode == 0
            else "Connection not established",
            "details": combined_output,
        }

    if db and payload.save:
        if payload.user_id is not None:
            user = db.query(User).filter(User.id == payload.user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
        record = ConnectionTest(
            user_id=payload.user_id,
            db_type=payload.type,
            host=payload.host,
            port=payload.port,
            database=payload.database,
            username=payload.user,
            table=payload.table,
            jdbc_url=jdbc_url,
            driver=driver,
            jdbc_package=jdbc_package,
            options=payload.options or {},
            success=bool(response_payload.get("ok")),
            message=response_payload.get("message"),
            error=response_payload.get("error") or response_payload.get("details"),
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        response_payload["saved_connection_test"] = ConnectionTestOut.model_validate(
            record
        ).model_dump()

    return response_payload


@app.post("/connections/test")
def test_connection(payload: ConnectionTestRequest, db: Session = Depends(get_db)):
    return _run_connection_test(payload, db)


@app.post("/connections/postgres/test")
def test_postgres_connection(payload: PostgresConnectionRequest, db: Session = Depends(get_db)):
    return _run_connection_test(payload, db)


@app.post("/users", response_model=UserOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/pipelines/run")
def run_pipeline(payload: PipelineConfig):
    return run_pipeline_with_config(payload.model_dump())


@app.get("/pipelines/status/{run_id}")
def pipeline_status(run_id: str):
    job = get_job(run_id)
    if not job:
        return {"ok": False, "message": "Run ID not found", "run_id": run_id}
    return {"ok": True, "job": job}
