from django.shortcuts import redirect
from django.utils import translation
from django.conf import settings
from django.http import HttpResponseRedirect
from django.urls import reverse


def switch_language(request, language_code):
    """Switch the current language for the user session."""
    if language_code in [lang[0] for lang in settings.LANGUAGES]:
        translation.activate(language_code)
        request.session[translation.LANGUAGE_SESSION_KEY] = language_code
    
    # Redirect back to the previous page or admin
    referer = request.META.get('HTTP_REFERER')
    if referer:
        return HttpResponseRedirect(referer)
    else:
        return redirect('admin:index')
