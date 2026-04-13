"""add missing columns

Revision ID: 0002
Revises: 0001
Create Date: 2026-04-13 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Ensure the enum exists and includes required values.
    bind = op.get_bind()
    enum_exists = bind.execute(
        sa.text("SELECT 1 FROM pg_type WHERE typname = 'status_enum'")
    ).scalar()
    if not enum_exists:
        op.execute(
            "CREATE TYPE status_enum AS ENUM ('Active', 'Inactive', 'Deleted')"
        )
    else:
        # ALTER TYPE ADD VALUE cannot run inside a transaction block in Postgres.
        with op.get_context().autocommit_block():
            op.execute("ALTER TYPE status_enum ADD VALUE IF NOT EXISTS 'Active'")
            op.execute("ALTER TYPE status_enum ADD VALUE IF NOT EXISTS 'Inactive'")
            op.execute("ALTER TYPE status_enum ADD VALUE IF NOT EXISTS 'Deleted'")

    def column_exists(table: str, column: str) -> bool:
        return (
            bind.execute(
                sa.text(
                    """
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = :table
                      AND column_name = :column
                    """
                ),
                {"table": table, "column": column},
            ).scalar()
            is not None
        )

    status_enum = postgresql.ENUM(
        "Active",
        "Inactive",
        "Deleted",
        name="status_enum",
    )

    if not column_exists("users", "updated_at"):
        op.add_column(
            "users",
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=True,
            ),
        )
    if not column_exists("users", "status"):
        op.add_column(
            "users",
            sa.Column(
                "status",
                status_enum,
                nullable=False,
                server_default=sa.text("'Active'"),
            ),
        )
    if not column_exists("users", "is_premimued"):
        op.add_column(
            "users",
            sa.Column(
                "is_premimued",
                sa.Boolean(),
                nullable=False,
                server_default=sa.text("false"),
            ),
        )

    if not column_exists("connection_tests", "schema"):
        op.add_column(
            "connection_tests",
            sa.Column("schema", sa.String(length=255), nullable=True),
        )
    if not column_exists("connection_tests", "updated_at"):
        op.add_column(
            "connection_tests",
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=True,
            ),
        )
    if not column_exists("connection_tests", "status"):
        op.add_column(
            "connection_tests",
            sa.Column(
                "status",
                status_enum,
                nullable=False,
                server_default=sa.text("'Active'"),
            ),
        )


def downgrade() -> None:
    op.drop_column("connection_tests", "status")
    op.drop_column("connection_tests", "updated_at")
    op.drop_column("connection_tests", "schema")

    op.drop_column("users", "is_premimued")
    op.drop_column("users", "status")
    op.drop_column("users", "updated_at")

    status_enum = postgresql.ENUM(
        "Active",
        "Inactive",
        "Deleted",
        name="status_enum",
    )
    status_enum.drop(op.get_bind(), checkfirst=True)
