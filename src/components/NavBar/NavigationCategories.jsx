import { Link } from 'react-router-dom'
import { Categories } from './styles'
import { categories } from '../../data/categories'

export function NavigationCategories() {
    return (
        <>
            <Categories>
                <ul>
                    {
                        categories.map((category, index) => (
                            <li key={index}>
                                <Link to={`/categoria/${category.slug}`} title={`Ir para ${category.name}`}>{category.name}</Link>
                            </li>
                        ))
                    }
                </ul>
            </Categories>
        </>
    )
}