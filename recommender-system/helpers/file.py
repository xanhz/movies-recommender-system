import os
import tempfile
import uuid
from typing import Union


def remove(filepath: str, silent=True):
    try:
        os.remove(filepath)
    except Exception as e:
        if not silent:
            raise e


def generate_tempfile(ext: Union[None, str] = None):
    tempdir = tempfile.gettempdir()
    filename = uuid.uuid4().__str__()
    if ext is not None:
        filename = f'{filename}.{ext}'

    return os.path.join(tempdir, filename)
