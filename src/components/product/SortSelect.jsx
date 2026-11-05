import styled from 'styled-components'
import { Select } from '../ui'
import { SORT_OPTIONS } from '../../services/catalog'

export function SortSelect({ count, value, onChange }) {
    return (
        <Toolbar>
            <span>
                {count === null ? ' ' : `${count} ${count === 1 ? 'produto encontrado' : 'produtos encontrados'}`}
            </span>
            <label>
                <span>Ordenar por</span>
                <Select value={value} onChange={(event) => onChange(event.target.value)}>
                    {Object.entries(SORT_OPTIONS).map(([key, option]) => (
                        <option key={key} value={key}>{option.label}</option>
                    ))}
                </Select>
            </label>
        </Toolbar>
    )
}

const Toolbar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.6rem;
    margin-bottom: 2.4rem;
    > span { font-size: 1.5rem; color: var(--gray-300); }
    label {
        display: flex;
        align-items: center;
        gap: 1rem;
        span { font-size: 1.4rem; color: var(--gray-300); white-space: nowrap; }
        select { width: 20rem; height: 4.2rem; }
    }
    @media (max-width: 500px) {
        label span { display: none; }
        label select { width: 16rem; }
    }
`
