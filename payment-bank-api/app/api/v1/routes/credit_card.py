from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.db.repositories.card import CreditCardRepository
from app.db.session import get_session
from app.schemas.card import CreditCardCreate, CreditCardRead, CreditCardUpdate
from app.services.card import (
    CreateCreditCardService,
    DeleteCreditCardService,
    ReadCreditCardService,
    UpdateCreditCardService,
)

router = APIRouter(
    prefix="/credit_card",
    tags=["credit_card"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[CreditCardRead])
def read_credit_cards(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    """Retrieve all credit cards."""
    cards = ReadCreditCardService(
        repository=CreditCardRepository(session=session)
    ).exec(skip=skip, limit=limit)
    return cards


@router.get("/{card_id}", response_model=CreditCardRead | None)
def read_credit_card(card_id: int, session: Session = Depends(get_session)):
    """Retrieve a credit card by its ID."""
    card = CreditCardRepository(session=session).get_by_id(card_id)
    if card:
        return CreditCardRead.model_validate(card.model_dump())
    return None


@router.post("/", response_model=CreditCardRead)
def create_credit_card(card: CreditCardCreate, session: Session = Depends(get_session)):
    """Create a new credit card."""
    card_read: CreditCardRead = CreateCreditCardService(
        repository=CreditCardRepository(session=session)
    ).exec(data=card)
    return card_read


@router.patch("/{card_id}", response_model=CreditCardRead | None)
def update_credit_card(
    card_id: int,
    card: CreditCardUpdate,
    session: Session = Depends(get_session),
):
    """Update an existing credit card."""
    updated_card = UpdateCreditCardService(
        repository=CreditCardRepository(session=session)
    ).exec(
        card_id=card_id,
        number=card.number,
        holder=card.holder,
        expiration=card.expiration,
        cvv=card.cvv,
        credit_limit=card.credit_limit,
    )
    if updated_card:
        return updated_card
    return None


@router.delete("/{card_id}", response_model=bool)
def delete_credit_card(card_id: int, session: Session = Depends(get_session)):
    """Delete a credit card by its ID."""
    return DeleteCreditCardService(
        repository=CreditCardRepository(session=session)
    ).exec(card_id=card_id)
