import { useState } from 'react'
import { Package } from '@phosphor-icons/react'
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
import { listAllProducts, saveProduct } from '../../services/admin'
import { formatBRL } from '../../lib/format'

export function Products() {
    useDocumentTitle('Produtos · Admin')
    const categories = useCategories()
    const toast = useToast()
    const [search, setSearch] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [query, setQuery] = useState({ search: '', categoryId: '' })

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
                    <ButtonLink to="/admin/produtos/novo">Novo produto</ButtonLink>
                </div>
            </DashHeader>

            <Card>
                <Toolbar onSubmit={(event) => { event.preventDefault(); setQuery({ search: search.trim(), categoryId }) }}>
                    <Select
                        value={categoryId}
                        onChange={(event) => { setCategoryId(event.target.value); setQuery({ search: search.trim(), categoryId: event.target.value }) }}
                        aria-label="Filtrar por categoria"
                        style={{ maxWidth: '24rem', height: '4.2rem' }}
                    >
                        <option value="">Todas as categorias</option>
                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </Select>
                    <Input type="search" placeholder="Buscar por nome" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar produtos" />
                </Toolbar>

                {products.loading && !products.data ? <Loader /> : products.error ? <ErrorState error={products.error} onRetry={products.reload} /> : rows.length === 0 ? (
                    <EmptyState icon={Package} title="Nenhum produto encontrado" action={<ButtonLink to="/admin/produtos/novo">Cadastrar produto</ButtonLink>} />
                ) : (
                    <TableScroll>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Produto</th><th>Categoria</th><th className="num">Preço</th><th className="num">Estoque</th><th>Destaque</th><th>Ativo</th>
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

const ProductCell = styled(Link)`
    display: flex;
    align-items: center;
    gap: 1.2rem;
    min-width: 26rem;
    .thumb { width: 4.8rem; height: 4.8rem; border-radius: 0.8rem; background: var(--white-600); padding: 0.3rem; flex-shrink: 0; overflow: hidden; }
    span { color: var(--gray-700); font-weight: 500; }
    &:hover span { color: var(--primary); }
`
