import { Link } from 'react-router-dom'
import { StyleFooter } from './style'
import { ButtonContact } from './ButtonContact'
import LogoThemeDark from '/src/assets/logo-theme-dark.svg'
import LogoLuiz from '/src/assets/logo-luiz-ricardodsgn.svg'
import YoutubeLogo from '/src/assets/logo-youtube.svg'
import LinkedinLogo from '/src/assets/logo-linkedin.svg'
import FacebookLogo from '/src/assets/logo-facebook.svg'
import InstagramLogo from '/src/assets/logo-instagram.svg'
import TwitterLogo from '/src/assets/logo-twitter.svg'

const linksFooter = [
    {
        title: 'Home',
        links: [
            {
                label: 'Política de Privacidade',
                to: '/politica-privacidade',
            },
            {
                label: 'Termos de Uso',
                to: '/termos-uso',
            },
            {
                label: 'Política de Privacidade',
                to: '/politica-privacidade',
            },
            {
                label: 'Meus pedidos',
                to: '/meus-pedidos',
            }
        ],
    },
    {
        title: 'Blog',
        links: [
            {
                label: 'Tecnologia',
                to: '/blog/categoria/tecnologia',
            },
            {
                label: 'Bem-Estar',
                to: '/blog/categoria/bem-estar',
            },
            {
                label: 'Esportes & Lazer',
                to: '/blog/categoria/esportes-lazer',
            },
            {
                label: 'Casa & Jardim',
                to: '/blog/categoria/casa-jardim',
            }
        ],
    },
    {
        title: 'Nossas políticas',
        links: [
            {
                label: 'Política de Entrega',
                to: '/politica-entrega',
            },
            {
                label: 'Política de Privacidade',
                to: '/politica-privacidade',
            },
            {
                label: 'Política de Reembolso',
                to: '/politica-reembolso',
            },
            {
                label: 'Trocas e Devoluções',
                to: '/troca-devolucao',
            },
            {
                label: 'Termos de Uso',
                to: '/termos-uso',
            }
        ],
    },
    {
        title: 'Institucional',
        links: [
            {
                label: 'Conheça a bizzgu',
                to: '/quem-somos',
            },
            {
                label: 'Trabalhe conosco',
                to: '/jobs',
            }
        ],
    },
]

const SocialNetwork = [
    {
        title: 'Youtube',
        urlImage: YoutubeLogo,
    },
    {
        title: 'LinkedIn',
        urlImage: LinkedinLogo,
    },
    {
        title: 'Facebook',
        urlImage: FacebookLogo,
    },
    {
        title: 'Instagram',
        urlImage: InstagramLogo,
    },
    {
        title: 'Twitter',
        urlImage: TwitterLogo,
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
                            SocialNetwork.map((image, index) => (
                                <li key={index}>
                                    <a href="#" title={`Ir para ${image.title}`}>
                                        <img src={image.urlImage} alt={image.title} />
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
                            linksFooter.map((items, index) => (
                                <div key={index} className="list-item">
                                    <h5>{items.title}</h5>
                                    <ul>
                                        {
                                            items.links.map((link, index) => (
                                                <li key={index}>
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
                        />
                        <ButtonContact
                        title="Imprensa:"
                        txt="contato@bizzgu.com.br"
                        />
                    </div>
                </div>
                <div className="bottom">
                    <div className="left-area">
                        <span className="ft-txt">©2023 bizzgu - Todos os direitos reservados</span>
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