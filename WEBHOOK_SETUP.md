# Configuração do Webhook Stripe

## 1. Instalação do Stripe CLI

### macOS
```bash
brew install stripe/stripe-cli/stripe
```

### Windows (usando Chocolatey)
```bash
choco install stripe-cli
```

### Linux
```bash
# Baixe o binário apropriado em https://github.com/stripe/stripe-cli/releases/latest
```

## 2. Login no Stripe CLI
```bash
stripe login
```

## 3. Iniciar o listener do webhook
```bash
stripe listen --forward-to localhost:3000/api/pagamentos/webhook
```

Quando você executar este comando, você verá uma mensagem como esta:
```
> Ready! Your webhook signing secret is whsec_xxx...
```

## 4. Configure o webhook secret

1. Copie o webhook signing secret mostrado no terminal
2. Crie ou edite seu arquivo `.env`:
```env
STRIPE_WEBHOOK_SECRET="whsec_xxx..."
```

## 5. Testando o webhook

Em um novo terminal, você pode simular eventos do Stripe:

```bash
# Simular um pagamento bem-sucedido
stripe trigger payment_intent.succeeded

# Simular um pagamento falho
stripe trigger payment_intent.payment_failed
```

## Eventos suportados

Nossa aplicação atualmente suporta os seguintes eventos:
- `payment_intent.succeeded`: Quando um pagamento é concluído com sucesso
- `payment_intent.payment_failed`: Quando um pagamento falha

## Dicas

1. Mantenha o Stripe CLI rodando enquanto desenvolve
2. O webhook secret muda cada vez que você inicia o listener
3. Para desenvolvimento, você pode usar o mesmo webhook secret por mais tempo configurando no Dashboard do Stripe
4. Em produção, configure o webhook no Dashboard do Stripe e use um secret permanente 