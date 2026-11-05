import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Section } from '../components/layout'
import { ProductImage } from '../components/product/ProductImage'
import { ProductGrid } from '../components/product/ProductGrid'
import { QuantityStepper } from '../components/product/QuantityStepper'
import { WishlistButton } from '../components/product/WishlistButton'
import { Badge, Breadcrumb, Button, ErrorState, Loader, SectionTitle } from '../components/ui'
import { useAsync } from '../hooks/useAsync'
import { useCart } from '../hooks/useCart'
import { useToast } from '../hooks/useToast'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getProductBySlug, getProducts } from '../services/catalog'
import { FREE_SHIPPING_FROM, discountPercent, formatBRL, installments } from '../lib/format'
import { NotFound } from './NotFound'
import ShareImg from '/src/assets/icon-share-2.svg'

export function ItemDetail() {
    const { slug } = useParams()
    const product = useAsync(() => getProductBySlug(slug), [slug])
    const related = useAsync(
        () => (product.data?.category_id
            ? getProducts({ categoryId: product.data.category_id, excludeId: product.data.id, limit: 4 })
            : Promise.resolve([])),
        [product.data?.id],
    )

    useDocumentTitle(product.data?.name)

    if (product.loading) return <Loader />
    if (product.error) return <ErrorState error={product.error} onRetry={product.reload} />
    if (!product.data) return <NotFound />

    return (
        <>
            <ProductView key={product.data.id} product={product.data} />
            {related.data?.length > 0 && (
                <Section style={{ paddingBottom: '8rem' }}>
                    <div className="container">
                        <div className="section-head">
                            <SectionTitle>Você também pode gostar</SectionTitle>
                        </div>
                        <ProductGrid products={related.data} />
                    </div>
                </Section>
            )}
        </>
    )
}

function ProductView({ product }) {
    const cart = useCart()
    const toast = useToast()
    const navigate = useNavigate()
    const [activeImage, setActiveImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    const inCart = cart.quantityOf(product.id)
    const available = Math.max(0, product.stock - inCart)
    const discount = discountPercent(product.price, product.compare_at_price)
    const parcel = installments(Number(product.price))
    const images = product.images || []

    useEffect(() => {
        setQuantity((value) => Math.max(1, Math.min(value, available || 1)))
    }, [available])

    const addToCart = () => {
        const added = cart.addItem(product, quantity)
        if (added === 0) {
            toast.show('Você já tem todo o estoque deste produto no carrinho.', 'danger')
            return false
        }
        toast.show(
            added < quantity ? `Adicionamos ${added} unidade(s), o máximo disponível.` : 'Produto adicionado ao carrinho!',
            'success',
        )
        setQuantity(1)
        return true
    }

    const buyNow = () => {
        if (inCart > 0 && available === 0) return navigate('/carrinho-compras')
        if (addToCart()) navigate('/carrinho-compras')
    }

    const share = async () => {
        const url = window.location.href
        try {
            if (navigator.share) {
                await navigator.share({ title: product.name, url })
            } else {
                await navigator.clipboard.writeText(url)
                toast.show('Link copiado!', 'success')
            }
        } catch {
            // usuário cancelou o compartilhamento
        }
    }

    return (
        <Wrapper>
            <div className="container">
                <Breadcrumb
                    items={[
                        { label: 'Início', to: '/' },
                        ...(product.category ? [{ label: product.category.name, to: `/categoria/${product.category.slug}` }] : []),
                        { label: product.name },
                    ]}
                />

                <div className="layout">
                    <div className="gallery">
                        <div className="main-image">
                            <ProductImage src={images[activeImage]} alt={product.name} loading="eager" />
                            {discount > 0 && <Badge $tone="success" className="discount">-{discount}%</Badge>}
                        </div>
                        {images.length > 1 && (
                            <div className="thumbs">
                                {images.map((image, index) => (
                                    <button
                                        key={image}
                                        type="button"
                                        className={index === activeImage ? 'active' : ''}
                                        onClick={() => setActiveImage(index)}
                                        aria-label={`Ver imagem ${index + 1}`}
                                    >
                                        <ProductImage src={image} alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="infos">
                        {product.category && <span className="category">{product.category.name}</span>}
                        <h1>{product.name}</h1>

                        <div className="price">
                            {discount > 0 && <s>{formatBRL(product.compare_at_price)}</s>}
                            <strong>{formatBRL(product.price)}</strong>
                            {parcel.times > 1 && <span>ou {parcel.times}x de {formatBRL(parcel.value)} sem juros</span>}
                            <span className="shipping">
                                {Number(product.price) >= FREE_SHIPPING_FROM
                                    ? 'Frete grátis para todo o Brasil'
                                    : `Frete grátis em compras acima de ${formatBRL(FREE_SHIPPING_FROM)}`}
                            </span>
                        </div>

                        {product.stock === 0 ? (
                            <div className="sold-out">Produto esgotado no momento.</div>
                        ) : (
                            <div className="buy">
                                <div className="row">
                                    <QuantityStepper value={quantity} max={Math.max(1, available)} onChange={setQuantity} />
                                    <span className={`stock ${product.stock <= 3 ? 'low' : ''}`}>
                                        {product.stock <= 3 ? `Só restam ${product.stock}!` : `${product.stock} em estoque`}
                                        {inCart > 0 && ` · ${inCart} no carrinho`}
                                    </span>
                                </div>
                                <Button $size="lg" $block onClick={buyNow}>Comprar agora</Button>
                                <Button $size="lg" $block $variant="secondary" onClick={addToCart} disabled={available === 0}>
                                    {available === 0 ? 'Todo o estoque já está no carrinho' : 'Adicionar ao carrinho'}
                                </Button>
                            </div>
                        )}

                        <div className="share">
                            <WishlistButton product={product} withLabel />
                            <button type="button" onClick={share}>
                                <img src={ShareImg} alt="" />
                                <span>Compartilhar</span>
                            </button>
                        </div>

                        {product.description && (
                            <div className="description">
                                <h2>Descrição</h2>
                                <p>{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.section`
    padding-top: 3.2rem;
    .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 5.6rem;
        margin-top: 2.4rem;
    }
    .gallery {
        position: sticky;
        top: 2.4rem;
        align-self: start;
    }
    .main-image {
        position: relative;
        background: var(--white);
        border-radius: 1.6rem;
        aspect-ratio: 1;
        padding: 3.2rem;
        overflow: hidden;
        .discount { position: absolute; top: 1.6rem; left: 1.6rem; font-size: 1.4rem; height: 3rem; }
    }
    .thumbs {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.2rem;
        margin-top: 1.2rem;
        button {
            background: var(--white);
            border-radius: 1rem;
            aspect-ratio: 1;
            padding: 0.8rem;
            border: 0.2rem solid transparent;
            transition: border-color .2s ease;
            &.active, &:hover { border-color: var(--primary); }
        }
    }
    .infos {
        display: flex;
        flex-direction: column;
        .category {
            font-size: 1.3rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08rem;
            color: var(--primary);
            margin-bottom: 1.2rem;
        }
        h1 {
            font-size: 3.4rem;
            letter-spacing: -0.06rem;
            font-weight: 700;
            margin-bottom: 2.4rem;
        }
    }
    .price {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding-bottom: 2.4rem;
        margin-bottom: 2.4rem;
        border-bottom: 0.1rem solid var(--gray-50);
        s { font-size: 1.6rem; color: var(--gray-200); }
        strong { font-family: var(--font-red-hat); font-size: 4rem; letter-spacing: -0.1rem; color: var(--gray-800); }
        span { font-size: 1.5rem; color: var(--gray-300); }
        .shipping { color: var(--success); font-weight: 600; margin-top: 0.8rem; }
    }
    .buy {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        .row { display: flex; align-items: center; gap: 1.6rem; margin-bottom: 0.8rem; }
        .stock { font-size: 1.4rem; color: var(--gray-300); }
        .stock.low { color: var(--warning); font-weight: 600; }
    }
    .sold-out {
        background: var(--danger-50);
        color: var(--danger);
        padding: 1.6rem;
        border-radius: 1rem;
        font-size: 1.6rem;
        font-weight: 600;
    }
    .share {
        display: flex;
        gap: 3.2rem;
        margin-top: 2.4rem;
        > button {
            display: inline-flex;
            align-items: center;
            gap: 0.8rem;
            img { width: 1.8rem; }
            span { font-size: 1.5rem; color: var(--gray-300); }
            &:hover span { color: var(--primary); }
        }
    }
    .description {
        margin-top: 4rem;
        h2 { font-size: 2.2rem; margin-bottom: 1.2rem; }
        p { font-size: 1.6rem; color: var(--gray-400); white-space: pre-line; }
    }
    @media (max-width: 900px) {
        .layout { grid-template-columns: 1fr; gap: 3.2rem; }
        .gallery { position: static; }
        .infos h1 { font-size: 2.6rem; }
        .price strong { font-size: 3.2rem; }
    }
`
