#!/usr/bin/env python

from flask import _app_ctx_stack
from app import create_app
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.orm.session import Session

app = create_app()

Base = declarative_base()

class Database(object):
    def create_all(self):
        Base.metadata.create_all(self.engine)

    def drop_all(self):
        Base.metadata.drop_all(self.engine)

    def create_session(self, options):
        return Session(**options)

    def create_scoped_session(self, engine, options=None):
        """Helper factory method that creates a scoped session.  It
        internally calls :meth:`create_session`.
        """
        if options is None:
            options = {}
        create_session = sessionmaker()
        session = scoped_session(create_session, scopefunc=_app_ctx_stack.__ident_func__)
        session.configure(bind=engine)
        return session

    def __init__(self):

        def _make_engine(uri):
            try:
                engine = create_engine(uri,
                                       pool_size=app.config['SQLALCHEMY_POOL_SIZE'],
                                       pool_recycle=app.config['SQLALCHEMY_POOL_RECYCLE'])
            except TypeError:
                # The pool_size argument won't work for the default SQLite setup in SQLAlchemy 0.7, try without
                engine = create_engine(uri)
            self.uris.append(uri)
            self.engine = engine
            return engine

        def _make_session(engine):
            session_options = {}
            session_options.setdefault(
                'scopefunc', _app_ctx_stack.__ident_func__
            )
            session_options.setdefault(
                'bind', engine
            )
            return self.create_scoped_session(engine, session_options)

        self.engines = []
        self.uris = []
        self.sharding_uris = []
        self.engine = _make_engine(app.config['SQLALCHEMY_DATABASE_URI'])
        self.session = _make_session(self.engine)

db = Database()

from app.models.artwork import *
from app.models.account import *
from app.models.feedback import *
from app.models.session import *
from app.models.eyes import *
