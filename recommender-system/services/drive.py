
import requests

from helpers import file
from services import logging


def download_file(fileID: str, local_path: str = None) -> str:
    url = f'https://drive.google.com/uc?id={fileID}'
    logger = logging.get_logger()

    if local_path is None:
        local_path = file.generate_tempfile()

    logger.info('[DRIVE]: Downloading %s into %s', url, local_path)
    response = requests.get(url)

    if not response.ok:
        raise Exception(f'Request failed with status {response.status_code}')

    with open(local_path, mode='wb') as f:
        f.write(response.content)

    return local_path
