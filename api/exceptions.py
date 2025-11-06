from typing import Any, Dict

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc: Exception, context: Dict[str, Any]):
    """
    Return unified error responses:
    - ValidationError -> {"errors": {field: [messages]}}
    - Other known errors -> keep DRF format if it already has {detail}
    - Fallback -> {"detail": str(exc)} with 500 status
    """
    # Normalize Django's ValidationError to DRF one
    if isinstance(exc, DjangoValidationError):
        try:
            detail = exc.message_dict  # type: ignore[attr-defined]
        except Exception:
            detail = exc.messages
        exc = ValidationError(detail)

    response = exception_handler(exc, context)

    if response is None:
        return Response({"detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if isinstance(exc, ValidationError):
        data = response.data
        # Ensure shape: {errors: {...}}
        response.data = {"errors": data if isinstance(data, dict) else {"non_field_errors": data}}
        return response

    # Ensure other errors have {detail}
    if isinstance(response.data, dict) and "detail" not in response.data:
        response.data = {"detail": str(exc)}

    return response
