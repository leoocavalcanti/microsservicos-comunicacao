# Start from a slim Python image
FROM python:3.13-slim-bookworm
LABEL maintainer="Hyan Batista"

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

COPY pyproject.toml /code/
WORKDIR /code

# Gerar novo lock file e instalar dependências
RUN uv lock && \
    uv venv --seed && \
    . .venv/bin/activate && \
    uv sync

# Copiar o resto dos arquivos
COPY . /code
COPY ./scripts /scripts

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home /code \
    --shell /bin/bash \
    --uid 1000 \
    appuser && \
    chmod -R +x /scripts

ENV PATH=/code/.venv/bin:/scripts:$PATH

USER appuser

CMD [ "run.sh" ]