import json
import os
import subprocess
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .models import PipelineConfig
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


class PostgresConnectionRequest(BaseModel):
    host: str
    port: int = 5432
    database: str
    user: str
    password: str
    table: str = "information_schema.tables"
    jdbc_package: str = "org.postgresql:postgresql:42.7.3"
    timeout_seconds: int = 90


@app.post("/connections/postgres/test")
def test_postgres_connection(payload: PostgresConnectionRequest):
    spark_master = os.getenv("SPARK_MASTER_URL", "spark://spark-master:7077")
    script_path = os.getenv("SPARK_TEST_SCRIPT", "/opt/spark/jobs/check_connection.py")
    ivy_cache = os.getenv("SPARK_IVY_CACHE", "/tmp/ivy")

    command = [
        "docker",
        "exec",
        "-i",
        "spark-master",
        "/opt/spark/bin/spark-submit",
        "--master",
        spark_master,
        "--packages",
        payload.jdbc_package,
        "--conf",
        f"spark.jars.ivy={ivy_cache}",
        script_path,
        "--host",
        payload.host,
        "--port",
        str(payload.port),
        "--db",
        payload.database,
        "--user",
        payload.user,
        "--password",
        payload.password,
        "--table",
        payload.table,
    ]

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
        return json.loads(last_json)

    return {
        "ok": result.returncode == 0,
        "message": "Connection established"
        if result.returncode == 0
        else "Connection not established",
        "details": combined_output,
    }


@app.post("/pipelines/run")
def run_pipeline(payload: PipelineConfig):
    return run_pipeline_with_config(payload.model_dump())


@app.get("/pipelines/status/{run_id}")
def pipeline_status(run_id: str):
    job = get_job(run_id)
    if not job:
        return {"ok": False, "message": "Run ID not found", "run_id": run_id}
    return {"ok": True, "job": job}
