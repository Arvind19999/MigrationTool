from __future__ import annotations

from typing import Annotated, Dict, Literal, Optional, Union

from pydantic import BaseModel, Field


class ConnectionRequestBase(BaseModel):
    type: str
    database: str
    user: str
    password: str
    table: str = "information_schema.tables"
    timeout_seconds: int = 90
    options: Dict[str, str] = Field(default_factory=dict)
    user_id: Optional[int] = None
    save: bool = False


class HostPortConnectionBase(ConnectionRequestBase):
    host: str
    port: int


class PostgresConnectionRequest(HostPortConnectionBase):
    type: Literal["postgres", "postgresql"] = "postgres"
    port: int = 5432
    jdbc_package: Optional[str] = "org.postgresql:postgresql:42.7.3"


class MySqlConnectionRequest(HostPortConnectionBase):
    type: Literal["mysql"] = "mysql"
    port: int = 3306
    jdbc_package: Optional[str] = "mysql:mysql-connector-java:8.0.33"


class MariaDbConnectionRequest(HostPortConnectionBase):
    type: Literal["mariadb"] = "mariadb"
    port: int = 3306
    jdbc_package: Optional[str] = "org.mariadb.jdbc:mariadb-java-client:3.3.3"


class SqlServerConnectionRequest(HostPortConnectionBase):
    type: Literal["mssql", "sqlserver"] = "mssql"
    port: int = 1433
    jdbc_package: Optional[str] = "com.microsoft.sqlserver:mssql-jdbc:12.6.1.jre11"


class OracleConnectionRequest(HostPortConnectionBase):
    type: Literal["oracle", "oracledb"] = "oracle"
    port: int = 1521
    jdbc_package: Optional[str] = "com.oracle.database.jdbc:ojdbc8:19.23.0.0"


class SnowflakeConnectionRequest(HostPortConnectionBase):
    type: Literal["snowflake"] = "snowflake"
    port: int = 443
    jdbc_package: Optional[str] = "net.snowflake:snowflake-jdbc:3.17.0"


ConnectionTestRequest = Annotated[
    Union[
        PostgresConnectionRequest,
        MySqlConnectionRequest,
        MariaDbConnectionRequest,
        SqlServerConnectionRequest,
        OracleConnectionRequest,
        SnowflakeConnectionRequest,
    ],
    Field(discriminator="type"),
]


def build_jdbc_details(payload: ConnectionRequestBase) -> tuple[str, str, Optional[str]]:
    db_type = payload.type.lower()
    options = payload.options or {}

    if db_type in {"postgres", "postgresql"}:
        url = f"jdbc:postgresql://{payload.host}:{payload.port}/{payload.database}"
        return url, "org.postgresql.Driver", payload.jdbc_package
    if db_type == "mysql":
        url = f"jdbc:mysql://{payload.host}:{payload.port}/{payload.database}"
        return url, "com.mysql.cj.jdbc.Driver", payload.jdbc_package
    if db_type == "mariadb":
        url = f"jdbc:mariadb://{payload.host}:{payload.port}/{payload.database}"
        return url, "org.mariadb.jdbc.Driver", payload.jdbc_package
    if db_type in {"mssql", "sqlserver"}:
        url = f"jdbc:sqlserver://{payload.host}:{payload.port};databaseName={payload.database}"
        return url, "com.microsoft.sqlserver.jdbc.SQLServerDriver", payload.jdbc_package
    if db_type in {"oracle", "oracledb"}:
        sid = options.get("sid")
        if sid:
            url = f"jdbc:oracle:thin:@{payload.host}:{payload.port}:{sid}"
        else:
            service = options.get("service_name") or payload.database
            url = f"jdbc:oracle:thin:@//{payload.host}:{payload.port}/{service}"
        return url, "oracle.jdbc.OracleDriver", payload.jdbc_package
    if db_type == "snowflake":
        account = payload.host
        schema = options.get("schema", "PUBLIC")
        warehouse = options.get("warehouse", "")
        role = options.get("role", "")
        url = (
            f"jdbc:snowflake://{account}.snowflakecomputing.com/"
            f"?db={payload.database}&schema={schema}"
        )
        if warehouse:
            url += f"&warehouse={warehouse}"
        if role:
            url += f"&role={role}"
        return url, "net.snowflake.client.jdbc.SnowflakeDriver", payload.jdbc_package

    raise ValueError(f"Unsupported connection type: {payload.type}")
