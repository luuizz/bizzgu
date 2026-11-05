# Workflows para ativar (deploy na Vercel)

Versões novas do `ci.yml` (actions atualizadas para Node 24) e do `deploy.yml`
(publica na Vercel em vez do GitHub Pages). O GitHub só aceita mudanças em
`.github/workflows/` de quem tem a permissão `workflow`, então ative do seu
computador, **depois de configurar a Vercel e os secrets** (README → Deploy):

```bash
git switch dev && git pull
git mv -f .github/workflows-para-ativar/ci.yml .github/workflows/ci.yml
git mv -f .github/workflows-para-ativar/deploy.yml .github/workflows/deploy.yml
git rm -q .github/workflows-para-ativar/README.md
git commit -m "ci: deploy na Vercel"
git push
```
