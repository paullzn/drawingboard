import time
import uuid
from cStringIO import StringIO
import simplejson as json

from base import BaseTestCase

class ArtworkTestCase(BaseTestCase):
    base_keys = ['time_used', 'request_id']

    def test_artwork_get(self):
        data = json.loads(self.client.get('/api/v1/artwork').data)
        self.assertEqual(
            set(self.base_keys + ['artwork_id']),
            set(data.keys())
        )
        self.assertEqual(',', data['artwork_id'][10])
        self.assertEqual(len(str(uuid.uuid4())) + 1 + len(str(int(time.time()))), len(data['artwork_id']))

    def test_artwork_post(self):
        rv = self.client.post('/api/v1/artwork')
        self.assertEqual(400, rv.status_code)
        data = json.loads(rv.data)
        self.assertEqual(
            set(self.base_keys + ['error_message']),
            set(data.keys())
        )
        self.assertEqual('MISSING_ARGUMENTS: artwork_id', data['error_message'])

        rv = self.client.post('/api/v1/artwork', data={'artwork_id': '123', 'image': (StringIO('test image file'), 'image.jpg')})
        data = json.loads(rv.data)
        print data
        self.assertEqual(200, rv.status_code)

