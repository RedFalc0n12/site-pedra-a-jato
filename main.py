from fastapi import FastAPI

app = FastAPI()

from auth_routes import auth_router
from chat_routes import chat_router

app.include_router(auth_router)
app.include_router(chat_router) 


# para rodar o servidor: uvicorn main:app --reload