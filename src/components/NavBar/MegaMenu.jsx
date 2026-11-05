import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { StyleMegaMenu } from './styles'
import { useCategories } from '../../hooks/useCategories'
import imgMegaMenu from '/src/assets/img-megaMenu.jpg'

export function MegaMenu({ closeMegaMenu }) {
    const categories = useCategories()

    useEffect(() => {
        const onKey = (event) => event.key === 'Escape' && closeMegaMenu()
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [closeMegaMenu])

    return (
        <StyleMegaMenu>
            <div className="backdrop" onClick={closeMegaMenu} aria-hidden="true" />
            <div className="panel">
                <div className="container">
                    <div className="content">
                        <ul>
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link to={`/categoria/${category.slug}`} onClick={closeMegaMenu}>
                                        <strong>{category.name}</strong>
                                        {category.description && <p>{category.description}</p>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link to="/categoria/eletrodomesticos" className="banner" onClick={closeMegaMenu}>
                            <img src={imgMegaMenu} alt="Oferta: Geladeira Electrolux Frost Free" />
                        </Link>
                    </div>
                </div>
            </div>
        </StyleMegaMenu>
    )
}
