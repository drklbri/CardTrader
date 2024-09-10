from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def exceptions_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        response.data['status_code'] = response.status_code

    else:
        error_message = str(exc)
        response_data = {
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            'detail': 'Internal Server Error',
            'error_message': error_message,
        }
        response = Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
