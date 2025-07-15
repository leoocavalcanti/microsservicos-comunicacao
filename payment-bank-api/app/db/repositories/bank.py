from sqlmodel import Session, select

from app.db.models.bank import BankAccount


class BankAccountRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(
        self, owner_name: str, account_number: str, balance: float
    ) -> BankAccount:
        """Create a new bank account."""
        account = BankAccount(
            owner_name=owner_name,
            account_number=account_number,
            balance=balance,
        )
        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def get_all(self, skip=0, offset=10) -> list[BankAccount]:
        """Retrieve all bank accounts."""
        return self.session.exec(select(BankAccount).offset(skip).limit(offset)).all()

    def get_by_id(self, account_id: int) -> BankAccount | None:
        """Retrieve a bank account by its ID."""
        return self.session.get(BankAccount, account_id)

    def update(
        self,
        account_id: int,
        owner_name: str | None = None,
        account_number: str | None = None,
        balance: float | None = None,
    ) -> BankAccount | None:
        """Update an existing bank account."""
        account = self.get_by_id(account_id)
        if not account:
            return None

        if owner_name is not None:
            account.owner_name = owner_name
        if account_number is not None:
            account.account_number = account_number
        if balance is not None:
            account.balance = balance

        self.session.add(account)
        self.session.commit()
        self.session.refresh(account)
        return account

    def delete(self, account_id: int) -> bool:
        """Delete a bank account by its ID."""
        account = self.get_by_id(account_id)
        if not account:
            return False

        self.session.delete(account)
        self.session.commit()
        return True
