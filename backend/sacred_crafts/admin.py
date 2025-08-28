from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.utils import translation
from django.conf import settings


class BilingualAdminSite(AdminSite):
    """Custom admin site with bilingual support."""
    
    def get_app_list(self, request):
        """Override to add language switcher to the admin."""
        app_list = super().get_app_list(request)
        
        # Add language switcher to the admin
        current_language = translation.get_language()
        language_switcher = {
            'name': _('Language / 语言'),
            'app_label': 'language',
            'app_url': '#',
            'has_module_perms': True,
            'models': [
                {
                    'name': _('English') if current_language == 'zh-hans' else 'English',
                    'object_name': 'english',
                    'admin_url': reverse('switch_language', args=['en']),
                    'view_only': True,
                },
                {
                    'name': _('中文') if current_language == 'en' else '中文',
                    'object_name': 'chinese',
                    'admin_url': reverse('switch_language', args=['zh-hans']),
                    'view_only': True,
                }
            ]
        }
        
        # Insert language switcher at the beginning
        app_list.insert(0, language_switcher)
        return app_list


# Create custom admin site instance
admin_site = BilingualAdminSite(name='bilingual_admin')

# Set admin site titles for both languages
def get_admin_title(language_code):
    """Get admin title based on language."""
    if language_code == 'zh-hans':
        return {
            'site_header': '神圣工艺市场管理后台',
            'site_title': '神圣工艺市场',
            'index_title': '欢迎来到神圣工艺市场管理后台'
        }
    else:
        return {
            'site_header': 'Sacred Craft Marketplace Admin',
            'site_title': 'Sacred Craft Marketplace',
            'index_title': 'Welcome to Sacred Craft Marketplace Admin'
        }


# Set titles based on current language
current_lang = translation.get_language()
titles = get_admin_title(current_lang)
admin_site.site_header = titles['site_header']
admin_site.site_title = titles['site_title']
admin_site.index_title = titles['index_title']


# Override the default admin site
admin.site = admin_site
