from django.test.testcases import TestCase
from logiclearner.main.models import Statement, Solution
from logiclearner.main.serializers import (StatementSerializer,
                                           SolutionSerializer)


class StatementSerializerTest(TestCase):
    def setUp(self):
        self.statement_info = {
            'question': 'F->T',
            'answer': 'T',
            'difficulty': 0
        }
        self.statement = Statement.objects.create(**self.statement_info)
        self.serializer = StatementSerializer(instance=self.statement)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['pk', 'question', 'answer',
                         'difficulty', 'created_at', 'modified_at']))
        self.assertEqual(data['question'], 'F->T')
        self.assertEqual(data['answer'], 'T')
        self.assertEqual(data['difficulty'], 0)

    def test_invalid_values(self):
        self.statement_info['difficulty'] = 5
        serializer = StatementSerializer(data=self.statement_info)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(set(serializer.errors), set(['difficulty']))


class SolutionSerializerTest(TestCase):
    def setUp(self):
        self.statement_info = {
            'question': 'F->T',
            'answer': 'T',
            'difficulty': 0
        }
        self.statement = Statement.objects.create(**self.statement_info)
        self.solution = Solution.objects.create(
                                            statement=self.statement,
                                            ordinal=1, text='~FvT',
                                            law='Implication as Disjunction')
        self.serializer = SolutionSerializer(instance=self.solution)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['pk', 'statement', 'ordinal',
                                                'text', 'created_at', 'law',
                                                'modified_at']))
        self.assertEqual(data['ordinal'], 1)
        self.assertEqual(data['text'], '~FvT')
        self.assertEqual(data['law'], 'Implication as Disjunction')
