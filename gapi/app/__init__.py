# coding: utf-8

import time
import uuid

from logging import getLogger
from flask_restful import Api
from flask import (
    Flask, g, got_request_exception, request_finished, request_started
)
from werkzeug.utils import find_modules
from app.libs.logger import init_logger, log_request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import config
import simplejson as json

LOG = getLogger(__name__)

def configure_foundations(app):
    from app.models import db

    init_logger(app)
    @app.teardown_request
    def teardown_request(exception=None):
        db.session.remove()

def configure_modules(app):
    import app.views.v1.artwork

_app = None

def create_app():
    global _app
    if _app is not None:
        return _app
    _app = Flask(__name__)
    _app.config.from_object(config)
    _app.api = Api(_app)

    configure_foundations(_app)
    configure_modules(_app)

    return _app

_app = create_app()

