# coding: utf-8

import base64
import requests
from logging import getLogger

from flask import Blueprint, request, g
from flask_restful import Resource, reqparse

from app import create_app
from app.utils import new_id
from base import api_method
from app.exc import RespMissingArg
from app.libs import oss

log = getLogger(__name__)

api = create_app().api

class Login(Resource):

    def _wechatLoginByJSCode(self, code):
        result = requests.get(config.WECHAT_LOGIN_BY_JSCODE_URL, {
            'appid': config.WECHAT_LITEAPP_APPID,
            'secret': config.WECHAT_LITEAPP_SECRET,
            'js_code': msg,
            'grant_type': 'authorization_code'
        }).json()

        openid = result.get('data', {}).get('openid', '')
        Account.get_or_create_by_liteapp_openid(openid)

        return account

    def _render(self, account):
        return {
            'id': account.id,
            'username', account.username,
            'wx_liteapp_openid': account.wx_liteapp_openid,
            'phone': account.phone,
            'created_at': account.created_at.strftime(config.DTFORMAT),
            'modified_at': account.modified_at.strftime(config.DTFORMAT)
        }

    @api_method(task='login_post')
    def post(self):
        """
        @type must be wechat-litapp for now
        @msg when type == wechat-liteapp, it should be code from wxJSAPI
        """
        login_type = request.values.get('type', '')
        msg = request.values.get('msg', '')
        
        if login_type != 'wechat-liteapp':
            raise RespBadArg('login_type')
        if not code:
            raise RespMissingArg('msg')
        account = self._wechatLoginByJSCode(msg)
        
        return self._render(account)

api.add_resource(Login, '/api/v1/account/login')

