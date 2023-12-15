from typing import Any, Union

import dotenv
import os


def init(filepath: Union[str, None] = None):
    dotenv.load_dotenv(dotenv_path=filepath)


def get(key: str, default: Any = None):
    val = os.getenv(key)
    if val is None:
        return default
    return val
