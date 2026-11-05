import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Eye, Package, PencilSimple, Plus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DashHeader } from '../../components/DashboardLayout'
import { ProductImage } from '../../components/product/ProductImage'
import { Badge, ButtonLink, Card, EmptyState, ErrorState, Input, Loader, Select, Table, TableScroll } from '../../components/ui'
import { Toolbar } from './Orders'
import { useAsync } from '../../hooks/useAsync'
import { useCategories } from '../../hooks/useCategories'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { ADMIN_PRODUCT_SORTS, listAllProducts, listAllTags, saveProduct } from '../../services/admin'
import { formatBRL } from '../../lib/format'

export function Products() {
    useDocumentTitle('Produtos · Admin')
    const categories = useCategories()
    const toast = useToast()
    // Filtros iniciais pela URL: /admin/produtos?categoria=3 ou ?tag=5 (links da taxonomia)
    const [params, setParams] = useSearchParams()
    const tags = useAsync(() => listAllTags(), [])
    const [search, setSearch] = useState('')
    const [categoryId, setCategoryId] = useState(params.get('categoria') || '')
    const [query, setQuery] = useState({ search: '', categoryId: params.get('categoria') || '', tagId: params.get('tag') || '', sort: 'recent' })

    const setTag = (tagId) => {
        setQuery((prev) => ({ ...prev, tagId }))
        setParams((prev) => {
            const next = new URLSearchParams(prev)
            if (tagId) next.set('tag', tagId)
            else next.delete('tag')
            return next
        }, { replace: true })
    }

    const products = useAsync(() => listAllProducts(query), [query])
    const rows = products.data || []

    // Liga/desliga direto na tabela (com atualização otimista)
    const toggle = async (product, field) => {
        const value = !product[field]
        products.setData(rows.map((row) => (row.id === product.id ? { ...row, [field]: value } : row)))
        try {
            await saveProduct(product.id, { [field]: value })
        } catch (error) {
            toast.show(error.message, 'danger')
            products.reload()
        }
    }

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Produtos</h1>
                    <p>{products.loading ? ' ' : `${rows.length} ${rows.length === 1 ? 'produto' : 'produtos'}`}</p>
                </div>
                <div className="actions">
                    <ButtonLink to="/admin/produtos/novo"><Plus size={20} weight="bold" /> Novo produto</ButtonLink>
                </div>
            </DashHeader>

            <Card>
                <Toolbar onSubmit={(event) => { event.preventDefault(); setQuery((prev) => ({ ...prev, search: search.trim(), categoryId })) }}>
                    <Select
                        value={categoryId}
                        onChange={(event) => { setCategoryId(event.target.value); setQuery((prev) => ({ ...prev, search: search.trim(), categoryId: event.target.value })) }}
                        aria-label="Filtrar por categoria"
                        style={{ maxWidth: '24rem', height: '4.2rem' }}
                    >
                        <option value="">Todas as categorias</option>
                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </Select>
                    <Select
                        value={query.tagId}
                        onChange={(event) => setTag(event.target.value)}
                        aria-label="Filtrar por tag"
                        style={{ maxWidth: '20rem', height: '4.2rem' }}
                    >
                        <option value="">Todas as tags</option>
                        {(tags.data || []).map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
                    </Select>
                    <Input type="search" placeholder="Buscar por nome" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar produtos" />
                    <Select
                        value={query.sort}
                        onChange={(event) => setQuery((prev) => ({ ...prev, sort: event.target.value }))}
                        aria-label="Ordenar produtos"
                        style={{ maxWidth: '22rem', height: '4.2rem' }}
                    >
                        {Object.entries(ADMIN_PRODUCT_SORTS).map(([value, { label }]) => <option key={value} value={value}>{label}</option>)}
                    </Select>
                </Toolbar>

                {products.loading && !products.data ? <Loader /> : products.error ? <ErrorState error={products.error} onRetry={products.reload} /> : rows.length === 0 ? (
                    <EmptyState icon={Package} title="Nenhum produto encontrado" action={<ButtonLink to="/admin/produtos/novo">Cadastrar produto</ButtonLink>} />
                ) : (
                    <TableScroll>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Produto</th><th>Categoria</th><th className="num">Preço</th><th className="num">Estoque</th><th>Destaque</th><th>Ativo</th><th><span className="sr-only">Ações</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((product) => (
                                    <tr key={product.id} className={product.active ? '' : 'inactive'}>
                                        <td>
                                            <ProductCell to={`/admin/produtos/${product.id}`}>
                                                <div className="thumb"><ProductImage src={product.images?.[0]} alt={product.name} /></div>
                                                <span>{product.name}</span>
                                            </ProductCell>
                                        </td>
                                        <td>{product.category?.name || '—'}</td>
                                        <td className="num">{formatBRL(product.price)}</td>
                                        <td className="num">
                                            {product.stock === 0
                                                ? <Badge $tone="danger">Esgotado</Badge>
                                                : product.stock <= 5 ? <Badge $tone="warning">{product.stock}</Badge> : product.stock}
                                        </td>
                                        <td><Switch checked={product.featured} onChange={() => toggle(product, 'featured')} label={`Destaque: ${product.name}`} /></td>
                                        <td><Switch checked={product.active} onChange={() => toggle(product, 'active')} label={`Ativo: ${product.name}`} /></td>
                                        <td>
                                            <RowActions>
                                                <a
                                                    href={`${import.meta.env.BASE_URL}produto/${product.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title={product.active ? 'Ver na loja' : 'Pré-visualizar (inativo)'}
                                                    aria-label={`Ver ${product.name} na loja`}
                                                >
                                                    <Eye size={20} />
                                                </a>
                                                <Link to={`/admin/produtos/${product.id}`} title="Editar" aria-label={`Editar ${product.name}`}>
                                                    <PencilSimple size={20} />
                                                </Link>
                                            </RowActions>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableScroll>
                )}
            </Card>
        </>
    )
}

export function Switch({ checked, onChange, label }) {
    return (
        <SwitchLabel title={label}>
            <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
            <span />
        </SwitchLabel>
    )
}

const SwitchLabel = styled.label`
    position: relative;
    display: inline-block;
    width: 4.2rem;
    height: 2.4rem;
    cursor: pointer;
    input { position: absolute; opacity: 0; width: 100%; height: 100%; margin: 0; cursor: pointer; }
    span {
        position: absolute;
        inset: 0;
        background: var(--gray-50);
        border-radius: 2rem;
        transition: background .2s ease;
        pointer-events: none;
        &::after {
            content: '';
            position: absolute;
            top: 0.3rem;
            left: 0.3rem;
            width: 1.8rem;
            height: 1.8rem;
            background: var(--white);
            border-radius: 50%;
            box-shadow: var(--shadow-sm);
            transition: transform .2s ease;
        }
    }
    input:checked + span { background: var(--primary); }
    input:checked + span::after { transform: translateX(1.8rem); }
    input:focus-visible + span { outline: 0.2rem solid var(--primary); outline-offset: 0.2rem; }
`

const RowActions = styled.div`
    display: flex;
    gap: 0.4rem;
    justify-content: flex-end;
    a {
        display: grid;
        place-items: center;
        width: 3.6rem;
        height: 3.6rem;
        border-radius: 0.8rem;
        color: var(--gray-300);
        transition: background .2s ease, color .2s ease;
        &:hover { background: var(--primary-50); color: var(--primary); }
    }
`

const ProductCell = styled(Link)`
    display: flex;
    align-items: center;
    gap: 1.2rem;
    min-width: 26rem;
    .thumb { width: 4.8rem; height: 4.8rem; border-radius: 0.8rem; background: var(--white-600); padding: 0.3rem; flex-shrink: 0; overflow: hidden; }
    span { color: var(--gray-700); font-weight: 500; }
    &:hover span { color: var(--primary); }
`
