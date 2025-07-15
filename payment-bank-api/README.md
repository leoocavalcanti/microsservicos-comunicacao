# Card Bank CRUD

A simple CRUD (Create, Read, Update, Delete) application for managing card bank data, developed for the UFRPE APSOO course.

## Features

- Add new cards to the bank
- View a list of all cards
- Update card information
- Delete cards from the bank

## Technologies Used

- Language: Python
- Framework: FastAPI
- Database: PostgreSQL

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone git@github.com:HyanBatista/ufrpe-apsoo-card-bank-crud.git
    cd ufrpe-apsoo-card-bank-crud
    ```

2. **Install dependencies:**
    ```bash
    uv sync
    ```

3. **Run the application:**
    ```bash
    cp .env.example .env
    docker compose up -d --build
    ```


4. **Access the application:**
    Open your browser and go to `http://localhost:8000`

## API Endpoints

| Path                | Method | Description                        |
|---------------------|--------|------------------------------------|
| `/bank`             | GET    | Retrieve all bank accounts         |
| `/bank/{account_id}`| GET    | Retrieve a bank account by ID      |
| `/bank`             | POST   | Create a new bank account          |
| `/bank/{account_id}`| PATCH  | Update an existing bank account    |
| `/credit_card`             | GET    | Retrieve all credit cards         |
| `/credit_card/{card_id}`   | GET    | Retrieve a credit card by ID      |
| `/credit_card`             | POST   | Create a new credit card          |
| `/credit_card/{card_id}`   | PATCH  | Update an existing credit card    |
| `/debit_card`              | GET    | Retrieve all debit cards          |
| `/debit_card/{card_id}`    | GET    | Retrieve a debit card by ID       |
| `/debit_card`              | POST   | Create a new debit card           |
| `/debit_card/{card_id}`    | PATCH  | Update an existing debit card     |


## License

This project is licensed under the MIT License.

---
*Developed for the UFRPE APSOO course.*