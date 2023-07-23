# Projeto de E-commerce Bizzgu

Este é um projeto de e-commerce baseado no Vite, uma ferramenta de construção rápida e eficiente, que permite criar aplicativos da web modernos com facilidade. Neste guia, explicaremos como configurar e executar o projeto usando o Yarn.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado em seu sistema:

- [Node.js](https://nodejs.org) (versão 12 ou superior)
- [Yarn](https://yarnpkg.com/getting-started/install)

## Iniciando o projeto

Siga as etapas abaixo para configurar e executar o projeto de e-commerce usando o Vite e o Yarn:

### 1. Clone o repositório

Comece clonando este repositório para o seu computador:

```bash
git clone https://github.com/luuizz/bizzgu.git
cd bizzgu
```

### 2. Instale as dependências

Use o Yarn para instalar todas as dependências do projeto:

```bash
yarn install
```

### 3. Inicie o servidor de desenvolvimento

Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

```bash
yarn dev
```

O servidor de desenvolvimento do Vite começará a ser executado, e você poderá acessar o aplicativo em `http://localhost:5173`. À medida que você fizer alterações nos arquivos, o Vite aplicará o Hot Module Replacement (HMR) automaticamente, permitindo que você veja as alterações em tempo real no navegador.

### 4. Crie a versão de produção

Quando estiver pronto para criar a versão otimizada para produção do seu projeto, execute o seguinte comando:

```bash
yarn build
```

Isso criará uma pasta `dist` com os arquivos otimizados prontos para implantação.

## Estrutura do projeto

O projeto de e-commerce utiliza uma estrutura simples com os seguintes diretórios e arquivos principais:

```
├── public/        # Recursos públicos (por exemplo, imagens, ícones)
├── src/           # Código-fonte do projeto
│   ├── assets/    # Arquivos de mídia e recursos (por exemplo, imagens, ícones)
│   ├── components/# Componentes reutilizáveis
│   ├── pages/     # Páginas da aplicação
│   ├── App.vue    # Componente raiz da aplicação
│   └── main.js    # Ponto de entrada do aplicativo
├── vite.config.js # Arquivo de configuração do Vite
├── package.json   # Configurações e dependências do projeto
└── README.md      # Este arquivo
```

## Conclusão

Parabéns! Agora você tem o meu projeto configurado certinho e pronto para ser visualizado e editado!