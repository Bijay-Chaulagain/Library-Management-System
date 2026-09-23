# core/utils.py

from rest_framework_simplejwt.tokens import RefreshToken


def generate_tokens_for_user(user):
    """
    Generates access + refresh JWT pair for the given user.
    Custom claims are embedded so the frontend doesn't need
    an extra call to get basic user info.
    """
    refresh = RefreshToken.for_user(user)

    # Embed custom claims into the token payload
    refresh['username'] = user.username
    refresh['email'] = user.email
    refresh['role'] = user.role

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }