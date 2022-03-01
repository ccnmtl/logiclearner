from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from logiclearner.main.models import Statement, Solution
from logiclearner.main.serializers import (
    StatementSerializer, SolutionSerializer
)
from rest_framework import generics
from rest_framework.response import Response
from django.http.response import Http404
from django.shortcuts import render, get_object_or_404
from logictools.next_step import next_step


class IndexView(TemplateView):
    template_name = "main/index.html"


def handler404(request):
    return render(request, '404.html')


class SolutionApiView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(SolutionApiView, self).dispatch(*args, **kwargs)


class HintApiView(APIView):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(HintApiView, self).dispatch(*args, **kwargs)

    def post(self, request):
        next_expr = request.data.get('next_expr')
        next_rule = request.data.get('rule')
        step_list = request.data.get('step_list')
        target = request.data.get('answer')

        data = next_step(next_expr, next_rule, step_list, target)

        return Response(data, status=200)


class StatementListAPIView(generics.ListAPIView):
    serializer_class = StatementSerializer

    def get_queryset(self):
        """
        This view should return a list of all the statements for
        the difficulty level determined by the difficulty portion of the URL.
        """
        difficulty = self.kwargs.get('difficulty', None)

        if not difficulty:
            raise Http404()

        return Statement.objects.filter(difficulty=difficulty)


class SolutionListAPIView(generics.ListAPIView):
    serializer_class = SolutionSerializer

    def get_queryset(self):
        """
        This view should return a list of all the solution steps for a given
        statement determined by the statement pk in the URL. In order.
        """
        statement = get_object_or_404(
            Statement, pk=self.kwargs.get('statement'))

        return Solution.objects.filter(
            statement=statement).order_by('ordinal')


class StatementAPIView(generics.RetrieveAPIView):
    serializer_class = StatementSerializer

    def get_queryset(self):
        """
        This view should return one statement for a given pk.
        """
        statement = get_object_or_404(
            Statement, pk=self.kwargs.get('pk'))

        return Statement.objects.filter(pk=statement.pk)
