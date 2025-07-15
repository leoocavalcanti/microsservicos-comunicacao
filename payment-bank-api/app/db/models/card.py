from datetime import date
from typing import Optional

from sqlmodel import Field, SQLModel


class CreditCard(SQLModel, table=True):
    id: Optional[int] = Field(
        primary_key=True,
        index=True,
        description="Unique identifier for the bank account",
    )
    account_id: int = Field(
        default=None,
        description="Associated account identifier",
        foreign_key="bankaccount.id",
    )
    number: str = Field(default="", description="Credit card number")
    holder: str = Field(default="", description="Name of the cardholder")
    expiration: date = Field(
        default_factory=date.today, description="Expiration date of the card"
    )
    cvv: str = Field(default="", description="Card Verification Value")
    credit_limit: float = Field(default=0.0, description="Maximum credit limit")
    is_active: bool = Field(default=True, description="Indicates if the card is active")


class DebitCard(SQLModel, table=True):
    id: Optional[int] = Field(
        primary_key=True,
        index=True,
        description="Unique identifier for the debit card",
    )
    account_id: int = Field(
        default=None,
        description="Associated account identifier",
        foreign_key="bankaccount.id",
    )
    number: str = Field(default="", description="Debit card number")
    holder: str = Field(default="", description="Name of the cardholder")
    expiration: date = Field(
        default_factory=date.today, description="Expiration date of the card"
    )
    cvv: str = Field(default="", description="Card Verification Value")
    is_active: bool = Field(default=True, description="Indicates if the card is active")
