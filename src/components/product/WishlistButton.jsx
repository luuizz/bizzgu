import styled, { css } from 'styled-components'
import { useWishlist } from '../../hooks/useWishlist'

export function HeartIcon({ filled }) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
                d="M12 20.5s-7.5-4.6-9.6-9.2C.9 8 2.9 4 6.6 4c2.2 0 3.6 1.2 4.4 2.5h2C13.8 5.2 15.2 4 17.4 4c3.7 0 5.7 4 4.2 7.3-2.1 4.6-9.6 9.2-9.6 9.2Z"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    )
}

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
            <HeartIcon filled={saved} />
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
