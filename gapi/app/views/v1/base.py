# coding: utf-8

import copy
import time
import traceback
import uuid
from cStringIO import StringIO
from functools import wraps

import re
import werkzeug
import socket

import simplejson as json
from app.libs.logger import getLogger
from flask import request, Response, g
from app.exc import APIError, RespInternal

log = getLogger(__name__)

class api_method(object):
    api_implementation = None
    permission_required = []

    def __init__(self, task, permission_required=None, **kwargs):
        if permission_required is None:
            permission_required = []
        self.permission_required = permission_required
        self.task = task

    def __call__(self, func):
        self.api_implementation = func

        def func_wrapper(*args, **kwargs):
            return self.view_func(*args, **kwargs)

        return func_wrapper

    def authenticate(self):
        g.log = {'task': self.task}
        g.perm = request.headers.get('perm', '').split(',')
        if 'faceid_lite' in g.perm:
            g.perm.append('lite')
        if 'faceid_lite_datasource' in g.perm:
            g.perm += ['lite_cmp_usesource', 'lite_cmp_nosource']
        if 'lite_cmp_usesource' in g.perm or 'lite_cmp_nosource' in g.perm:
            g.perm += ['lite']
        map(check_perm, self.permission_required)
        if 'api_key' in request.values:
            g.log.update({'api_key': request.values.get('api_key')})

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
            if hasattr(g, "session"):
                if self.task == "video":
                    g.session.handle_video_failure()
                if self.task == "ocr":
                    g.session.handle_ocr_failure()
                if self.task in ('validate_front_face', 'validate_side_face'):
                    g.session.handle_validation_failure(self.task)

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
            if hasattr(g, "session"):
                g.session.save()
            if caught_exc:
                result, http_code = caught_exc.get_http_result()
            if caught_exc is None or isinstance(caught_exc, APIError):
                log.info('request_id=%s time_used=%s status_code=%s', g.request_id,
                         int((time.time() - start_time)*1000), str(http_code))
            if not isinstance(result, Response):
                result.update({'time_used': int((time.time() - start_time) * 1000)})
                result.update({'request_id': g.request_id})
            request_data = {}
            request_data.update({k: v for k, v in request.values.iteritems()})
            request_data.pop('name', None)
            request_data.pop('api_secret', None)
            request_data.pop('idcard', None)
            result_copy = copy.deepcopy(result)
            if 'images' in result_copy:
                # 删除result中的图片
                del result_copy['images']
            if self.task == 'verify':
                result_copy.pop('image_face_front', None)
                result_copy.pop('image_face_side', None)

            try:
                g.log.update({
                    'status_code': http_code,
                    'response': result_copy,
                    'ip': get_ip()
                })
                cache = {
                    'image_best': g.log.get('image_best', '')
                }
            except:
                log.error(traceback.format_exc())
                result, http_code = RespInternal().get_http_result()

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

def check_perm(field):
    if field in g.perm:
        return True
    if field == 'Authorized':
        raise RespUnauthorized()
    else:
        raise RespUnauthorized('Denied.')

def get_ip():
    ip = ''
    try:
        ip = socket.gethostbyname(socket.gethostname())
    except:
        pass

    return ip
