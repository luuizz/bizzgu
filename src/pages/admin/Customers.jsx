import { useState } from 'react'
import { DashHeader } from '../../components/DashboardLayout'
import { Badge, Card, EmptyState, ErrorState, Input, Loader, Table, TableScroll } from '../../components/ui'
import { Toolbar } from './Orders'
import { RowActions } from './Categories'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { listUsers, setUserRole } from '../../services/admin'
import { formatDate, maskPhone } from '../../lib/format'

export function Customers() {
    useDocumentTitle('Clientes · Admin')
    const { user } = useAuth()
    const toast = useToast()
    const [term, setTerm] = useState('')
    const [search, setSearch] = useState('')
    const users = useAsync(() => listUsers({ search }), [search])
    const rows = users.data || []

    const changeRole = async (profile) => {
        const role = profile.role === 'admin' ? 'customer' : 'admin'
        const question = role === 'admin'
            ? `Dar acesso de administrador para ${profile.full_name || profile.email}?`
            : `Remover o acesso de administrador de ${profile.full_name || profile.email}?`
        if (!window.confirm(question)) return
        try {
            await setUserRole(profile.id, role)
            toast.show('Permissão atualizada.', 'success')
            users.reload()
        } catch (error) {
            toast.show(error.message, 'danger')
        }
    }

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Clientes</h1>
                    <p>{users.loading ? ' ' : `${rows.length} ${rows.length === 1 ? 'conta' : 'contas'}`}</p>
                </div>
            </DashHeader>

            <Card>
                <Toolbar onSubmit={(event) => { event.preventDefault(); setSearch(term.trim()) }}>
                    <Input type="search" placeholder="Buscar por nome ou e-mail" value={term} onChange={(event) => setTerm(event.target.value)} aria-label="Buscar clientes" />
                </Toolbar>

                {users.loading && !users.data ? <Loader /> : users.error ? <ErrorState error={users.error} onRetry={users.reload} /> : rows.length === 0 ? (
                    <EmptyState title="Nenhuma conta encontrada" />
                ) : (
                    <TableScroll>
                        <Table>
                            <thead>
                                <tr><th>Cliente</th><th>Telefone</th><th>Desde</th><th className="num">Pedidos</th><th>Papel</th><th /></tr>
                            </thead>
                            <tbody>
                                {rows.map((profile) => (
                                    <tr key={profile.id}>
                                        <td>
                                            <div className="stack">
                                                <span>{profile.full_name || '—'}</span>
                                                <small>{profile.email}</small>
                                            </div>
                                        </td>
                                        <td>{profile.phone ? maskPhone(profile.phone) : '—'}</td>
                                        <td>{formatDate(profile.created_at)}</td>
                                        <td className="num">{profile.orders?.[0]?.count ?? 0}</td>
                                        <td>{profile.role === 'admin' ? <Badge>Admin</Badge> : <Badge $tone="success">Cliente</Badge>}</td>
                                        <td className="num">
                                            {profile.id !== user.id && (
                                                <RowActions>
                                                    <button type="button" className={profile.role === 'admin' ? 'danger' : ''} onClick={() => changeRole(profile)}>
                                                        {profile.role === 'admin' ? 'Remover admin' : 'Tornar admin'}
                                                    </button>
                                                </RowActions>
                                            )}
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
