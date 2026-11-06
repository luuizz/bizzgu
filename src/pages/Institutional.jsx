import { Navigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Page } from '../components/layout'
import { Breadcrumb, PageTitle } from '../components/ui'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { FREE_SHIPPING_FROM, SHIPPING_FEE, formatBRL } from '../lib/format'
import { NotFound } from './NotFound'

const pages = {
    entrega: {
        title: 'Política de Entrega',
        body: [
            `O frete é grátis para compras a partir de ${formatBRL(FREE_SHIPPING_FROM)}. Abaixo desse valor, cobramos uma taxa fixa de ${formatBRL(SHIPPING_FEE)} para todo o Brasil.`,
            'Após a confirmação do pagamento, o pedido é separado e enviado. Você acompanha cada etapa em Minha conta → Meus pedidos.',
        ],
    },
    'trocas-devolucoes': {
        title: 'Trocas e Devoluções',
        body: [
            'Você pode cancelar o pedido pela própria loja enquanto ele estiver aguardando pagamento.',
            'Depois do pagamento, entre em contato pelo e-mail oi@bizzgu.com.br em até 7 dias após o recebimento para solicitar troca ou devolução.',
        ],
    },
    privacidade: {
        title: 'Política de Privacidade',
        body: [
            'Usamos seus dados (nome, e-mail, telefone e endereço) apenas para processar pedidos e manter sua conta.',
            'As informações ficam protegidas por regras de acesso no banco de dados: cada cliente só consegue ver os próprios pedidos e dados.',
        ],
    },
}

export function Institutional() {
    const { slug } = useParams()
    const page = pages[slug]
    useDocumentTitle(page?.title)

    // O "Sobre" agora é editável no painel e mora em /sobre
    if (slug === 'sobre') return <Navigate to="/sobre" replace />
    if (!page) return <NotFound />

    return (
        <Page>
            <div className="container">
                <div className="page-head">
                    <Breadcrumb items={[{ label: 'Início', to: '/' }, { label: page.title }]} />
                    <PageTitle>{page.title}</PageTitle>
                </div>
                <Content>
                    {page.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </Content>
            </div>
        </Page>
    )
}

const Content = styled.article`
    background: var(--white);
    border-radius: 1.6rem;
    padding: 3.2rem;
    max-width: 80rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    p { font-size: 1.6rem; color: var(--gray-400); }
`
