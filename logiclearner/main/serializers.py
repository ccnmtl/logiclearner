from rest_framework import serializers
from logiclearner.main.models import Statement, Solution


class StatementSerializer(serializers.ModelSerializer):

    class Meta:
        model = Statement
        fields = ['pk', 'question', 'answer', 'difficulty', 'created_at',
                  'modified_at']


class SolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solution
        fields = ['pk', 'statement', 'ordinal', 'text', 'created_at',
                  'law', 'modified_at']
