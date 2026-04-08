import argparse
import json
import os
import sys

from pyspark.sql import SparkSession


def parse_args():
    parser = argparse.ArgumentParser(description="PostgreSQL Spark connection test.")
    parser.add_argument("--host", default=os.getenv("POSTGRES_HOST", ""))
    parser.add_argument("--port", default=os.getenv("POSTGRES_PORT", "5432"))
    parser.add_argument("--db", default=os.getenv("POSTGRES_DB", ""))
    parser.add_argument("--user", default=os.getenv("POSTGRES_USER", ""))
    parser.add_argument("--password", default=os.getenv("POSTGRES_PASS", ""))
    parser.add_argument("--table", default=os.getenv("POSTGRES_TABLE", "information_schema.tables"))
    parser.add_argument(
        "--jdbc-package",
        default=os.getenv("JDBC_PACKAGE", "org.postgresql:postgresql:42.7.3"),
    )
    return parser.parse_args()


def main():
    args = parse_args()
    if not all([args.host, args.port, args.db, args.user, args.password]):
        print(
            json.dumps(
                {
                    "ok": False,
                    "message": "Missing required connection parameters.",
                }
            )
        )
        sys.exit(2)

    jdbc_url = f"jdbc:postgresql://{args.host}:{args.port}/{args.db}"

    spark = (
        SparkSession.builder.appName("PostgresConnectionTest")
        .config("spark.jars.packages", args.jdbc_package)
        .getOrCreate()
    )

    try:
        df = (
            spark.read.format("jdbc")
            .option("url", jdbc_url)
            .option("dbtable", args.table)
            .option("user", args.user)
            .option("password", args.password)
            .option("driver", "org.postgresql.Driver")
            .load()
        )
        df.limit(1).count()
        print(json.dumps({"ok": True, "message": "Connection established"}))
        sys.exit(0)
    except Exception as exc:
        print(
            json.dumps(
                {
                    "ok": False,
                    "message": "Connection not established",
                    "error": str(exc),
                }
            )
        )
        sys.exit(1)
    finally:
        spark.stop()


if __name__ == "__main__":
    main()
