import hashlib
import secrets


def generateResetToken() -> str:
    return secrets.token_urlsafe(48)


def hashResetToken(token: str) -> str:
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()