from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from logiclearner.main.models import Statement, Solution
from logiclearner.main.serializers import (
    StatementSerializer, SolutionSerializer
)
from rest_framework import generics


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


class StatementListAPIView(generics.ListAPIView):
    serializer_class = StatementSerializer

    def get_queryset(self):
        """
        This view should return a list of all the statements for
        the difficulty level determined by the difficulty portion of the URL.
        """
        difficulty = self.kwargs['difficulty']
        return Statement.objects.filter(difficulty=difficulty)


class SolutionListAPIView(generics.ListAPIView):
    serializer_class = SolutionSerializer

    def get_queryset(self):
        """
        This view should return a list of all the solution steps for a given
        statement determined by the statement pk in the URL.
        """
        statement_id = self.kwargs['statement']
        return Solution.objects.filter(statement__pk=statement_id)
