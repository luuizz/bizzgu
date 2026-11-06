import { Link } from 'react-router-dom'
import { StyleFooter } from './style'
import { ButtonContact } from './ButtonContact'
import LogoThemeDark from '/src/assets/logo-theme-dark.svg'
import LogoLuiz from '/src/assets/logo-luiz-ricardodsgn.svg'
import { FacebookLogo, InstagramLogo, LinkedinLogo, TiktokLogo, XLogo, YoutubeLogo } from '@phosphor-icons/react'
import { useCategories } from '../../hooks/useCategories'
import { SOCIAL_FIELDS, useStoreSettings } from '../../hooks/useStoreSettings'

// Departamentos vêm das categorias do banco; o resto é fixo
const staticColumns = [
    {
        title: 'Minha conta',
        links: [
            { label: 'Meus pedidos', to: '/minha-conta/pedidos' },
            { label: 'Meus dados', to: '/minha-conta/dados' },
            { label: 'Lista de desejos', to: '/lista-desejos' },
            { label: 'Carrinho', to: '/carrinho-compras' },
        ],
    },
    {
        title: 'Nossas políticas',
        links: [
            { label: 'Política de Entrega', to: '/institucional/entrega' },
            { label: 'Trocas e Devoluções', to: '/institucional/trocas-devolucoes' },
            { label: 'Política de Privacidade', to: '/institucional/privacidade' },
        ],
    },
    {
        title: 'Institucional',
        links: [
            { label: 'Sobre a loja', to: '/sobre' },
            { label: 'Blog', to: '/blog' },
            { label: 'Ofertas', to: '/busca?ofertas=1' },
        ],
    },
]

const socialIcons = {
    instagram: InstagramLogo,
    facebook: FacebookLogo,
    youtube: YoutubeLogo,
    linkedin: LinkedinLogo,
    x: XLogo,
    tiktok: TiktokLogo,
}

export function Footer() {
    const categories = useCategories()
    const settings = useStoreSettings()
    const socials = SOCIAL_FIELDS.filter(({ key }) => settings[key])
    const columns = [
        {
            title: 'Departamentos',
            links: categories.slice(0, 5).map((category) => ({ label: category.name, to: `/categoria/${category.slug}` })),
        },
        ...staticColumns,
    ]
    const contacts = [
        settings.support_email && { title: 'Atendimento:', txt: `${settings.support_email}${settings.business_hours ? ` (${settings.business_hours})` : ''}`, href: `mailto:${settings.support_email}` },
        settings.whatsapp && { title: 'WhatsApp:', txt: formatWhatsapp(settings.whatsapp), href: `https://wa.me/${settings.whatsapp}` },
        settings.phone && { title: 'Telefone:', txt: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, '')}` },
        settings.press_email && { title: 'Imprensa:', txt: settings.press_email, href: `mailto:${settings.press_email}` },
    ].filter(Boolean)

    return (
        <StyleFooter>
            <div className="container">
                <div className="top">
                    <div className="left-area">
                        <Link to="/" title="Ir para a página Inicial">
                            <img src={LogoThemeDark} alt="Bizzgu"/>
                        </Link>
                    </div>
                    {socials.length > 0 && (
                        <div className="right-area">
                            <span>Acompanhe nas redes</span>
                            <ul>
                                {socials.map(({ key, label }) => {
                                    const Icon = socialIcons[key]
                                    return (
                                        <li key={key}>
                                            <a href={settings[key]} target="_blank" rel="noreferrer" title={`Ir para ${label}`}>
                                                <Icon size={28} aria-label={label} />
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="center">
                    <div className="links">
                        {
                            columns.filter((column) => column.links.length).map((items) => (
                                <div key={items.title} className="list-item">
                                    <h5>{items.title}</h5>
                                    <ul>
                                        {
                                            items.links.map((link) => (
                                                <li key={link.label}>
                                                    <Link to={link.to}>
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            ))
                        }
                    </div>
                    <div className="contact">
                        {contacts.map((contact) => <ButtonContact key={contact.title} {...contact} />)}
                    </div>
                </div>
                <div className="bottom">
                    <div className="left-area">
                        <span className="ft-txt">©{new Date().getFullYear()} Bizzgu - Projeto de portfólio, sem vendas reais</span>
                    </div>
                    <div className="right-area">
                        <span className="ft-txt">Desenvolvido por:</span>
                        <a href="https://luizricardodsgn.com.br/" target="_blank" rel="noreferrer" title="Visitar site">
                            <img src={LogoLuiz} alt="Logo Luiz Ricardo Design" />
                        </a>
                    </div>
                </div>
            </div>
        </StyleFooter>
    )
}
// 5511999998888 → (11) 99999-8888
function formatWhatsapp(digits) {
    const local = digits.startsWith('55') ? digits.slice(2) : digits
    const match = local.match(/^(\d{2})(\d{4,5})(\d{4})$/)
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : `+${digits}`
}
