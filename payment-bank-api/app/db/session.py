from contextlib import asynccontextmanager
from typing import Generator

from fastapi import FastAPI
from sqlmodel import Session, SQLModel, create_engine

from app.config.settings import settings
from app.services.consul_service import ConsulService

engine = create_engine(
    f"postgresql+psycopg2://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@"
    f"{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}",
    echo=False,
)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    from app.main import consul_service
    consul_service.register()
    yield
    consul_service.deregister()
