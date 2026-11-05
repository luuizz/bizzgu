import { useState } from 'react'
import styled from 'styled-components'
import { imageUrl } from '../../lib/format'

// Mostra a imagem do produto ou um placeholder com as iniciais
export function ProductImage({ src, alt, className, loading = 'lazy' }) {
    const [failed, setFailed] = useState(false)

    if (!src || failed) {
        const initials = (alt || '?')
            .split(' ')
            .filter((word) => word.length > 2)
            .slice(0, 2)
            .map((word) => word[0])
            .join('')
            .toUpperCase()
        return (
            <Placeholder className={className} role="img" aria-label={alt}>
                <span>{initials || 'B'}</span>
            </Placeholder>
        )
    }

    return <Img className={className} src={imageUrl(src)} alt={alt} loading={loading} onError={() => setFailed(true)} />
}

const Img = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`

const Placeholder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
        radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.5), transparent 55%),
        linear-gradient(135deg, var(--primary-100), var(--primary-50));
    border-radius: inherit;
    span {
        font-family: var(--font-red-hat);
        font-weight: 700;
        font-size: 3.2rem;
        color: var(--primary);
        opacity: 0.55;
        letter-spacing: 0.2rem;
    }
`
