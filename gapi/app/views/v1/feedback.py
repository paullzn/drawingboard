# coding: utf-8

from logging import getLogger

from flask import request, g
from flask_restful import Resource

from app import create_app
from base import api_method
from app.exc import RespMissingArg
from app.models import db, Feedback

import config

log = getLogger(__name__)

api = create_app().api

class FeedbackAPI(Resource):

    @api_method(task='feedback_post', login_required=True)
    def post(self):
        """
        @content content of feedback
        """
        content = request.values.get('content', '')

        if not content:
            raise RespMissingArg('content')
        else:
            feedback = Feedback(
                accountid = g.account.id,
                content = content)
            db.session.add(feedback)
            db.session.commit()
        return {'feedback_id': feedback.id, 'content': feedback.content}

    @api_method(task='feedback_get')
    def get(self, artwork_id=None):
        """
        @account_id optional filter by account_id
        @feedback_id optional filter by feedback_id
        """
        secret = request.values.get('secret', '')
        print secret
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
        return {
            'feedbacks': [{
                'id': feedback.id,
                'account_id': feedback.accountid,
                'content': feedback.content,
                'created_at': feedback.created_at.strftime(config.DTFORMAT),
                'modified_at': feedback.modified_at.strftime(config.DTFORMAT)
            } for feedback in feedbacks]
        }

api.add_resource(FeedbackAPI, '/api/v1/feedback')
