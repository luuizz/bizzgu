import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CardTitle, DashHeader } from '../../components/DashboardLayout'
import { Alert, Button, Card, ErrorState, Field, Input, Loader, Table, TableScroll, Textarea } from '../../components/ui'
import { useAsync } from '../../hooks/useAsync'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { invalidateCategories } from '../../hooks/useCategories'
import { deleteCategory, listCategoriesWithCount, saveCategory } from '../../services/admin'
import { slugify } from '../../lib/format'

const empty = { id: null, name: '', slug: '', description: '', sort_order: '0' }

export function Categories() {
    useDocumentTitle('Categorias · Admin')
    const toast = useToast()
    const categories = useAsync(() => listCategoriesWithCount(), [])
    const [form, setForm] = useState(empty)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    const editing = Boolean(form.id)

    const edit = (category) => {
        setError('')
        setForm({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            sort_order: String(category.sort_order),
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        if (form.name.trim().length < 2) return setError('Informe o nome.')
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug)) return setError('Slug inválido: use letras minúsculas, números e hífens.')
        setSaving(true)
        try {
            await saveCategory(form.id, {
                name: form.name.trim(),
                slug: form.slug,
                description: form.description.trim() || null,
                sort_order: Number(form.sort_order) || 0,
            })
            toast.show(editing ? 'Categoria atualizada!' : 'Categoria criada!', 'success')
            setForm(empty)
            invalidateCategories()
            categories.reload()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const remove = async (category) => {
        const count = category.products?.[0]?.count || 0
        const message = count
            ? `Excluir "${category.name}"? Os ${count} produto(s) dela ficarão sem categoria.`
            : `Excluir "${category.name}"?`
        if (!window.confirm(message)) return
        try {
            await deleteCategory(category.id)
            toast.show('Categoria excluída.', 'success')
            if (form.id === category.id) setForm(empty)
            invalidateCategories()
            categories.reload()
        } catch (err) {
            toast.show(err.message, 'danger')
        }
    }

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Categorias</h1>
                    <p>Organize os departamentos exibidos no menu da loja.</p>
                </div>
            </DashHeader>

            <Layout>
                <Card>
                    {categories.loading && !categories.data ? <Loader /> : categories.error ? <ErrorState error={categories.error} onRetry={categories.reload} /> : (
                        <TableScroll>
                            <Table>
                                <thead>
                                    <tr><th>Ordem</th><th>Nome</th><th className="num">Produtos</th><th /></tr>
                                </thead>
                                <tbody>
                                    {categories.data.map((category) => (
                                        <tr key={category.id}>
                                            <td>{category.sort_order}</td>
                                            <td>
                                                <div className="stack">
                                                    <span>{category.name}</span>
                                                    <small>/categoria/{category.slug}</small>
                                                </div>
                                            </td>
                                            <td className="num">{category.products?.[0]?.count ?? 0}</td>
                                            <td className="num">
                                                <RowActions>
                                                    <Link to={`/categoria/${category.slug}`} target="_blank">Ver</Link>
                                                    <button type="button" onClick={() => edit(category)}>Editar</button>
                                                    <button type="button" className="danger" onClick={() => remove(category)}>Excluir</button>
                                                </RowActions>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </TableScroll>
                    )}
                </Card>

                <Card>
                    <CardTitle>{editing ? 'Editar categoria' : 'Nova categoria'}</CardTitle>
                    <FormStack onSubmit={handleSubmit}>
                        {error && <Alert $tone="danger">{error}</Alert>}
                        <Field label="Nome" htmlFor="cat-name">
                            <Input
                                id="cat-name"
                                value={form.name}
                                onChange={(event) => setForm((prev) => ({
                                    ...prev,
                                    name: event.target.value,
                                    slug: editing ? prev.slug : slugify(event.target.value),
                                }))}
                            />
                        </Field>
                        <Field label="Slug" htmlFor="cat-slug">
                            <Input id="cat-slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })} />
                        </Field>
                        <Field label="Descrição" htmlFor="cat-description">
                            <Textarea id="cat-description" rows={3} style={{ minHeight: '8rem' }} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                        </Field>
                        <Field label="Ordem no menu" htmlFor="cat-order">
                            <Input id="cat-order" type="number" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} />
                        </Field>
                        <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar categoria'}</Button>
                        {editing && <Button type="button" $variant="ghost" onClick={() => setForm(empty)}>Cancelar edição</Button>}
                    </FormStack>
                </Card>
            </Layout>
        </>
    )
}

const Layout = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 34rem;
    gap: 2.4rem;
    align-items: start;
    @media (max-width: 1100px) { grid-template-columns: 1fr; }
`

const FormStack = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
`

export const RowActions = styled.div`
    display: inline-flex;
    gap: 1.6rem;
    a, button { font-size: 1.4rem; font-weight: 600; color: var(--primary); }
    .danger { color: var(--danger); }
`
