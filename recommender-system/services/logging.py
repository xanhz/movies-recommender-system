from logging import config as logconfig, getLogger


def get_logger():
    return getLogger('main')


def init():
    logconfig.dictConfig({
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'default': {
                '()': 'uvicorn.logging.DefaultFormatter',
                'fmt': '%(levelprefix)s %(message)s',
                'datefmt': '%Y-%m-%d %H:%M:%S',
            },
        },
        'handlers': {
            'default': {
                'formatter': 'default',
                'class': 'logging.StreamHandler',
                'stream': 'ext://sys.stderr',
            },
        },
        'loggers': {
            'main': {'handlers': ['default'], 'level': 'INFO'},
        },

    })
    return get_logger()
