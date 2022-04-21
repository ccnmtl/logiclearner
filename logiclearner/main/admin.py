from django.contrib import admin
from logiclearner.main.models import Statement, Solution


class SolutionInLine(admin.TabularInline):
    model = Solution


class StatementAdmin(admin.ModelAdmin):
    list_display = ("question", "difficulty", "created_at", "modified_at")
    list_filter = ("difficulty", "created_at", "modified_at")
    inlines = [
        SolutionInLine
    ]


admin.site.register(Statement, StatementAdmin)
admin.site.register(Solution)
