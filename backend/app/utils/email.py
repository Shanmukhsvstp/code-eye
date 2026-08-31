import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

FRONTEND_URL = os.getenv("FRONTEND_URL")
EMAIL_FROM = os.getenv("EMAIL_FROM")


async def sendPasswordResetEmail(
    email: str,
    token: str
):
    reset_url = (
        f"{FRONTEND_URL}"
        f"/auth/email/reset-password"
        f"?token={token}"
    )

    resend.Emails.send({
        "from": EMAIL_FROM,
        "to": [email],
        "subject": "Reset your CodeEye password",
        "html": f"""
            <h2>Reset your CodeEye password</h2>

            <p>
                We received a request to reset your password.
            </p>

            <p>
                <a href="{reset_url}">
                    Reset your password
                </a>
            </p>

            <p>
                This link expires in 30 minutes.
            </p>

            <p>
                If you didn't request this, you can safely ignore
                this email.
            </p>
        """
    })