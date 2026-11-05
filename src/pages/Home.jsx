import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Slide } from '../components/Slider'
import { ProductGrid } from '../components/product/ProductGrid'
import { Section } from '../components/layout'
import { ErrorState, SectionTitle } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useCategories } from '../hooks/useCategories'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getProducts } from '../services/catalog'
import { FREE_SHIPPING_FROM, formatBRL } from '../lib/format'

const benefits = [
    { title: 'Frete grátis', text: `Em compras acima de ${formatBRL(FREE_SHIPPING_FROM)}` },
    { title: 'Até 10x sem juros', text: 'No cartão de crédito' },
    { title: 'Pix com aprovação na hora', text: 'Seu pedido sai mais rápido' },
    { title: 'Compra segura', text: 'Seus dados protegidos' },
]

export function Home() {
    useDocumentTitle()
    const categories = useCategories()
    const featured = useAsync(() => getProducts({ featured: true, limit: 8 }), [])
    const offers = useAsync(() => getProducts({ onSale: true, sort: 'price_asc', limit: 4 }), [])

    return (
        <>
            <Slide />

            <div className="container">
                <Benefits>
                    {benefits.map((benefit) => (
                        <li key={benefit.title}>
                            <strong>{benefit.title}</strong>
                            <span>{benefit.text}</span>
                        </li>
                    ))}
                </Benefits>
            </div>

            <Section>
                <div className="container">
                    <div className="section-head">
                        <SectionTitle>Mais vendidos</SectionTitle>
                    </div>
                    {featured.error
                        ? <ErrorState error={featured.error} onRetry={featured.reload} />
                        : <ProductGrid products={featured.data || []} loading={featured.loading} />}
                </div>
            </Section>

            {categories.length > 0 && (
                <Section>
                    <div className="container">
                        <div className="section-head">
                            <SectionTitle>Departamentos</SectionTitle>
                        </div>
                        <CategoryChips>
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link to={`/categoria/${category.slug}`}>{category.name}</Link>
                                </li>
                            ))}
                        </CategoryChips>
                    </div>
                </Section>
            )}

            {(offers.loading || offers.data?.length > 0) && (
                <Section style={{ paddingBottom: '8rem' }}>
                    <div className="container">
                        <div className="section-head">
                            <SectionTitle>Ofertas</SectionTitle>
                            <Link to="/busca?ofertas=1">Ver todas</Link>
                        </div>
                        <ProductGrid products={offers.data || []} loading={offers.loading} skeletonCount={4} />
                    </div>
                </Section>
            )}
        </>
    )
}

const Benefits = styled.ul`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.6rem;
    margin-top: 3.2rem;
    li {
        background: var(--white);
        border-radius: 1.2rem;
        padding: 2rem 2.4rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        border-left: 0.4rem solid var(--primary);
    }
    strong { font-family: var(--font-red-hat); font-size: 1.7rem; color: var(--gray-800); }
    span { font-size: 1.4rem; color: var(--gray-300); }
    @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 500px) { grid-template-columns: 1fr; }
`

const CategoryChips = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    a {
        display: block;
        padding: 1.2rem 2.4rem;
        background: var(--white);
        border-radius: 5rem;
        font-family: var(--font-red-hat);
        font-weight: 600;
        font-size: 1.5rem;
        color: var(--gray-400);
        border: 0.1rem solid transparent;
        transition: all .2s ease;
        &:hover { border-color: var(--primary); color: var(--primary); }
    }
`
