# flake8: noqa
from logiclearner.settings_shared import *
from ctlsettings.compose import common

locals().update(
    common(
        project=project,
        base=base,
        STATIC_ROOT=STATIC_ROOT,
        INSTALLED_APPS=INSTALLED_APPS,
    ))

try:
    from logiclearner.local_settings import *
except ImportError:
    pass

if hasattr(settings, 'AWS_SECRET_KEY_ID'):
    client = boto3.client('ssm', region_name='us-east-1',
                          aws_access_key_id=AWS_SECRET_KEY_ID,   # noqa F405
                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY)   # noqa F405
    response = client.get_parameters(
        Names=[
            '/staging/rudderstack/FOL/RUDDERSTACK_WRITE_KEY',
            '/staging/rudderstack/backplane_url'
        ],
        WithDecryption=True
    )
    RUDDERSTACK_WRITE_KEY = response[0]['Value']
    RUDDERSTACK_BACKPLANE_URL = response[1]['Value']