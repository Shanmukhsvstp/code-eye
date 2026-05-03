class Message:
    
    @staticmethod
    def user_joined(user_id, role):
        return {
            "type": "user_joined",
            "user_id": user_id,
            "role": role
        }

    @staticmethod
    def user_left(user_id):
        return {
            "type": "user_left",
            "user_id": user_id
        }

    @staticmethod
    def code_update(user_id, line, content, stress_score=None):
        msg = {
            "type": "code_update",
            "user_id": user_id,
            "line": line,
            "content": content
        }

        if stress_score is not None:
            msg["stress_score"] = stress_score

        return msg

    @staticmethod
    def full_sync(code, users, admins):
        return {
            "type": "full_sync",
            "code": code,
            "users": users,
            "admins": admins
        }

    @staticmethod
    def role_update(user_id, role):
        return {
            "type": "role_update",
            "user_id": user_id,
            "role": role
        }

    @staticmethod
    def error(message):
        return {
            "type": "error",
            "message": message
        }