import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StylesSearchHeader } from './styles'
import { MagnifyingGlass } from '@phosphor-icons/react'

export function SearchHeader() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [term, setTerm] = useState(params.get('q') || '')

    // Mantém o campo igual à busca atual ao navegar
    useEffect(() => {
        setTerm(params.get('q') || '')
    }, [params])

    const handleSubmit = (event) => {
        event.preventDefault()
        const q = term.trim()
        if (q) navigate(`/busca?q=${encodeURIComponent(q)}`)
    }

    return (
        <StylesSearchHeader role="search" onSubmit={handleSubmit}>
            <label htmlFor="busca" className="sr-only">Buscar produtos</label>
            <input
                id="busca"
                type="search"
                placeholder="O que você procura?"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                autoComplete="off"
            />
            <button type="submit" title="Buscar">
                <MagnifyingGlass size={22} aria-label="Buscar" />
            </button>
        </StylesSearchHeader>
    )
}
