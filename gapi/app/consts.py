#!/usr/bin/env python
# coding: utf-8

STATE_AUTH_FAILED = "AUTH_FAILED"  # 不能开始验证
STATE_NOT_STARTED = "NOT_STARTED"  # 尚未开始验证，可以开始验证
STATE_INPROGRESS = "INPROGRESS"  # 正在认证中的某一步
STATE_PASSED = "PASSED"  # 验证成功

WEB_PROXY_ADDR = 'http://10.170.198.39:3128'

BACKEND_API_TIMEOUT = 10

VERSION_BLACK_LIST = ('ZMCret 0.0.1A', 'ZMCret 0.0.1I')

THRESHOLDS_MAP = {
    'FACE_SDK_STRICT': '1e-5',
    'FACE_SDK': '1e-3'
}
