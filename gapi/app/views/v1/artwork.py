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

class Artwork(Resource):

    @api_method(task='artwork_post')
    def post(self):
        """
        @image file image of the artwork
        """
        artwork_id = request.values.get('artwork_id', '')
        
        if not artwork_id:
            raise RespMissingArg('artwork_id')
        elif 'image' not in request.files:
            raise RespMissingArg('image')
        else: 
            oss.put(artwork_id, request.files.get('image'))
        return {'artwork_id': artwork_id}

    @api_method(task='artwork_get')
    def get(self, artwork_id=None):
        artwork_id = request.values.get('artwork_id', '')
        if not artwork_id:
            return {
                'artwork_id': new_id()
            }
        else:
            return {
                'artwork_id': artwork_id,
                'image': base64.b64encode(oss.get(artwork_id))
            }

api.add_resource(Artwork, '/api/v1/artwork')
