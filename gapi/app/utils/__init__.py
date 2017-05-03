#!/usr/bin/env python
import time
import uuid
def new_id():
    return '{},{}'.format(int(time.time()), uuid.uuid4())
