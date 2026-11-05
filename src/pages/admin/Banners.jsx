import { ArrowDown, ArrowUp, Eye, Image as ImageIcon, PencilSimple, Plus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DashHeader } from '../../components/DashboardLayout'
import { Badge, ButtonLink, Card, EmptyState, ErrorState, Loader } from '../../components/ui'
import { Switch } from './Products'
import { useAsync } from '../../hooks/useAsync'
import { useToast } from '../../hooks/useToast'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { listBanners, reorderBanners, saveBanner } from '../../services/admin'
import { imageUrl } from '../../lib/format'
import { bannerStatus } from '../../lib/banners'
import bgSlide from '/src/assets/bg-slide-desktop.svg'

export function Banners() {
    useDocumentTitle('Banners · Admin')
    const toast = useToast()
    const banners = useAsync(() => listBanners(), [])
    const rows = banners.data || []

    const toggle = async (banner) => {
        banners.setData(rows.map((row) => (row.id === banner.id ? { ...row, active: !row.active } : row)))
        try {
            await saveBanner(banner.id, { active: !banner.active })
        } catch (error) {
            toast.show(error.message, 'danger')
            banners.reload()
        }
    }

    const move = async (index, direction) => {
        const target = index + direction
        if (target < 0 || target >= rows.length) return
        const next = [...rows]
        ;[next[index], next[target]] = [next[target], next[index]]
        banners.setData(next)
        try {
            await reorderBanners(next.map((row) => row.id))
        } catch (error) {
            toast.show(error.message, 'danger')
            banners.reload()
        }
    }

    const live = rows.filter((banner) => bannerStatus(banner).label === 'No ar').length

    return (
        <>
            <DashHeader>
                <div>
                    <h1>Banners</h1>
                    <p>{banners.loading ? ' ' : `${live} no ar · a ordem abaixo é a ordem do carrossel da home`}</p>
                </div>
                <div className="actions">
                    <ButtonLink to="/admin/banners/novo"><Plus size={20} weight="bold" /> Novo banner</ButtonLink>
                </div>
            </DashHeader>

            {banners.loading && !banners.data ? <Loader /> : banners.error ? <ErrorState error={banners.error} onRetry={banners.reload} /> : rows.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={ImageIcon}
                        title="Nenhum banner cadastrado"
                        description="Sem banners, a home mostra os destaques padrão da loja."
                        action={<ButtonLink to="/admin/banners/novo">Criar banner</ButtonLink>}
                    />
                </Card>
            ) : (
                <List>
                    {rows.map((banner, index) => {
                        const status = bannerStatus(banner)
                        return (
                            <li key={banner.id} className={status.label === 'No ar' ? '' : 'off'}>
                                <div className="order">
                                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Subir"><ArrowUp size={16} weight="bold" /></button>
                                    <span>{index + 1}</span>
                                    <button type="button" onClick={() => move(index, 1)} disabled={index === rows.length - 1} aria-label="Descer"><ArrowDown size={16} weight="bold" /></button>
                                </div>
                                <Link to={`/admin/banners/${banner.id}`} className="thumb" aria-label={`Editar ${banner.title}`}>
                                    {banner.layout === 'image'
                                        ? <img src={imageUrl(banner.image)} alt="" />
                                        : (
                                            <div className="text-thumb" style={{ backgroundImage: `url(${bgSlide})` }}>
                                                <strong>{banner.title}</strong>
                                                {banner.image && <img src={imageUrl(banner.image)} alt="" />}
                                            </div>
                                        )}
                                </Link>
                                <div className="info">
                                    <Link to={`/admin/banners/${banner.id}`} className="title">{banner.title}</Link>
                                    <div className="meta">
                                        <Badge $tone={status.tone}>{status.label}</Badge>
                                        <span>{banner.layout === 'image' ? 'Arte pronta' : 'Texto + imagem'}</span>
                                        {banner.link && <span className="link">{banner.link}</span>}
                                    </div>
                                </div>
                                <div className="tools">
                                    <Switch checked={banner.active} onChange={() => toggle(banner)} label={`Ativo: ${banner.title}`} />
                                    <Link to={`/admin/banners/${banner.id}`} title="Editar" aria-label={`Editar ${banner.title}`}><PencilSimple size={20} /></Link>
                                </div>
                            </li>
                        )
                    })}
                </List>
            )}

            {rows.length > 0 && (
                <Tip>
                    <Eye size={20} />
                    <span>Os visitantes veem só os banners <strong>No ar</strong>. Agendados entram e saem sozinhos no horário definido.</span>
                </Tip>
            )}
        </>
    )
}

const List = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    li {
        display: grid;
        grid-template-columns: auto 24rem minmax(0, 1fr) auto;
        align-items: center;
        gap: 2rem;
        background: var(--white);
        border-radius: 1.6rem;
        padding: 1.2rem 2rem 1.2rem 1.2rem;
        &.off .thumb { opacity: 0.55; }
    }
    .order {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
        span { font-size: 1.3rem; font-weight: 600; color: var(--gray-200); }
        button {
            width: 2.8rem;
            height: 2.8rem;
            border-radius: 0.6rem;
            display: grid;
            place-items: center;
            color: var(--gray-300);
            &:hover:not(:disabled) { background: var(--primary-50); color: var(--primary); }
            &:disabled { opacity: 0.3; }
        }
    }
    .thumb {
        display: block;
        aspect-ratio: 4.4 / 1;
        border-radius: 0.8rem;
        overflow: hidden;
        background: var(--gray-500);
        transition: opacity .2s ease;
        > img { width: 100%; height: 100%; object-fit: cover; }
    }
    .text-thumb {
        height: 100%;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.8rem;
        padding: 0 1.2rem;
        strong { color: var(--white); font-size: 1.1rem; line-height: 1.2; }
        img { height: 85%; object-fit: contain; }
    }
    .info { min-width: 0; display: flex; flex-direction: column; gap: 0.6rem; }
    .title { font-size: 1.6rem; font-weight: 600; color: var(--gray-800); &:hover { color: var(--primary); } }
    .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; font-size: 1.3rem; color: var(--gray-200); }
    .link { font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 28rem; }
    .tools {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        > a {
            display: grid;
            place-items: center;
            width: 3.6rem;
            height: 3.6rem;
            border-radius: 0.8rem;
            color: var(--gray-300);
            &:hover { background: var(--primary-50); color: var(--primary); }
        }
    }
    @media (max-width: 800px) {
        li { grid-template-columns: auto minmax(0, 1fr); padding: 1.2rem; }
        .thumb { grid-column: 2; }
        .info { grid-column: 1 / -1; }
        .tools { grid-column: 1 / -1; justify-content: flex-end; }
    }
`

const Tip = styled.p`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.4rem;
    color: var(--gray-300);
    svg { color: var(--primary); flex-shrink: 0; }
`
