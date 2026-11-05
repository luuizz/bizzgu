import { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Plus, Tag, X } from '@phosphor-icons/react'
import { useAsync } from '../../hooks/useAsync'
import { useToast } from '../../hooks/useToast'
import { createTag, listAllTags } from '../../services/admin'
import { slugify } from '../../lib/format'

// Campo de tags do produto: escolhe entre as existentes ou cria uma nova com Enter
export function TagInput({ id, value, onChange }) {
    const toast = useToast()
    const all = useAsync(() => listAllTags(), [])
    const inputRef = useRef(null)
    const [text, setText] = useState('')
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(0)
    const [creating, setCreating] = useState(false)

    const chosen = new Set(value.map((tag) => tag.id))
    const term = slugify(text)
    const suggestions = useMemo(() => (all.data || [])
        .filter((tag) => !chosen.has(tag.id) && (!term || tag.slug.includes(term)))
        .slice(0, 8), [all.data, term, value]) // eslint-disable-line react-hooks/exhaustive-deps
    const exact = (all.data || []).find((tag) => tag.slug === term)
    const canCreate = term && !exact

    const add = (tag) => {
        if (!chosen.has(tag.id)) onChange([...value, tag])
        setText('')
        setActive(0)
        inputRef.current?.focus()
    }

    const create = async () => {
        const name = text.trim().replace(/,$/, '')
        if (!name) return
        setCreating(true)
        try {
            const tag = await createTag(name, slugify(name))
            all.setData([...(all.data || []), tag].sort((a, b) => a.name.localeCompare(b.name)))
            add(tag)
        } catch (error) {
            toast.show(error.message, 'danger')
        } finally {
            setCreating(false)
        }
    }

    const options = [...suggestions, ...(canCreate ? [{ create: true }] : [])]

    const onKeyDown = (event) => {
        if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, options.length - 1)) }
        if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
        if (event.key === 'Enter' || event.key === ',') {
            if (!text.trim()) return
            event.preventDefault()
            const option = options[active]
            if (exact && !chosen.has(exact.id)) add(exact)
            else if (option?.create) create()
            else if (option) add(option)
        }
        if (event.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1))
        if (event.key === 'Escape') setOpen(false)
    }

    return (
        <Wrapper>
            <div className="box" onClick={() => inputRef.current?.focus()}>
                {value.map((tag) => (
                    <span key={tag.id} className="chip">
                        {tag.name}
                        <button type="button" onClick={() => onChange(value.filter((item) => item.id !== tag.id))} aria-label={`Remover tag ${tag.name}`}>
                            <X size={12} weight="bold" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    id={id}
                    value={text}
                    onChange={(event) => { setText(event.target.value); setOpen(true); setActive(0) }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 150)}
                    onKeyDown={onKeyDown}
                    placeholder={value.length ? '' : 'Digite para buscar ou criar'}
                    role="combobox"
                    aria-expanded={open && options.length > 0}
                    aria-autocomplete="list"
                    disabled={creating}
                />
            </div>
            {open && options.length > 0 && (
                <ul className="menu" role="listbox">
                    {options.map((option, index) => (
                        <li
                            key={option.create ? 'create' : option.id}
                            role="option"
                            aria-selected={index === active}
                            className={index === active ? 'on' : ''}
                            onMouseDown={(event) => { event.preventDefault(); option.create ? create() : add(option) }}
                            onMouseEnter={() => setActive(index)}
                        >
                            {option.create
                                ? <><Plus size={16} weight="bold" /> Criar tag “{text.trim()}”</>
                                : <><Tag size={16} /> {option.name}</>}
                        </li>
                    ))}
                </ul>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
    .box {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        min-height: 4.6rem;
        padding: 0.6rem;
        border: 0.1rem solid var(--gray-50);
        border-radius: var(--radius);
        background: var(--white);
        cursor: text;
        &:focus-within { border-color: var(--primary); box-shadow: 0 0 0 0.3rem var(--primary-50); }
    }
    input { flex: 1; min-width: 12rem; border: 0; outline: 0; font-size: 1.45rem; padding: 0 0.6rem; background: transparent; }
    .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        height: 3.2rem;
        padding: 0 0.6rem 0 1.2rem;
        border-radius: 2rem;
        background: var(--primary-50);
        color: var(--primary);
        font-size: 1.35rem;
        font-weight: 600;
        button { display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: 50%; color: var(--primary); &:hover { background: var(--primary); color: var(--white); } }
    }
    .menu {
        position: absolute;
        z-index: 10;
        left: 0;
        right: 0;
        top: calc(100% + 0.4rem);
        background: var(--white);
        border-radius: 1rem;
        box-shadow: 0 1.2rem 3.2rem rgba(16, 7, 23, 0.14);
        padding: 0.6rem;
        max-height: 26rem;
        overflow: auto;
        li {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.9rem 1rem;
            border-radius: 0.7rem;
            font-size: 1.4rem;
            color: var(--gray-400);
            cursor: pointer;
            svg { color: var(--primary); }
            &.on { background: var(--primary-50); color: var(--primary); }
        }
    }
`
