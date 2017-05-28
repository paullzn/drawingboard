# coding: utf-8

from logging import getLogger
from flask_restful import Api
from flask import Flask
from app.libs.logger import init_logger

import config

LOG = getLogger(__name__)

def configure_foundations(app):
    from app.models import db

    init_logger(app)
    @app.teardown_request
    def teardown_request(exception=None):
        db.session.remove()

def configure_modules(app):
    import app.views.v1.artwork
    import app.views.v1.feedback
    import app.views.v1.login
    import app.views.v1.eyes

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

