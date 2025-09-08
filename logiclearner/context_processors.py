from django.conf import settings


def rudderstack_settings(request):
    return {
        'RUDDERSTACK_WRITE_KEY': getattr(
            settings, 'RUDDERSTACK_WRITE_KEY', ''
        ),
        'RUDDERSTACK_BACKPLANE_URL': getattr(
            settings, 'RUDDERSTACK_BACKPLANE_URL', ''
        ),
    }
