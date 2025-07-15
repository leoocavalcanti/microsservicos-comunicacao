from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.db.repositories.bank import BankAccountRepository
from app.db.session import get_session
from app.schemas.bank import BankAccountCreate, BankAccountRead
from app.services.bank import (
    CreateBankAccountService,
    DeleteBankAccountService,
    ReadBankAccountService,
    UpdateBankAccountService,
)

router = APIRouter(
    prefix="/bank",
    tags=["bank"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=list[BankAccountRead])
def read_bank_accounts(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    """Retrieve all bank accounts."""
    accounts = ReadBankAccountService(
        repository=BankAccountRepository(session=session)
    ).exec(skip=skip, limit=limit)
    return accounts


@router.get("/{account_id}", response_model=BankAccountRead | None)
def read_bank_account(account_id: int, session: Session = Depends(get_session)):
    """Retrieve a bank account by its ID."""
    account = BankAccountRepository(session=session).get_by_id(account_id)
    if account:
        return BankAccountRead.model_validate(account)
    return None


@router.post("/", response_model=BankAccountRead)
def create_bank_account(
    account: BankAccountCreate, session: Session = Depends(get_session)
):
    """Create a new bank account."""
    account: BankAccountRead = CreateBankAccountService(
        repository=BankAccountRepository(session=session)
    ).exec(data=account)
    return account


@router.patch("/{account_id}", response_model=BankAccountRead | None)
def update_bank_account(
    account_id: int,
    account: BankAccountCreate,
    session: Session = Depends(get_session),
):
    """Update an existing bank account."""
    updated_account = UpdateBankAccountService(
        repository=BankAccountRepository(session=session)
    ).exec(
        account_id=account_id,
        owner_name=account.owner_name,
        account_number=account.account_number,
        balance=account.balance,
    )
    return updated_account


@router.delete("/{account_id}", response_model=bool)
def delete_bank_account(account_id: int, session: Session = Depends(get_session)):
    """Delete a bank account by its ID."""
    return DeleteBankAccountService(
        repository=BankAccountRepository(session=session)
    ).exec(account_id=account_id)
