import { Link } from 'react-router-dom'
import {} from './styles'

const linksArrayMegaMenu = [
    { title: 'Item1', url:'/item1', urlImage: '/src/assets/', altImage: 'Icone', description: 'Textinho1' }
]

export function MegaMenu({closeMegaMenu}) {
    return (
        <>
            <section>
                <div className="container">
                    <div className="close">
                        <button onClick={closeMegaMenu}>
                            <img src="" alt="Fechar" title='Fechar' />
                        </button>
                    </div>
                    <div className="content">
                        <div className="main">
                            <ul>
                                {
                                linksArrayMegaMenu.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.url} title={`Ir para ${link.title}`}>
                                        <div className="image">
                                            <img src={link.urlImage} alt={link.altImage} />
                                        </div>
                                        <div className="texts">
                                            <strong>{link.title}</strong>
                                            <p>{link.description}</p>
                                        </div>
                                    </Link>
                                </li>
                                ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}