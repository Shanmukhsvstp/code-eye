# Video Preview:

https://github.com/user-attachments/assets/b38d2ffa-50fd-4832-9fc5-1d5d68846c62


---
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup with npm and pip
1) Make a fork and clone this repo on your local machine
2) Run the following in your terminal
```bash
npm install
```
3) Don't worry about the severity vulnerabilities
4) Redirect to backend
5) Run the following in your terminal
```bash
cd backend
pip install -r requirements.txt
```


## Getting Started

First, run the nextjs development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then run the fastapi development server:
-# In `backend` dir
```
python -m app.main
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Database Methods:
Code Samples:
### Insert
```
from app.models import User

async def create_user(db):
    user = User(
        sub="123",
        email="test@gmail.com",
        name="Test",
        display_name="Test User",
        profile_picture=""
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)  # get generated fields (like id)

    return user
```
### Select
```
from sqlalchemy import select
async def get_user(db, user_id):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()
```
### Update
```
async def update_user_name(db, user_id, new_name):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        return None

    user.name = new_name

    await db.commit()
    await db.refresh(user)

    return user
```
### Delete
```
async def delete_user(db, user_id):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        return False

    await db.delete(user)
    await db.commit()

    return True
```


Other ReadMe Files are in respective directories for better idea on the data structures used in here!

# ENVs

Frontend env path: `/`
ENV:
```env
NEXT_PUBLIC_BACKEND_URL="your_python_backend_url"
```
Backend env path: `backend/`
ENV:
```env
DATABASE_URL="POSTGRESS_DB_URL"
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_REDIRECT_URI="YOUR_GOOGLE_REDIRECT_URL"
JWT_SECRET="YOUR_JWT_SECRET"
FRONTEND_URL="https://codeeye.vercel.app"
```

### Acknowledgements:
- [ChatGPT](https://chat.openai.com/) was used in this project to assist with newer libraries, the whole codebase has been developed by human.

