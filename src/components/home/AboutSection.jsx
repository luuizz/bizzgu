import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowRight } from '@phosphor-icons/react'
import { useStoreSettings } from '../../hooks/useStoreSettings'
import { imageUrl } from '../../lib/format'
import logo from '/src/assets/logo-theme-dark.svg'

// Seção "Sobre a loja" no fim da página inicial (texto em Admin → Configurações)
export function AboutSection() {
    const settings = useStoreSettings()
    if (!settings.about_summary) return null

    return (
        <Wrapper aria-labelledby="sobre-titulo">
            <div className="container">
                <div className="card">
                    <div className="media">
                        {settings.about_image
                            ? <img src={imageUrl(settings.about_image)} alt="" loading="lazy" />
                            : <img src={logo} alt="" className="logo" />}
                    </div>
                    <div className="text">
                        <span className="eyebrow">Sobre a loja</span>
                        <h2 id="sobre-titulo">{settings.about_title}</h2>
                        <p>{settings.about_summary}</p>
                        <Link to="/sobre" className="more">Conheça a nossa história <ArrowRight size={18} weight="bold" /></Link>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.section`
    padding: 2.4rem 0 8rem;
    .card {
        display: grid;
        grid-template-columns: 38rem minmax(0, 1fr);
        align-items: stretch;
        border-radius: 2.4rem;
        overflow: hidden;
        background: var(--gray-500);
        color: var(--white);
    }
    .media {
        min-height: 26rem;
        background: radial-gradient(circle at 30% 30%, rgba(105, 60, 234, 0.6), transparent 70%), var(--gray-500);
        display: grid;
        place-items: center;
        img { width: 100%; height: 100%; object-fit: cover; }
        .logo { width: 60%; height: auto; object-fit: contain; }
    }
    .text {
        padding: 4.8rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 1.4rem;
    }
    .eyebrow { font-size: 1.3rem; font-weight: 600; letter-spacing: 0.12rem; text-transform: uppercase; color: var(--primary-100); }
    h2 { font-size: 3.2rem; color: var(--white); }
    p { font-size: 1.7rem; line-height: 1.6; color: var(--gray-100); max-width: 60rem; }
    .more {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        margin-top: 0.8rem;
        font-family: var(--font-red-hat);
        font-weight: 700;
        font-size: 1.6rem;
        color: var(--white);
        border-bottom: 0.2rem solid var(--primary);
        padding-bottom: 0.2rem;
        &:hover { color: var(--primary-100); }
    }
    @media (max-width: 800px) {
        .card { grid-template-columns: 1fr; }
        .media { min-height: 18rem; }
        .text { padding: 2.8rem; }
        h2 { font-size: 2.6rem; }
    }
`
