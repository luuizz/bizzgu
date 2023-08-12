import { Link } from 'react-router-dom'
import { Categories } from './styles'

const linksNavArray = [
    { text: 'Celulares', url: '/celulares', txtTitle: 'Ir para Celulares' },
    { text: 'Games', url: '/games', txtTitle: 'Ir para Games' },
    { text: 'Eletrodomésticos', url: '/eletrodomesticos', txtTitle: 'Ir para Eletrodomésticos' },
    { text: 'Esporte & Lazer', url: '/moveis', txtTitle: 'Ir para Esporte & Lazer' },
    { text: 'SmarTV', url: '/smartv', txtTitle: 'Ir para SmarTV' },
    { text: 'Supermercado', url: '/supermercado', txtTitle: 'Ir para Supermercado' },
    { text: 'Bebês & Infantil', url: '/bebes-infantil', txtTitle: 'Ir para Bebês & Infantil' }
]

export function NavigationCategories() {
    return (
        <>
            <Categories>
                <ul>
                    {
                        linksNavArray.map((link, index) => (
                            <li key={index}>
                                <Link to={link.url} title={link.txtTitle}>{link.text}</Link>
                            </li>
                        ))
                    }
                </ul>
            </Categories>
        </>
    )
}