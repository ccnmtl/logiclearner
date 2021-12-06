from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
# import requests


class IndexView(TemplateView):
    template_name = "main/index.html"


class SolutionApiView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(SolutionApiView, self).dispatch(*args, **kwargs)

    # def get(self, request):
    #     requests.request(
    #         "GET"
    #     )


class HintApiView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(HintApiView, self).dispatch(*args, **kwargs)
