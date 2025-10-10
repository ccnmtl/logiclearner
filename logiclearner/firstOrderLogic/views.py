from django.shortcuts import render
from django.views.generic.base import View


class Index(View):
    template_name = 'firstorderlogic/index.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)


class Design(View):
    template_name = 'firstorderlogic/design.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)


class FOLGrid(View):
    template_name = 'firstorderlogic/grid.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)


class FOLSelect(View):
    template_name = 'firstorderlogic/selectinput.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)


class FOLText(View):
    template_name = 'firstorderlogic/textinput.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)


class FOLSettings(View):
    template_name = 'firstorderlogic/settings.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
