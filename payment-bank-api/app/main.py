from fastapi import FastAPI

from app.api.v1.routes import bank, credit_card, debit_card
from app.db.session import lifespan
from app.services.consul_service import ConsulService

app = FastAPI(
    title="UFRPE APSOO Card Bank CRUD",
    description="A simple CRUD application for managing credit cards and bank accounts.",
    version="1.0.0",
    lifespan=lifespan,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

consul_service = ConsulService()

@app.get("/health")
def health_check():
    return {"status": "UP"}

app.include_router(bank.router, prefix="/api/v1", tags=["bank"])
app.include_router(debit_card.router, prefix="/api/v1", tags=["debit_card"])
app.include_router(credit_card.router, prefix="/api/v1", tags=["credit_card"])
