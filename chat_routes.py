from fastapi import APIRouter

chat_router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    
@chat_router.post("/")
async def chat(message: str):
    # Aqui você pode processar a mensagem recebida e gerar uma resposta
    response = f"Você disse: {message}"
    return {"response": response}