from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.db.repositories.card import DebitCardRepository
from app.db.session import get_session
from app.schemas.card import DebitCardCreate, DebitCardRead, DebitCardUpdate
from app.services.card import (
    CreateDebitCardService,
    DeleteDebitCardService,
    ReadDebitCardService,
    UpdateDebitCardService,
)

router = APIRouter(
    prefix="/debit_card",
    tags=["debit_card"],
    responses={404: {"description": "Not found"}},
)


@router.get("/debit_card", response_model=list[DebitCardRead])
def read_debit_cards(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    """Retrieve all debit cards."""
    cards = ReadDebitCardService(repository=DebitCardRepository(session=session)).exec(
        skip=skip, limit=limit
    )
    return cards


@router.get("/debit_card/{card_id}", response_model=DebitCardRead | None)
def read_debit_card(card_id: int, session: Session = Depends(get_session)):
    """Retrieve a debit card by its ID."""
    card = DebitCardRepository(session=session).get_by_id(card_id)
    if card:
        return DebitCardRead.model_validate(card.model_dump())
    return None


@router.post("/debit_card", response_model=DebitCardRead)
def create_debit_card(card: DebitCardCreate, session: Session = Depends(get_session)):
    """Create a new debit card."""
    card_read: DebitCardRead = CreateDebitCardService(
        repository=DebitCardRepository(session=session)
    ).exec(data=card)
    return card_read


@router.patch("/debit_card/{card_id}", response_model=DebitCardRead | None)
def update_debit_card(
    card_id: int,
    card: DebitCardUpdate,
    session: Session = Depends(get_session),
):
    """Update an existing debit card."""

    updated_card = UpdateDebitCardService(
        repository=DebitCardRepository(session=session)
    ).exec(
        card_id=card_id,
        number=card.number,
        holder=card.holder,
        expiration=card.expiration,
        cvv=card.cvv,
        is_active=card.is_active,
    )
    if updated_card:
        return updated_card
    return None


@router.delete("/debit_card/{card_id}", response_model=bool)
def delete_debit_card(card_id: int, session: Session = Depends(get_session)):
    """Delete a debit card by its ID."""
    return DeleteDebitCardService(repository=DebitCardRepository(session=session)).exec(
        card_id=card_id
    )
