from django.test import TestCase
from logiclearner.main.tests.factories import SolutionFactory, StatementFactory


class BasicTest(TestCase):
    def test_root(self):
        response = self.client.get("/")
        self.assertEquals(response.status_code, 200)

    def test_smoketest(self):
        response = self.client.get("/smoketest/")
        self.assertEquals(response.status_code, 200)
        self.assertContains(response, 'PASS')


class StatementListAPIViewTest(TestCase):
    def setUp(self):
        self.statement = StatementFactory()
        self.statement1 = StatementFactory()

    def test_get(self):
        response = self.client.get('/api/statements/0/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['question'], 'F->T')


class SolutionListAPIView(TestCase):
    def setUp(self):
        self.statement = StatementFactory()
        self.solution = SolutionFactory(statement=self.statement)
        self.solution1 = SolutionFactory(statement=self.statement)

    def test_get(self):
        response = self.client.get('/api/solution/{}/'.format(
                                                            self.statement.pk))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['ordinal'], 1)
