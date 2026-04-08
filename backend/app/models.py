from typing import Dict, List, Optional

from pydantic import BaseModel


class DbConnection(BaseModel):
    name: str
    type: str
    host: str
    port: int
    database: str
    user: str
    password: str
    table: Optional[str] = None
    schema: Optional[str] = None
    options: Dict[str, str] = {}


class PipelineConfig(BaseModel):
    name: str
    sources: List[DbConnection]
    sink: Optional[DbConnection] = None
    transformations: List[Dict[str, str]] = []
    packages: List[str] = []
