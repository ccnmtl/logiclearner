from django.urls import include, path, re_path
from django.contrib import admin
from django.conf import settings
from django.views.generic import TemplateView
from django.views.static import serve
from logiclearner.main import views

admin.autodiscover()

urlpatterns = [
    re_path(r'^api/hint', views.HintApiView.as_view()),
    re_path(r'^api/solution', views.SolutionApiView.as_view()),
    path('contact/', include('contactus.urls')),
    path('admin/', admin.site.urls),
    path('stats/', TemplateView.as_view(template_name="stats.html")),
    path('smoketest/', include('smoketest.urls')),
    path('infranil/', include('infranil.urls')),
    path('uploads/<str:path>',
         serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^(?:.*)/?$', views.IndexView.as_view()),
    path('', views.IndexView.as_view()),
]


if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path(r'__debug__/', include(debug_toolbar.urls)),
    ]
