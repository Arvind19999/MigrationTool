import json
import os
import shutil
import subprocess
import uuid

from .job_store import create_job, update_job

def _resolve_docker_bin() -> str | None:
    return os.getenv("DOCKER_BIN") or shutil.which("docker") or shutil.which("docker.io")

def _docker_exec(command, input_text=None, timeout=120):
    return subprocess.run(
        command,
        input=input_text,
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def run_pipeline_with_config(config: dict) -> dict:
    run_id = str(uuid.uuid4())
    spark_master = os.getenv("SPARK_MASTER_URL", "spark://spark-master:7077")
    script_path = os.getenv("SPARK_PIPELINE_SCRIPT", "/opt/spark/jobs/pipeline_main.py")
    ivy_cache = os.getenv("SPARK_IVY_CACHE", "/tmp/ivy")
    packages = config.get("packages") or []
    config_dir = "/opt/spark/jobs/configs"
    config_path = f"{config_dir}/{run_id}.json"
    docker_bin = _resolve_docker_bin()
    if not docker_bin:
        details = "Docker CLI not found in API container. Install docker.io or set DOCKER_BIN."
        update_job(run_id, "failed", details)
        return {
            "ok": False,
            "run_id": run_id,
            "message": "Failed to run pipeline.",
            "details": details,
        }

    config_payload = json.dumps(config)

    create_job(run_id, config)

    write_cmd = [
        docker_bin,
        "exec",
        "-i",
        "spark-master",
        "/bin/sh",
        "-lc",
        f"mkdir -p {config_dir} && cat > {config_path}",
    ]
    write_result = _docker_exec(write_cmd, input_text=config_payload)
    if write_result.returncode != 0:
        details = write_result.stderr.strip()
        update_job(run_id, "failed", details)
        return {
            "ok": False,
            "run_id": run_id,
            "message": "Failed to write config into spark-master.",
            "details": details,
        }

    submit_cmd = [
        docker_bin,
        "exec",
        "-i",
        "spark-master",
        "/opt/spark/bin/spark-submit",
        "--master",
        spark_master,
        "--conf",
        f"spark.jars.ivy={ivy_cache}",
    ]
    if packages:
        submit_cmd.extend(["--packages", ",".join(packages)])
    submit_cmd.extend([script_path, "--config", config_path])

    submit_result = _docker_exec(submit_cmd, timeout=300)
    output = "\n".join(
        [submit_result.stdout.strip(), submit_result.stderr.strip()]
    ).strip()

    final_status = "success" if submit_result.returncode == 0 else "failed"
    update_job(run_id, final_status, output)

    return {
        "ok": submit_result.returncode == 0,
        "run_id": run_id,
        "message": "Pipeline finished" if submit_result.returncode == 0 else "Pipeline failed",
        "details": output,
    }
