# coding: utf-8

import logging
import logging.config
from logging import (
    INFO, getLogger, getLevelName, Handler,
)
import time

import simplejson as json

class SensitiveDataFilter(logging.Filter):

    def filter(self, record):
        msg = record.msg
        try:
            message = json.loads(msg)
        except (ValueError, TypeError):
            pass
        else:
            mask_sensitive(message)
            record.msg = json.dumps(message)
        return True


def init_logger(app):
    logging.config.dictConfig(app.config['LOGGING'])


def send_log(logger_name, data, log_level=INFO):
    if isinstance(log_level, str):
        log_level = getLevelName(log_level)

    _logger = getLogger(logger_name)

    message = json.dumps(data)
    _logger.log(log_level, message, extra=data)


def dump_request():
    from flask import request, g

    data = {
        'method': request.method,
        'host': request.host,
        'path': request.path,
        'remote_addr': request.headers.get('X-Real-IP', '') or request.remote_addr,
        'elapse_time': int((time.time() - g.start) * 1000),
        'status_code': g.status_code,
        'request_id': g.request_id,
        'session': g.session
    }

    req_args = getattr(request, 'values', 'json')
    if req_args:
        req_args = {k: v for k, v in req_args.items()}
    else:
        req_args = {}
    data.update(req_args=req_args, resp_data=g.resp_data)

    return data


def log_request():
    req_data = dump_request()
    send_log('ots', req_data)


def mask_sensitive(d):
    for k, v in d.iteritems():
        if isinstance(v, dict):
            mask_sensitive(v)
        else:
            FILEDS = ('password', 'id_card', 'id_no', 'delta')
            MASK = '*' * 8
            if k in FILEDS and v:
                d[k] = MASK
