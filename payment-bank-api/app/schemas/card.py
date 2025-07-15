from datetime import date
from typing import Optional

from sqlmodel import Field, SQLModel


class CreditCardBase(SQLModel):
    number: str
    holder: str
    expiration: date = Field(default=date.today())
    cvv: str
    credit_limit: float = 0.0


class CreditCardCreate(CreditCardBase):
    """Schema for creating a new credit card."""


from datetime import date
from typing import Optional

from sqlmodel import Field, SQLModel


class CreditCardBase(SQLModel):
    number: str
    holder: str
    expiration: date = Field(default=date.today())
    cvv: str
    credit_limit: float = 0.0


class CreditCardCreate(CreditCardBase):
    """Schema for creating a new credit card."""

    account_id: Optional[int] = Field(
        default=None, description="Associated bank account ID"
    )


class CreditCardRead(CreditCardBase):
    id: int
    credit_limit: float = 0.0
    is_active: bool = True


class CreditCardUpdate(SQLModel):
    holder: Optional[str] = Field(default=None)
    credit_limit: Optional[float] = Field(default=None)
    expiration: Optional[date] = Field(default=None)
    cvv: Optional[str] = Field(default=None)


class CreditCardRead(CreditCardBase):
    id: int
    credit_limit: float = 0.0
    is_active: bool = True


class CreditCardUpdate(SQLModel):
    number: Optional[str] = Field(default=None)
    holder: Optional[str] = Field(default=None)
    credit_limit: Optional[float] = Field(default=None)
    expiration: Optional[date] = Field(default=None)
    cvv: Optional[str] = Field(default=None)


class DebitCardBase(SQLModel):
    account_id: int
    number: str
    holder: str
    expiration: date = Field(default=date.today())
    cvv: str
    is_active: bool = True


class DebitCardCreate(DebitCardBase):
    """Schema for creating a new debit card."""

    account_id: Optional[int] = Field(
        default=None, description="Associated bank account ID"
    )


class DebitCardRead(DebitCardBase):
    id: int
    is_active: bool = True


class DebitCardUpdate(SQLModel):
    number: Optional[str] = Field(default=None)
    holder: Optional[str] = Field(default=None)
    expiration: Optional[date] = Field(default=None)
    cvv: Optional[str] = Field(default=None)
    is_active: Optional[bool] = Field(default=None)
