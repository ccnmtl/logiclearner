# flake8: noqa
from logiclearner.settings_shared import *

try:
    from logiclearner.local_settings import *
except ImportError:
    pass
