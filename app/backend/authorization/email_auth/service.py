import os

from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from authorization.email_auth.account_activation import account_activation_token


def send_email_user(user):
    subject = "Notice from Card Trader"
    #domain = os.getenv('SITE_DOMAIN')
    #print(domain)
    #print(f"Using domain: {domain}")
    message = render_to_string('activation_link.html', {
        'user': user,
        'domain': 'localhost:8000',
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
    })
    email = EmailMessage(subject, message, to=[user.email])
    email.content_subtype = 'html'
    email.send()
