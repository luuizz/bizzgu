import styled from 'styled-components'
import { Minus, Plus } from '@phosphor-icons/react'

export function QuantityStepper({ value, min = 1, max, onChange, size = 'md', label = 'Quantidade' }) {
    const atMin = value <= min
    const atMax = max !== undefined && value >= max

    return (
        <Wrapper $size={size} role="group" aria-label={label}>
            <button type="button" onClick={() => onChange(value - 1)} disabled={atMin} aria-label="Diminuir quantidade"><Minus size={size === 'sm' ? 16 : 20} weight="bold" /></button>
            <output aria-live="polite">{value}</output>
            <button type="button" onClick={() => onChange(value + 1)} disabled={atMax} aria-label="Aumentar quantidade"><Plus size={size === 'sm' ? 16 : 20} weight="bold" /></button>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: inline-flex;
    align-items: center;
    background: var(--white);
    border: 0.1rem solid var(--gray-50);
    border-radius: var(--radius);
    height: ${({ $size }) => ($size === 'sm' ? '3.6rem' : '5.2rem')};
    button {
        width: ${({ $size }) => ($size === 'sm' ? '3.4rem' : '4.8rem')};
        height: 100%;
        display: grid;
        place-items: center;
        font-size: ${({ $size }) => ($size === 'sm' ? '1.8rem' : '2.2rem')};
        color: var(--primary);
        &:disabled { color: var(--gray-100); cursor: not-allowed; }
        &:hover:not(:disabled) { color: var(--violet-800); }
    }
    output {
        min-width: ${({ $size }) => ($size === 'sm' ? '3rem' : '4.8rem')};
        text-align: center;
        font-family: var(--font-red-hat);
        font-weight: 600;
        font-size: ${({ $size }) => ($size === 'sm' ? '1.5rem' : '1.8rem')};
        color: var(--gray-800);
    }
`
