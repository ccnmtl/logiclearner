from django.urls import include, path, re_path
from django.contrib import admin
from django.conf import settings
from django.views.generic import TemplateView
from django.views.static import serve
from logiclearner.main import views
from django_cas_ng import views as cas_views
from django.contrib.flatpages import views as flatpage_views

admin.autodiscover()


urlpatterns = [

    path('contact/', include('contactus.urls')),
    path('admin/', admin.site.urls),
    path('accounts/login/', views.handler404),
    path('accounts/logout/', views.handler404),
    re_path(r'^accounts/', include('django.contrib.auth.urls')),
    path('cas/login', cas_views.LoginView.as_view(),
         name='cas_ng_login'),
    path('cas/logout', cas_views.LogoutView.as_view(),
         name='cas_ng_logout'),
    path('stats/', TemplateView.as_view(template_name="stats.html")),
    path('smoketest/', include('smoketest.urls')),
    path('uploads/<str:path>',
         serve, {'document_root': settings.MEDIA_ROOT}),
    path('robots.txt', TemplateView.as_view(template_name="robots.txt",
         content_type="text/plain")),

    # API paths
    re_path('^api/statement/(?P<pk>.+)/$',
            views.StatementAPIView.as_view()),
    re_path('^api/statements/(?P<difficulty>.+)/$',
            views.StatementListAPIView.as_view()),
    re_path('^api/solution/(?P<statement>.+)/$',
            views.SolutionListAPIView.as_view()),
    re_path(r'^api/validate', views.ValidateApiView.as_view()),
    re_path(r'^api/hint', views.HintApiView.as_view()),

    path('about/', flatpage_views.flatpage, {'url': '/about/'}, name='about'),
    path('teaching/', flatpage_views.flatpage, {'url': '/teaching/'},
         name='teaching'),
    path('tutorial/', TemplateView.as_view(
        template_name="main/tutorial.html")),

    re_path(r'^(?:.*)/?$', views.IndexView.as_view()),
    path('', views.IndexView.as_view()),
]


if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path(r'__debug__/', include(debug_toolbar.urls)),
    ]
