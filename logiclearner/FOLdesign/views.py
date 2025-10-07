from django.shortcuts import render
from django.views.generic.base import View


class Index(View):
    template_name = 'FOLdesign/index.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)


class FOLGrid(View):
    template_name = 'FOLdesign/grid.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)


class FOLSelect(View):
    template_name = 'FOLdesign/selectinput.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)


class FOLText(View):
    template_name = 'FOLdesign/textinput.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)


class FOLSettings(View):
    template_name = 'FOLdesign/settings.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
