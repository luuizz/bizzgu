import { Link } from 'react-router-dom'
import { StyleFooter } from './style'
import { ButtonContact } from './ButtonContact'
import LogoThemeDark from '/src/assets/logo-theme-dark.svg'
import LogoLuiz from '/src/assets/logo-luiz-ricardodsgn.svg'
import { FacebookLogo, InstagramLogo, LinkedinLogo, XLogo, YoutubeLogo } from '@phosphor-icons/react'

const linksFooter = [
    {
        title: 'Departamentos',
        links: [
            { label: 'Celulares', to: '/categoria/celulares' },
            { label: 'Games', to: '/categoria/games' },
            { label: 'SmartTV', to: '/categoria/smarttv' },
            { label: 'Eletrodomésticos', to: '/categoria/eletrodomesticos' },
        ],
    },
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
            { label: 'Conheça a Bizzgu', to: '/institucional/sobre' },
            { label: 'Ofertas', to: '/busca?ofertas=1' },
        ],
    },
]

const SocialNetwork = [
    {
        title: 'Youtube',
        icon: YoutubeLogo,
        url: 'https://www.youtube.com/',
    },
    {
        title: 'LinkedIn',
        icon: LinkedinLogo,
        url: 'https://www.linkedin.com/',
    },
    {
        title: 'Facebook',
        icon: FacebookLogo,
        url: 'https://www.facebook.com/',
    },
    {
        title: 'Instagram',
        icon: InstagramLogo,
        url: 'https://www.instagram.com/',
    },
    {
        title: 'X (Twitter)',
        icon: XLogo,
        url: 'https://x.com/',
    },
]

export function Footer() {
    return (
        <StyleFooter>
            <div className="container">
                <div className="top">
                    <div className="left-area">
                        <Link to="/" title="Ir para a página Inicial">
                            <img src={LogoThemeDark} alt="Bizzgu"/>
                        </Link>
                    </div>
                    <div className="right-area">
                        <span>Acompanhe nas redes</span>
                        <ul>
                        {
                            SocialNetwork.map(({ title, url, icon: Icon }) => (
                                <li key={title}>
                                    <a href={url} target="_blank" rel="noreferrer" title={`Ir para ${title}`}>
                                        <Icon size={28} aria-label={title} />
                                    </a>
                                </li>
                            ))
                        }
                        </ul>
                    </div>
                </div>
                <div className="center">
                    <div className="links">
                        {
                            linksFooter.map((items) => (
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
                        <ButtonContact
                        title="Atendimento:"
                        txt="oi@bizzgu.com.br (24 horas)"
                        href="mailto:oi@bizzgu.com.br"
                        />
                        <ButtonContact
                        title="Imprensa:"
                        txt="contato@bizzgu.com.br"
                        href="mailto:contato@bizzgu.com.br"
                        />
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