import { NavLink } from 'react-router-dom'
import { Categories } from './styles'
import { useCategories } from '../../hooks/useCategories'

export function NavigationCategories() {
    const categories = useCategories()

    return (
        <Categories aria-label="Categorias">
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        <NavLink to={`/categoria/${category.slug}`} title={`Ir para ${category.name}`}>
                            {category.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </Categories>
    )
}
