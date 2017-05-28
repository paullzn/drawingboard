# coding: utf-8

import base64
from logging import getLogger

from flask import request, g
from flask_restful import Resource

from app import create_app
from app.models import db, Artwork
from base import api_method
from app.exc import RespMissingArg
from app.libs import oss

log = getLogger(__name__)

api = create_app().api

class ArtworkAPI(Resource):

    @api_method(task='artwork_post', login_required=True)
    def post(self):
        """
        @artwork_id artwork_id
        @image file image of the artwork
        """
        artwork_id = request.values.get('artwork_id', '')

        if not artwork_id:
            raise RespMissingArg('artwork_id')
        elif 'image' not in request.files:
            raise RespMissingArg('image')
        else:
            oss.put(artwork_id, request.files.get('image'))
            Artwork.create_unless_exists(g.account.id, artwork_id)
            artwork = db.session.query(Artwork).filter(Artwork.accountid == g.account.id, Artwork.artwork_id == artwork_id).first()
            if not artwork:
                artwork = Artwork()
                artwork.accountid = g.account.id
                artwork.artwork_id = artwork_id
                db.session.add(artwork)
        return {'artwork_id': artwork_id}

    @api_method(task='artwork_get', login_required=True)
    def get(self, artwork_id=None):
        artwork_id = request.values.get('artwork_id', '')
        query = db.session.query(Artwork).filter(Artwork.accountid == g.account.id)
        if artwork_id:
            query = query.filter(Artwork.artwork_id == artwork_id)
        return {
            'artworks': [{
                'artwork_id': artwork.artwork_id,
                'image': base64.b64encode(oss.get(artwork.artwork_id))
            }] for artwork in query.all()
        }

api.add_resource(ArtworkAPI, '/api/v1/artwork')
