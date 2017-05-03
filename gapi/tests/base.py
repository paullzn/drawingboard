#!/usr/bin/env python
from __future__ import (absolute_import)

from flask_testing import TestCase

from app import create_app
import test_config

_app = create_app()

class BaseTestCase(TestCase):
    """A base test case for flask-tracking."""

    def create_app(self):
        _app.config.from_object(test_config)
        return _app

    def setUp(self):
        pass

    def tearDown(self):
        pass
