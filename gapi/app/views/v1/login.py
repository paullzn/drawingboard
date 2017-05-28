# coding: utf-8

import requests
from logging import getLogger

from flask import request
from flask_restful import Resource

from app import create_app
from app.models import Account, Session
from base import api_method
from app.exc import RespMissingArg, RespUnauthorized, RespBadArg

import config

log = getLogger(__name__)

api = create_app().api

class Login(Resource):

    def _wechatLoginByJSCode(self, app_name, code):
        if app_name == 'drawingboard':
            appid = config.WECHAT_LITEAPP_APPID
            appsecret = config.WECHAT_LITEAPP_SECRET
        elif app_name == 'eyes':
            appid = config.WECHAT_LITEAPP_EYES_APPID
            appsecret = config.WECHAT_LITEAPP_EYES_SECRET
        else:
            appid = ''
            appsecret = ''
        result = requests.get(config.WECHAT_LOGIN_BY_JSCODE_URL, {
            'appid': appid,
            'secret': appsecret,
            'js_code': code,
            'grant_type': 'authorization_code'
        }).json()

        openid = result.get('openid', '')
        if not openid:
            return None, None
        account = Account.get_or_create_by_liteapp_openid(app_name, openid)
        session = Session.update_or_create_session(
            account.id,
            result.get('session_key', ''),
            result.get('expires_in', 0) - config.SAFE_LOGIN_BUFFER
        )

        return account, session

    def _render(self, account, session):
        if not account or not session:
            raise RespUnauthorized()
        return {
            'id': account.id,
            'username': account.username,
            'token': session.token,
        }

    @api_method(task='login_post')
    def post(self):
        """
        @type must be wechat-litapp for now
        @msg when type == wechat-liteapp, it should be code from wechat JSAPI
        """
        login_type = request.values.get('type', '')
        msg = request.values.get('msg', '')
        app_name = request.values.get('app_name', 'drawingboard')

        if login_type != 'wechat-liteapp':
            raise RespBadArg('login_type')
        if not msg:
            raise RespMissingArg('msg')
        if login_type == 'wechat-liteapp':
            account, session = self._wechatLoginByJSCode(app_name, msg)
        return self._render(account, session)

api.add_resource(Login, '/api/v1/account/login')
