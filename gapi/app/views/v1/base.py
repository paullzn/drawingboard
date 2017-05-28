# coding: utf-8

import time
import traceback
import uuid

import werkzeug
import socket

import simplejson as json
from app.libs.logger import getLogger
from flask import request, Response, g
from app.exc import APIError, RespInternal, RespUnauthorized
from app.models import Session

log = getLogger(__name__)

class api_method(object):
    api_implementation = None
    permission_required = []

    def __init__(self, task, login_required=False, **kwargs):
        self.login_required = login_required
        self.task = task

    def __call__(self, func):
        self.api_implementation = func

        def func_wrapper(*args, **kwargs):
            return self.view_func(*args, **kwargs)

        return func_wrapper

    def authenticate(self):
        g.log = {'task': self.task}
        if request.headers.get('loginsession', ''):
            session_hash = request.headers.get('loginsession')
            g.account, g.session = Session.check_session(session_hash)
            print g.account
        if (not hasattr(g, 'account') or g.account == None) and self.login_required:
            print 'raise !!!!!!'
            raise RespUnauthorized()

    def get_result(self, *args, **kwargs):
        caught_exc = None
        result = None
        http_code = 200
        start_time = time.time()
        try:
            g.request_id = str(int(time.time())) + ',' + str(uuid.uuid4())
            try:
                self.authenticate()
            except:
                raise
            result = self.api_implementation(*args, **kwargs)
        except APIError as e:
            caught_exc = e

        except Exception as e:
            print '================', caught_exc
            print e
            #import traceback
            #traceback.print_exc()
            print '================'
            if not caught_exc:
                caught_exc = RespInternal()
                log.error('api' + 'request_id={} traceback={}'.format(g.request_id, traceback.format_exc()))
                http_code = 500
        finally:
            if caught_exc:
                result, http_code = caught_exc.get_http_result()
            if caught_exc is None or isinstance(caught_exc, APIError):
                log.info('request_id=%s time_used=%s status_code=%s', g.request_id,
                         int((time.time() - start_time)*1000), str(http_code))
            if not isinstance(result, Response):
                result.update({'time_used': int((time.time() - start_time) * 1000)})
                result.update({'request_id': g.request_id})
        return result, http_code

    def view_func(self, *args, **kwargs):
        result = {}
        http_code = 200
        try:
            result, http_code = self.get_result(*args, **kwargs)
        except werkzeug.exceptions.HTTPException:
            raise
        except Exception:
            log.error(traceback.format_exc())
            result = Response('internal_error', 500, mimetype='application/text')

        if not isinstance(result, Response):
            result = json.dumps(result)
            result = Response(result, http_code, mimetype='application/json')

        origin = request.headers.get('Origin')
        if origin:
            result.headers['Access-Control-Allow-Origin'] = origin
        allow_headers = request.headers.get('Access-Control-Request-Headers')
        if allow_headers:
            result.headers['Access-Control-Allow-Headers'] = allow_headers
            result.headers['Access-Control-Max-Age'] = '2592000'

        return result

def get_ip():
    ip = ''
    try:
        ip = socket.gethostbyname(socket.gethostname())
    except:
        pass

    return ip
