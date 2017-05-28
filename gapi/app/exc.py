#!/usr/bin/env python

class FACEIDErrorBase(Exception):
    pass

class APIError(FACEIDErrorBase):
    msg = None
    status_code = None

    def __init__(self, msg, code):
        super(APIError, self).__init__()
        self.msg = msg
        self.status_code = code

    def __str__(self):
        return self.msg

    def get_http_result(self):
        return {'error_message': self.msg}, self.status_code

    __repr__ = __str__

RespNotFound = lambda: APIError('API_NOT_FOUND', 404)
RespArtworkNotFound = lambda *args: APIError('ARTWORK_NOT_FOUND: {}'.format(', '.join(args)), 400)
RespInternal = lambda: APIError('INTERNAL_ERROR', 500)
RespUnauthorized = lambda: APIError('AUTHORIZATION_ERROR', 403)
RespMissingArg = lambda *args: APIError('MISSING_ARGUMENTS: {}'.format(', '.join(args)), 400)
RespBadArg= lambda *args: APIError('BAD_ARGUMENTS: {}'.format(', '.join(args)), 400)
RespInvalidArgFormat = lambda name: APIError('INVALID_{}_FORMAT'.format(name.upper()), 400)
RespInvalidImageFormat = lambda: APIError("IMAGE_ERROR_UNSUPPORTED_FORMAT", 400)
