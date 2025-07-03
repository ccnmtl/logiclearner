# Django settings for logiclearner project.
import os.path
from ctlsettings.shared import common
import sys

project = 'logiclearner'
base = os.path.dirname(__file__)

locals().update(common(project=project, base=base))

PROJECT_APPS = [
    'logiclearner.main',
]

USE_TZ = True

INSTALLED_APPS += [  # noqa
    'django_extensions',
    'rest_framework',
    'logiclearner.main',
    'contactus',
]

MIDDLEWARE += [ # noqa
    'django_cas_ng.middleware.CASMiddleware',
]

# Translate CUIT's CAS user attributes to the Django user model.
# https://cuit.columbia.edu/content/cas-3-ticket-validation-response
CAS_APPLY_ATTRIBUTES_TO_USER = True
CAS_RENAME_ATTRIBUTES = {
    'givenName': 'first_name',
    'lastName': 'last_name',
    'mail': 'email',
}

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
                'ctlsettings.context_processors.env',
                'gacontext.ga_processor'
            ],
        },
    },
]

CONTACT_US_EMAIL = 'ctl-dev@columbia.edu'
SERVER_EMAIL = 'logiclearner-noreply@mail.ctl.columbia.edu'
EMAIL_SUBJECT_PREFIX = 'Logic Learner Contact Request'

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
