import { Heart } from '@phosphor-icons/react'
import styled, { css } from 'styled-components'
import { useWishlist } from '../../hooks/useWishlist'

export function WishlistButton({ product, withLabel = false, className }) {
    const wishlist = useWishlist()
    const saved = wishlist.has(product.id)

    const handleClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        wishlist.toggle(product)
    }

    return (
        <StyledButton
            type="button"
            className={className}
            onClick={handleClick}
            aria-pressed={saved}
            aria-label={saved ? 'Remover da lista de desejos' : 'Salvar na lista de desejos'}
            title={saved ? 'Remover da lista de desejos' : 'Salvar na lista de desejos'}
            $saved={saved}
            $withLabel={withLabel}
        >
            <Heart size={withLabel ? 24 : 20} weight={saved ? 'fill' : 'duotone'} />
            {withLabel && <span>{saved ? 'Na lista de desejos' : 'Lista de desejos'}</span>}
        </StyledButton>
    )
}

const StyledButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    color: ${({ $saved }) => ($saved ? 'var(--danger)' : 'var(--gray-200)')};
    transition: color .2s ease, transform .2s ease;
    &:hover { color: var(--danger); }
    &:active { transform: scale(0.9); }
    ${({ $withLabel }) => !$withLabel && css`
        width: 3.6rem;
        height: 3.6rem;
        border-radius: 50%;
        background: var(--white);
        box-shadow: var(--shadow-sm);
    `}
    span { font-size: 1.5rem; color: var(--gray-300); }
`
