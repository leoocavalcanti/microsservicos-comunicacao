from app.db.models.bank import BankAccount
from app.db.repositories.bank import BankAccountRepository
from app.schemas.bank import BankAccountCreate, BankAccountRead


class CreateBankAccountService:
    def __init__(self, repository: BankAccountRepository):
        self.repository = repository

    def exec(self, data: BankAccountCreate) -> BankAccountRead:
        """Create a new bank account."""
        bank_account: BankAccount = self.repository.create(
            owner_name=data.owner_name,
            account_number=data.account_number,
            balance=data.balance,
        )
        bank_count_read_schema = BankAccountRead.model_validate(bank_account)
        return bank_count_read_schema


class ReadBankAccountService:
    def __init__(self, repository: BankAccountRepository):
        self.repository = repository

    def exec(self, skip: int = 0, limit: int = 10) -> list[BankAccountRead]:
        """Retrieve all bank accounts."""
        accounts = self.repository.get_all(skip=skip, offset=limit)
        return [BankAccountRead.model_validate(account) for account in accounts]


class UpdateBankAccountService:
    def __init__(self, repository: BankAccountRepository):
        self.repository = repository

    def exec(
        self,
        account_id: int,
        owner_name: str | None = None,
        account_number: str | None = None,
        balance: float | None = None,
    ) -> BankAccountRead | None:
        """Update an existing bank account."""
        updated_account = self.repository.update(
            account_id=account_id,
            owner_name=owner_name,
            account_number=account_number,
            balance=balance,
        )
        if updated_account:
            return BankAccountRead.model_validate(updated_account)
        return None


class DeleteBankAccountService:
    def __init__(self, repository: BankAccountRepository):
        self.repository = repository

    def exec(self, account_id: int) -> bool:
        """Delete a bank account by its ID."""
        return self.repository.delete(account_id=account_id)
