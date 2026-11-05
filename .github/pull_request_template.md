## O que muda

<!-- Resumo da alteração -->

## Como testar

- [ ] `yarn lint` e `yarn build` sem erros
- [ ] Testei no navegador (`yarn dev`)
- [ ] Mudança no banco? Criei uma **nova** migration em `database/migrations/` (sem editar as antigas) e rodei `yarn db:migrate`

> Fluxo: `feature/*` → **dev** → **main**. O merge na `main` publica o site e aplica as migrations em produção.
