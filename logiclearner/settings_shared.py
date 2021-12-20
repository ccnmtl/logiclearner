# Django settings for logiclearner project.
import os.path
from ccnmtlsettings.shared import common
import sys

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
    'rest_framework',
    'logiclearner.main',
    'contactus'
]

CONTACT_US_EMAIL = 'ctl-logiclearner@columbia.edu'
SERVER_EMAIL = 'automated@mail.ctl.columbia.edu'

THUMBNAIL_SUBDIR = "thumbs"
LOGIN_REDIRECT_URL = "/"

ACCOUNT_ACTIVATION_DAYS = 7

# customizing-type-of-auto-created-primary-keys
# https://docs.djangoproject.com/en/3.2/releases/3.2/
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

if 'integrationserver' in sys.argv:
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    PASSWORD_HASHERS = (
        'django.contrib.auth.hashers.MD5PasswordHasher',
    )

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
            'HOST': '',
            'PORT': '',
            'USER': '',
            'PASSWORD': '',
            'ATOMIC_REQUESTS': True,
        }
    }
