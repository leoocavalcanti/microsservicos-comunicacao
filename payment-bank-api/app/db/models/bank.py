from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from sqlmodel import Field, Relationship, SQLModel


class BankAccount(SQLModel, table=True):
    id: Optional[int] = Field(
        primary_key=True,
        index=True,
        description="Unique identifier for the bank account",
    )
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
    is_active: Optional[bool] = Field(
        default=True,
        title="Is Active",
        description="Indicates if the account is active",
    )
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        title="Created At",
        description="Account creation timestamp",
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        title="Updated At",
        description="Last update timestamp",
    )
