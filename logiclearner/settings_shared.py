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
    'django_cas_ng',
    'rest_framework',
    'logiclearner.main',
    'contactus'
]

MIDDLEWARE += [ # noqa
    'django_cas_ng.middleware.CASMiddleware',
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'django_cas_ng.backends.CASBackend'
]

CAS_SERVER_URL = 'https://cas.columbia.edu/cas/'
CAS_VERSION = '3'
CAS_ADMIN_REDIRECT = False

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(base, "templates"),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
                # list if you haven't customized them:
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.template.context_processors.request',
                'django.contrib.messages.context_processors.messages',
                'stagingcontext.staging_processor',
                'gacontext.ga_processor'
            ],
        },
    },
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
