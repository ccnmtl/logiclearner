import factory
from logiclearner.main.models import Statement, Solution


class StatementFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Statement
    question = 'F->T'
    answer = 'T'
    difficulty = 0


class SolutionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Solution

    statement = factory.SubFactory(StatementFactory)
    ordinal = 1
    text = '~FvT'
    law = 'Implication as Disjunction'
