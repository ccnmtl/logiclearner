# Django settings for logiclearner project.
import os.path
from ccnmtlsettings.shared import common

project = 'logiclearner'
base = os.path.dirname(__file__)

locals().update(common(project=project, base=base))

PROJECT_APPS = [
    'logiclearner.main',
]

USE_TZ = True

INSTALLED_APPS += [  # noqa
    'bootstrap4',
    'infranil',
    'django_extensions',

    'logiclearner.main',
]


THUMBNAIL_SUBDIR = "thumbs"
LOGIN_REDIRECT_URL = "/"

ACCOUNT_ACTIVATION_DAYS = 7
