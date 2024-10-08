from logiclearner.settings_shared import *  # noqa: F403
from ctlsettings.staging import common, init_sentry
from django.conf import settings

locals().update(
    common(
        project=project,  # noqa: F405
        base=base,  # noqa: F405
        STATIC_ROOT=STATIC_ROOT,  # noqa: F405
        INSTALLED_APPS=INSTALLED_APPS,  # noqa: F405
        s3prefix='ccnmtl',
        # if you use cloudfront:
        #        cloudfront="justtheidhere",
        # if you don't use S3/cloudfront at all:
        #       s3static=False,
    ))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'logiclearner',
        'HOST': '',
        'PORT': 6432,
        'USER': '',
        'PASSWORD': '',
    }
}

try:
    from logiclearner.local_settings import *  # noqa: F403
except ImportError:
    pass

if hasattr(settings, 'SENTRY_DSN'):
    init_sentry(SENTRY_DSN)  # noqa F405
