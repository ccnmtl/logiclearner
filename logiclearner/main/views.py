from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from logictools.next_step import next_step, get_hint


class IndexView(TemplateView):
    template_name = "main/index.html"


def handler404(request):
    return render(request, '404.html')


@method_decorator(csrf_exempt, name='dispatch')
class ValidateApiView(APIView):

    def post(self, request):
        next_expr = request.data.get('next_expr', None)
        next_rule = request.data.get('rule', None)
        step_list = request.data.get('step_list', None)
        target = request.data.get('answer', None)

        data = next_step(next_expr, next_rule, step_list, target)

        return Response(data, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class HintApiView(APIView):

    def post(self, request):
        next_expr = request.data.get('next_expr', None)
        next_rule = request.data.get('rule', None)
        step_list = request.data.get('step_list', None)
        target = request.data.get('answer', None)
        data = get_hint(next_expr, next_rule, step_list, target)

        return Response(data, status=200)
