from logiclearner.main.models import Statement, Solution


class LogicLearnerTestMixin(object):

    def create_level_one(self):
        statement1 = Statement.objects.create(
            question='(pvq)v(pv~q)', answer='T', difficulty=0)
        Solution.objects.create(statement=statement1,
                                ordinal=1, text='(pvq)v(pv~q)',
                                law='start')
        Solution.objects.create(statement=statement1,
                                ordinal=2, text='pvqvpv~q',
                                law='Associativity')
        Solution.objects.create(statement=statement1,
                                ordinal=3, text='pvpvT',
                                law='Negation')
        Solution.objects.create(statement=statement1,
                                ordinal=4, text='T',
                                law='Domination')

        statement2 = Statement.objects.create(
            question='~(~p)', answer='p', difficulty=0)
        Solution.objects.create(statement=statement2,
                                ordinal=1, text='~(~p)',
                                law='Start')
        Solution.objects.create(statement=statement2,
                                ordinal=2, text='p',
                                law='Double Negation')

    def create_level_two(self):
        statement1 = Statement.objects.create(
            question='(pvq)^(pv~q)', answer='p', difficulty=1)
        Solution.objects.create(statement=statement1,
                                ordinal=1, text='(pvq)^(pv~q)',
                                law='start')
        Solution.objects.create(statement=statement1,
                                ordinal=2, text='pv(q^~q)',
                                law='Distributivity')
        Solution.objects.create(statement=statement1,
                                ordinal=3, text='pvF',
                                law='Negation')
        Solution.objects.create(statement=statement1,
                                ordinal=4, text='p',
                                law='Identity')

        statement2 = Statement.objects.create(
            question='(~qvq)^~r^p^r', answer='F', difficulty=1)
        Solution.objects.create(statement=statement2,
                                ordinal=1, text='(~qvq)^~r^p^r',
                                law='Start')
        Solution.objects.create(statement=statement2,
                                ordinal=2, text='(~qvq)^F^p',
                                law='Negation')
        Solution.objects.create(statement=statement2,
                                ordinal=3, text='F',
                                law='Domination')

    def create_level_three(self):
        statement1 = Statement.objects.create(
            question='~(~r^~(~(p^(qvq))))', answer='(p^q)->r', difficulty=2)
        Solution.objects.create(statement=statement1,
                                ordinal=1, text='~(~r^~(~(p^(qvq))))',
                                law='start')
        Solution.objects.create(statement=statement1,
                                ordinal=2, text='~(~r^~~(p^q))',
                                law='Idempotence')
        Solution.objects.create(statement=statement1,
                                ordinal=3, text='~(~r^(p^q))',
                                law='Double Negation')
        Solution.objects.create(statement=statement1,
                                ordinal=4, text='rv~(p^q)',
                                law="De Morgan's Law")
        Solution.objects.create(statement=statement1,
                                ordinal=5, text='~(p^q)vr',
                                law="Commutativity")
        Solution.objects.create(statement=statement1,
                                ordinal=6, text='(p^q)->r',
                                law="Implication as Disjunction")
