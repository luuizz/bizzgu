# Workflows para ativar

Estes são os workflows do GitHub Actions do projeto (CI e deploy). Eles ficam
aqui porque o GitHub só aceita arquivos em `.github/workflows/` enviados por
alguém com a permissão `workflow`. Ative uma única vez, do seu computador:

```bash
git switch dev && git pull
mkdir -p .github/workflows
git mv .github/workflows-para-ativar/ci.yml .github/workflows/ci.yml
git mv .github/workflows-para-ativar/deploy.yml .github/workflows/deploy.yml
git rm -q .github/workflows-para-ativar/README.md
git commit -m "ci: ativa os workflows de CI e deploy"
git push
```

Depois disso esta pasta deixa de existir. O README principal explica o fluxo.
