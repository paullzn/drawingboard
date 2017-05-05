# coding: utf-8

import base64
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

class Feedback(Resource):

    @api_method(task='feedback_post')
    def post(self):
        """
        @account_id user account_id 
        @content content of feedback
        """
        account_id = request.values.get('account_id', '')
        content = request.values.get('content', '')
        
        if not account_id:
            raise RespMissingArg('account_id')
        elif not content:
            raise RespMissingArg('content')
        else: 
            feedback = Feedback(
                accountid = account_id,
                content = content)
            db.session.add(feedback)
            db.session.commit()
        return {'feedback_id': feedback.id, 'content', feedback.content}

    @api_method(task='feedback_get')
    def get(self, artwork_id=None):
        """
        @account_id optional filter by wx_openid
        @feedback_id optional filter by feedback_id
        """
        secret = request.values.get('secret', '')
        if secret != 'PAULLZNHAHAHA':
            return {}

        feedback_id = request.values.get('feedback_id', '')
        account_id = request.values.get('account_id', '')
        query = db.session.query(Feedback)
        if feedback_id:
            query = query.filter(Feedback.id == feedback_id)
        if account_id:
            query = query.filter(Feedback.accountid == account_id)
        return self._render(query.all())

    def _render(self, feedbacks):
        return [{
            'id': feedback.id,
            'account_id': feedback.accountid,
            'content': feedback.content,
            'created_at': feedback.created_at.strftime(config.DTFORMAT),
            'modified_at': feedback.modified_at.strftime(config.DTFORMAT)
        } for feedback in feedbacks]

api.add_resource(Feedback, '/api/v1/feedback')
