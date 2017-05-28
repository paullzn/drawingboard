DEBUG=True
ENV='dev'

SECRET_KEY = 'mAGI sAId, Me sMASh yOU'
ALIYUN_OSS_INTERNAL_HOST = 'oss-cn-beijing-internal.aliyuncs.com'
ALIYUN_OSS_EXTERNAL_HOST = 'oss-cn-beijing.aliyuncs.com'
ALIYUN_OSS_ACCESS_KEY = 'test_access_key'
ALIYUN_OSS_ACCESS_SECRET = 'test_access_secret'
ALIYUN_OSS_BUCKET = 'drawingboard-prod-artwork'
ALIYUN_EYES_OSS_BUCKET = 'beautyeyes-prod'
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,

    'formatters': {
        'console': {
            'format': '[%(asctime)s][%(levelname)s] %(name)s %(filename)s:%(funcName)s:%(lineno)d | %(message)s',
            'datefmt': '%H:%M:%S',
        },
    },
    'filters': {
        'sensitive': {
            '()': 'app.libs.logger.SensitiveDataFilter'
        }
    },

    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'console',
            'stream': 'ext://sys.stdout',
            'filters': ['sensitive']
        },
        'error': {
            'level': 'ERROR',
            'class': 'logging.StreamHandler',
            'formatter': 'console',
            'stream': 'ext://sys.stderr'
        }
    },

    'loggers': {
        '': {
            'handlers': ['console', 'error'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'app': {
            'level': 'DEBUG',
            'propagate': True,
        },
        'werkzeug': {
            'level': 'WARN',
            'propagate': True,
        },
    }
}

