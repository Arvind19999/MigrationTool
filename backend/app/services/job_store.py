import json
import os
from datetime import datetime, timezone

JOB_DIR = os.getenv("JOB_STORE_DIR", "/app/job_store")


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


def _job_path(run_id: str) -> str:
    return os.path.join(JOB_DIR, f"{run_id}.json")


def _ensure_dir():
    os.makedirs(JOB_DIR, exist_ok=True)


def create_job(run_id: str, payload: dict) -> dict:
    _ensure_dir()
    record = {
        "run_id": run_id,
        "status": "running",
        "created_at": _now_iso(),
        "updated_at": _now_iso(),
        "payload": payload,
        "details": "",
    }
    with open(_job_path(run_id), "w", encoding="utf-8") as handle:
        json.dump(record, handle, indent=2)
    return record


def update_job(run_id: str, status: str, details: str = "") -> dict:
    _ensure_dir()
    record = get_job(run_id) or {"run_id": run_id, "payload": {}}
    record["status"] = status
    record["updated_at"] = _now_iso()
    record["details"] = details
    with open(_job_path(run_id), "w", encoding="utf-8") as handle:
        json.dump(record, handle, indent=2)
    return record


def get_job(run_id: str) -> dict | None:
    path = _job_path(run_id)
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)
