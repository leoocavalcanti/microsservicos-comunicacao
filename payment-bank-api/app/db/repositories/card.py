from datetime import date

from sqlmodel import Session, select

from app.db.models.card import CreditCard, DebitCard


class CreditCardRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(
        self,
        number: str,
        holder: str,
        expiration: date,
        cvv: str,
        credit_limit: float,
        account_id: int,
    ) -> CreditCard:
        """Create a new credit card."""
        card = CreditCard(
            number=number,
            holder=holder,
            experation=expiration,
            cvv=cvv,
            credit_limit=credit_limit,
            account_id=account_id,
        )
        self.session.add(card)
        self.session.commit()
        self.session.refresh(card)
        return card

    def get_all(self, skip=0, offset=10) -> list[CreditCard]:
        """Retrieve all credit cards."""
        return self.session.exec(select(CreditCard).offset(skip).limit(offset)).all()

    def get_by_id(self, card_id: int) -> CreditCard | None:
        """Retrieve a credit card by its ID."""
        return self.session.get(CreditCard, card_id)

    def update(
        self,
        card_id: int,
        number: str | None = None,
        holder: str | None = None,
        expiration: date | None = None,
        cvv: str | None = None,
        credit_limit: float | None = None,
    ) -> CreditCard | None:
        """Update an existing credit card."""
        card = self.get_by_id(card_id)
        if not card:
            return None

        if number is not None:
            card.number = number
        if holder is not None:
            card.holder = holder
        if expiration is not None:
            card.expiration = expiration
        if cvv is not None:
            card.cvv = cvv
        if credit_limit is not None:
            card.credit_limit = credit_limit

        self.session.add(card)
        self.session.commit()
        self.session.refresh(card)
        return card

    def delete(self, card_id: int) -> bool:
        """Delete a credit card by its ID."""
        card = self.get_by_id(card_id)
        if not card:
            return False

        self.session.delete(card)
        self.session.commit()
        return True


class DebitCardRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(
        self,
        account_id: int,
        number: str,
        holder: str,
        expiration: date,
        cvv: str,
        is_active: bool = True,
    ) -> DebitCard:
        """Create a new debit card."""
        card = DebitCard(
            account_id=account_id,
            number=number,
            holder=holder,
            expiration=expiration,
            cvv=cvv,
            is_active=is_active,
        )
        self.session.add(card)
        self.session.commit()
        self.session.refresh(card)
        return card

    def get_all(self, skip=0, offset=10) -> list[DebitCard]:
        """Retrieve all debit cards."""
        return self.session.exec(select(DebitCard).offset(skip).limit(offset)).all()

    def get_by_id(self, card_id: int) -> DebitCard | None:
        """Retrieve a debit card by its ID."""
        return self.session.get(DebitCard, card_id)

    def update(self, card_id: int, **kwargs) -> DebitCard | None:
        """Update an existing debit card."""
        card = self.get_by_id(card_id)
        if not card:
            return None
        for key, value in kwargs.items():
            if hasattr(card, key):
                setattr(card, key, value)
        self.session.commit()
        self.session.refresh(card)
        return card

    def delete(self, card_id: int) -> bool:
        """Delete a debit card by its ID."""
        card = self.get_by_id(card_id)
        if not card:
            return False
        self.session.delete(card)
        self.session.commit()
        return True
