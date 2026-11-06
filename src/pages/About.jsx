import styled from 'styled-components'
import { ChatCircleText, Clock, EnvelopeSimple, MapPin, Phone, Storefront, WhatsappLogo } from '@phosphor-icons/react'
import { Page } from '../components/layout'
import { Breadcrumb, ButtonLink, PageTitle } from '../components/ui'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { paragraphs, SOCIAL_FIELDS, useStoreSettings } from '../hooks/useStoreSettings'
import { imageUrl } from '../lib/format'

// Página /sobre: texto, imagem e contatos editáveis em Admin → Configurações
export function About() {
    const settings = useStoreSettings()
    useDocumentTitle(settings.about_title)
    const text = paragraphs(settings.about_text)
    const socials = SOCIAL_FIELDS.filter(({ key }) => settings[key])

    const contacts = [
        settings.support_email && { icon: EnvelopeSimple, label: 'E-mail', value: settings.support_email, href: `mailto:${settings.support_email}` },
        settings.whatsapp && { icon: WhatsappLogo, label: 'WhatsApp', value: `+${settings.whatsapp}`, href: `https://wa.me/${settings.whatsapp}` },
        settings.phone && { icon: Phone, label: 'Telefone', value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, '')}` },
        settings.business_hours && { icon: Clock, label: 'Horário', value: settings.business_hours },
        settings.address && { icon: MapPin, label: 'Endereço', value: settings.address },
    ].filter(Boolean)

    return (
        <Page>
            <div className="container">
                <div className="page-head">
                    <Breadcrumb items={[{ label: 'Início', to: '/' }, { label: 'Sobre' }]} />
                </div>

                <Hero>
                    <div className="text">
                        <PageTitle>{settings.about_title}</PageTitle>
                        {settings.about_summary && <p className="summary">{settings.about_summary}</p>}
                        <ButtonLink to="/busca?ofertas=1"><Storefront size={20} /> Ver ofertas</ButtonLink>
                    </div>
                    <div className="media">
                        {settings.about_image
                            ? <img src={imageUrl(settings.about_image)} alt="" />
                            : <div className="fallback"><Storefront size={96} /></div>}
                    </div>
                </Hero>

                <Body>
                    {text.length > 0 && (
                        <article>
                            {text.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
                        </article>
                    )}

                    {(contacts.length > 0 || socials.length > 0) && (
                        <aside>
                            <h2><ChatCircleText size={24} /> Fale com a gente</h2>
                            <ul className="contacts">
                                {contacts.map(({ icon: Icon, label, value, href }) => (
                                    <li key={label}>
                                        <Icon size={22} />
                                        <div>
                                            <small>{label}</small>
                                            {href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{value}</a> : <span>{value}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {socials.length > 0 && (
                                <div className="socials">
                                    {socials.map(({ key, label }) => (
                                        <a key={key} href={settings[key]} target="_blank" rel="noreferrer">{label}</a>
                                    ))}
                                </div>
                            )}
                        </aside>
                    )}
                </Body>
            </div>
        </Page>
    )
}

const Hero = styled.section`
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 4.8rem;
    align-items: center;
    background: var(--white);
    border-radius: 2.4rem;
    padding: 4.8rem;
    .text { display: flex; flex-direction: column; align-items: flex-start; gap: 2rem; }
    .summary { font-size: 2rem; line-height: 1.5; color: var(--gray-400); }
    .media { border-radius: 1.6rem; overflow: hidden; aspect-ratio: 4 / 3; background: var(--primary-50); }
    .media img { width: 100%; height: 100%; object-fit: cover; }
    .fallback { height: 100%; display: grid; place-items: center; color: var(--primary); background: linear-gradient(135deg, var(--primary-50), #e2d6ff); }
    @media (max-width: 900px) { grid-template-columns: 1fr; padding: 2.4rem; gap: 2.4rem; .summary { font-size: 1.7rem; } }
`

const Body = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 36rem;
    gap: 3.2rem;
    align-items: start;
    margin: 3.2rem 0 8rem;
    article {
        background: var(--white);
        border-radius: 1.6rem;
        padding: 3.2rem;
        display: flex;
        flex-direction: column;
        gap: 1.6rem;
        p { font-size: 1.7rem; line-height: 1.7; color: var(--gray-400); }
    }
    aside {
        background: var(--white);
        border-radius: 1.6rem;
        padding: 2.8rem;
        h2 { display: flex; align-items: center; gap: 0.8rem; font-size: 2rem; margin-bottom: 2rem; svg { color: var(--primary); } }
    }
    .contacts { display: flex; flex-direction: column; gap: 1.6rem; }
    .contacts li { display: flex; gap: 1.2rem; align-items: flex-start; svg { color: var(--primary); flex-shrink: 0; margin-top: 0.2rem; } }
    .contacts div { display: flex; flex-direction: column; min-width: 0; }
    .contacts small { font-size: 1.2rem; color: var(--gray-200); text-transform: uppercase; letter-spacing: 0.06rem; }
    .contacts a, .contacts span { font-size: 1.5rem; color: var(--gray-700); word-break: break-word; }
    .contacts a:hover { color: var(--primary); }
    .socials { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 2.4rem; padding-top: 2rem; border-top: 0.1rem solid var(--white-500); }
    .socials a { font-size: 1.3rem; font-weight: 600; color: var(--primary); background: var(--primary-50); padding: 0.6rem 1.2rem; border-radius: 2rem; }
    @media (max-width: 900px) { grid-template-columns: 1fr; article { padding: 2.4rem; } }
`
