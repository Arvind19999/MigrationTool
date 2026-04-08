import argparse
import json

from pyspark.sql import SparkSession


def parse_args():
    parser = argparse.ArgumentParser(description="Run a pipeline from a config JSON.")
    parser.add_argument("--config", required=True)
    return parser.parse_args()


def build_session(packages):
    builder = SparkSession.builder.appName("PipelineRunner")
    if packages:
        builder = builder.config("spark.jars.packages", ",".join(packages))
    return builder.getOrCreate()


def build_jdbc_settings(conn):
    db_type = conn.get("type", "").lower()
    host = conn["host"]
    port = conn["port"]
    database = conn["database"]
    options = conn.get("options", {})

    if db_type in {"postgres", "postgresql"}:
        return {
            "url": f"jdbc:postgresql://{host}:{port}/{database}",
            "driver": "org.postgresql.Driver",
        }
    if db_type in {"mysql"}:
        return {
            "url": f"jdbc:mysql://{host}:{port}/{database}",
            "driver": "com.mysql.cj.jdbc.Driver",
        }
    if db_type in {"sqlserver", "mssql"}:
        return {
            "url": f"jdbc:sqlserver://{host}:{port};databaseName={database}",
            "driver": "com.microsoft.sqlserver.jdbc.SQLServerDriver",
        }
    if db_type in {"snowflake"}:
        account = host
        schema = options.get("schema", "PUBLIC")
        warehouse = options.get("warehouse", "")
        role = options.get("role", "")
        url = f"jdbc:snowflake://{account}.snowflakecomputing.com/?db={database}&schema={schema}"
        if warehouse:
            url += f"&warehouse={warehouse}"
        if role:
            url += f"&role={role}"
        return {
            "url": url,
            "driver": "net.snowflake.client.jdbc.SnowflakeDriver",
        }
    raise ValueError(f"Unsupported source type: {db_type}")


def jdbc_read(spark, conn):
    settings = build_jdbc_settings(conn)
    table = conn.get("table") or "information_schema.tables"
    reader = (
        spark.read.format("jdbc")
        .option("url", settings["url"])
        .option("dbtable", table)
        .option("user", conn["user"])
        .option("password", conn["password"])
        .option("driver", settings["driver"])
    )
    for key, value in conn.get("options", {}).items():
        reader = reader.option(key, value)
    return reader.load()


def jdbc_write(df, conn):
    settings = build_jdbc_settings(conn)
    table = conn.get("table") or "public.pipeline_output"
    writer = (
        df.write.mode("overwrite")
        .format("jdbc")
        .option("url", settings["url"])
        .option("dbtable", table)
        .option("user", conn["user"])
        .option("password", conn["password"])
        .option("driver", settings["driver"])
    )
    for key, value in conn.get("options", {}).items():
        writer = writer.option(key, value)
    writer.save()


def main():
    args = parse_args()
    with open(args.config, "r", encoding="utf-8") as handle:
        config = json.load(handle)

    spark = build_session(config.get("packages", []))
    sources = config.get("sources", [])
    sink = config.get("sink")

    try:
        frames = []
        for source in sources:
            frames.append(jdbc_read(spark, source))

        if not frames:
            raise ValueError("No readable sources found in config.")

        result = frames[0]
        if sink:
            jdbc_write(result, sink)

        print(json.dumps({"ok": True, "message": "Pipeline completed"}))
    except Exception as exc:
        print(json.dumps({"ok": False, "message": "Pipeline failed", "error": str(exc)}))
    finally:
        spark.stop()


if __name__ == "__main__":
    main()
