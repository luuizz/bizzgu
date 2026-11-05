import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ProductImage } from './ProductImage'
import { WishlistButton } from './WishlistButton'
import { Badge } from '../ui'
import { discountPercent, formatBRL, installments } from '../../lib/format'

export function ProductCard({ product }) {
    const discount = discountPercent(product.price, product.compare_at_price)
    const parcel = installments(Number(product.price))
    const soldOut = product.stock === 0

    return (
        <Card to={`/produto/${product.slug}`} title={product.name}>
            <div className="media">
                <ProductImage src={product.images?.[0]} alt={product.name} />
                <div className="tags">
                    {discount > 0 && <Badge $tone="success">-{discount}%</Badge>}
                    {soldOut && <Badge $tone="danger">Esgotado</Badge>}
                    {!soldOut && product.stock <= 3 && <Badge $tone="warning">Últimas unidades</Badge>}
                </div>
                <WishlistButton product={product} className="wish" />
            </div>
            <div className="info">
                {product.category && <span className="category">{product.category.name}</span>}
                <h3>{product.name}</h3>
                <div className="price">
                    {discount > 0 && <s>{formatBRL(product.compare_at_price)}</s>}
                    <strong>{formatBRL(product.price)}</strong>
                    {parcel.times > 1 && <small>ou {parcel.times}x de {formatBRL(parcel.value)} sem juros</small>}
                </div>
            </div>
            <span className="cta">{soldOut ? 'Ver produto' : 'Comprar'}</span>
        </Card>
    )
}

const Card = styled(Link)`
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--white);
    border-radius: 1.2rem;
    padding: 1.6rem 1.6rem 2rem;
    transition: box-shadow .25s ease, transform .25s ease;
    &:hover {
        box-shadow: var(--shadow);
        transform: translateY(-0.3rem);
        .media img { transform: scale(1.05); }
        .cta { background: var(--primary); color: var(--white); }
    }
    .media {
        position: relative;
        aspect-ratio: 1 / 0.85;
        border-radius: 0.8rem;
        overflow: hidden;
        margin-bottom: 1.6rem;
        background: var(--white);
        img { transition: transform .3s ease; }
    }
    .tags {
        position: absolute;
        top: 0.8rem;
        left: 0.8rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.6rem;
    }
    .wish {
        position: absolute;
        top: 0.8rem;
        right: 0.8rem;
    }
    .info {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .category {
        font-size: 1.2rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06rem;
        color: var(--primary);
        margin-bottom: 0.6rem;
    }
    h3 {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        font-size: 1.5rem;
        line-height: 1.35;
        color: var(--gray-700);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 4rem;
        margin-bottom: 1.2rem;
    }
    .price {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        margin-top: auto;
        margin-bottom: 1.6rem;
        s { font-size: 1.3rem; color: var(--gray-200); }
        strong { font-family: var(--font-red-hat); font-size: 2.4rem; color: var(--gray-800); }
        small { font-size: 1.25rem; color: var(--gray-300); }
    }
    .cta {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4.2rem;
        border: 0.1rem solid var(--primary);
        border-radius: var(--radius);
        color: var(--primary);
        font-family: var(--font-red-hat);
        font-weight: 600;
        font-size: 1.5rem;
        transition: all .2s ease;
    }
`
