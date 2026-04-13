# app/enums.py

import enum
from .constants import STATUS_VALUES

# Dynamically build enum from dict — change values in constants.py only
StatusEnum = enum.Enum(
    "StatusEnum",
    {key: value for key, value in STATUS_VALUES.items()},
    type=str
)