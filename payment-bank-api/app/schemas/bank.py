from typing import Optional
from uuid import uuid4

from sqlmodel import Field, SQLModel


class BankAccountBase(SQLModel):
    owner_name: str = Field(
        ..., title="Owner Name", description="Full name of the account owner"
    )
    account_number: str = Field(
        default_factory=lambda: str(uuid4()),
        title="Account Number",
        description="Unique account number",
        index=True,
    )
    balance: float = Field(
        default=float("0.00"), title="Balance", description="Current account balance"
    )


class BankAccountCreate(BankAccountBase):
    pass


class BankAccountUpdate(SQLModel):
    owner_name: Optional[str] = None
    account_number: Optional[str] = None
    balance: Optional[float] = None


class BankAccountRead(BankAccountBase):
    id: int = Field(
        primary_key=True,
        index=True,
        description="Unique identifier for the bank account",
    )
    is_active: Optional[bool] = Field(
        default=True,
        title="Is Active",
        description="Indicates if the account is active",
    )
