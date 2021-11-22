from django.views.generic.base import TemplateView
from rest_framework import status
from rest_framework.response import Response
from django.http import HttpResponseBadRequest
from django.shortcuts import get_object_or_404, redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
# from rest_framework.response import Response
from rest_framework.views import APIView
# import requests
# import json
from django.http import HttpResponseRedirect

class IndexView(TemplateView):
    template_name = "main/index.html"


class SolutionApiView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(SolutionApiView, self).dispatch(*args, **kwargs)


class HintApiView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(HintApiView, self).dispatch(*args, **kwargs)
