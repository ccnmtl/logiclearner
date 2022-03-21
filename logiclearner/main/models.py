from django.db import models

DIFFICULTY = [
    (0, 'Novice'),
    (1, 'Learner'),
    (2, 'Apprentice')
]


class Statement(models.Model):
    question = models.TextField()
    answer = models.TextField()
    difficulty = models.PositiveSmallIntegerField(
        choices=DIFFICULTY
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['pk']


class Solution(models.Model):
    statement = models.ForeignKey(Statement, on_delete=models.CASCADE)
    ordinal = models.IntegerField()
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['ordinal']
