import { useEffect, useId, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { AnimatePresence, m } from 'motion/react'
import { CaretDown, Check, MagnifyingGlass, Plus, X } from '@phosphor-icons/react'

const normalize = (text) => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const popMotion = {
    initial: { opacity: 0, y: -6, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -4, scale: 0.98 },
    transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
}

/**
 * Seleção múltipla com busca.
 *
 * mode="filter": botão compacto para barras de filtro ("Categorias · 2").
 * mode="chips":  campo de formulário com as escolhas em chips e busca digitando.
 *
 * options: [{ value, label, icon?, hint? }]   value: array de values
 * onCreate(texto): opcional; mostra "Criar …" quando nada bate exatamente.
 * Quem cria fica responsável por incluir o novo item na seleção.
 */
export function MultiSelect({
    id,
    options,
    value,
    onChange,
    mode = 'chips',
    placeholder = 'Selecionar',
    label,
    icon: Icon,
    onCreate,
    createLabel = (text) => `Criar “${text}”`,
    emptyText = 'Nada encontrado',
    searchPlaceholder = 'Buscar...',
}) {
    const listId = useId()
    const rootRef = useRef(null)
    const inputRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const [active, setActive] = useState(0)
    const [creating, setCreating] = useState(false)

    const selected = useMemo(() => new Set(value.map(String)), [value])
    const term = normalize(text)
    const filtered = useMemo(() => options.filter((option) => !term || normalize(option.label).includes(term)), [options, term])
    const exact = options.find((option) => normalize(option.label) === term)
    const items = [...filtered, ...(onCreate && term && !exact ? [{ create: true, label: text.trim() }] : [])]
    const chosen = options.filter((option) => selected.has(String(option.value)))

    // Fecha ao clicar fora
    useEffect(() => {
        if (!open) return
        const onDown = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                setOpen(false)
                if (mode === 'filter') setText('')
            }
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [open, mode])

    useEffect(() => { if (active >= items.length) setActive(Math.max(0, items.length - 1)) }, [items.length, active])

    function close() {
        setOpen(false)
        if (mode === 'filter') setText('')
    }

    const toggle = (option) => {
        const key = String(option.value)
        onChange(selected.has(key) ? value.filter((item) => String(item) !== key) : [...value, option.value])
        if (mode === 'chips') setText('')
        inputRef.current?.focus()
    }

    const create = async () => {
        const name = text.trim().replace(/,$/, '')
        if (!name || creating) return
        setCreating(true)
        try {
            await onCreate(name)
            setText('')
        } finally {
            setCreating(false)
            inputRef.current?.focus()
        }
    }

    const choose = (item) => (item.create ? create() : toggle(item))

    const onKeyDown = (event) => {
        if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, items.length - 1)) }
        else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
        else if (event.key === 'Enter' || (event.key === ',' && onCreate)) {
            if (mode === 'chips' && !text.trim()) return
            event.preventDefault()
            if (exact && mode === 'chips' && !selected.has(String(exact.value))) toggle(exact)
            else if (items[active]) choose(items[active])
        }
        else if (event.key === 'Backspace' && !text && mode === 'chips' && value.length) onChange(value.slice(0, -1))
        else if (event.key === 'Escape') { event.stopPropagation(); close() }
        else if (event.key === 'Tab') close()
    }

    // Uma escolha: mostra o nome. Várias: o nome do filtro + a quantidade no selo
    const summary = chosen.length === 1 ? chosen[0].label : placeholder

    const list = (
        <ul className="list" id={listId} role="listbox" aria-multiselectable="true" aria-label={label}>
            {items.length === 0 && <li className="empty">{emptyText}</li>}
            {items.map((item, index) => {
                const isOn = !item.create && selected.has(String(item.value))
                const ItemIcon = item.icon
                return (
                    <li
                        key={item.create ? '__create' : item.value}
                        id={`${listId}-${index}`}
                        role="option"
                        aria-selected={isOn}
                        className={`${index === active ? 'active' : ''} ${item.create ? 'create' : ''}`}
                        onMouseDown={(event) => { event.preventDefault(); choose(item) }}
                        onMouseEnter={() => setActive(index)}
                    >
                        {item.create ? (
                            <><span className="box add"><Plus size={12} weight="bold" /></span> {createLabel(item.label)}</>
                        ) : (
                            <>
                                <span className={`box ${isOn ? 'on' : ''}`} aria-hidden="true">{isOn && <Check size={12} weight="bold" />}</span>
                                {ItemIcon && <ItemIcon size={18} className="ico" />}
                                <span className="text">{item.label}</span>
                                {item.hint != null && <span className="hint">{item.hint}</span>}
                            </>
                        )}
                    </li>
                )
            })}
        </ul>
    )

    const comboProps = {
        role: 'combobox',
        'aria-expanded': open,
        'aria-controls': listId,
        'aria-autocomplete': 'list',
        'aria-activedescendant': open && items[active] ? `${listId}-${active}` : undefined,
        onKeyDown,
    }

    if (mode === 'filter') {
        return (
            <Root ref={rootRef} className="ms-filter">
                <button
                    id={id}
                    type="button"
                    className={`trigger ${chosen.length ? 'has' : ''} ${open ? 'open' : ''}`}
                    onClick={() => { setOpen((current) => !current); setActive(0) }}
                    onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true) } }}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-label={label}
                >
                    {Icon && <Icon size={18} className="lead" />}
                    <span className="summary">{summary}</span>
                    {chosen.length > 1 && <span className="count">{chosen.length}</span>}
                    <CaretDown size={14} weight="bold" className="caret" />
                </button>
                {chosen.length > 0 && (
                    <button type="button" className="clear" onClick={() => onChange([])} aria-label={`Limpar ${label || 'seleção'}`} title="Limpar">
                        <X size={12} weight="bold" />
                    </button>
                )}
                <AnimatePresence>
                    {open && (
                        <m.div className="pop" {...popMotion}>
                            <label className="search">
                                <MagnifyingGlass size={16} />
                                <input
                                    ref={inputRef}
                                    autoFocus
                                    value={text}
                                    onChange={(event) => { setText(event.target.value); setActive(0) }}
                                    placeholder={searchPlaceholder}
                                    aria-label={`Buscar em ${label || 'opções'}`}
                                    {...comboProps}
                                />
                            </label>
                            {list}
                            <div className="foot">
                                <span>{chosen.length ? `${chosen.length} selecionad${chosen.length === 1 ? 'o' : 'os'}` : 'Nenhum filtro'}</span>
                                {chosen.length > 0 && <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => onChange([])}>Limpar</button>}
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </Root>
        )
    }

    return (
        <Root ref={rootRef} className="ms-chips">
            <div className={`field ${open ? 'open' : ''}`} onMouseDown={(event) => { if (event.target === event.currentTarget) { event.preventDefault(); inputRef.current?.focus(); setOpen(true) } }}>
                <AnimatePresence initial={false}>
                    {chosen.map((option) => (
                        <m.span
                            key={option.value}
                            className="chip"
                            layout
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.14 }}
                        >
                            {option.label}
                            <button type="button" onClick={() => toggle(option)} aria-label={`Remover ${option.label}`}>
                                <X size={11} weight="bold" />
                            </button>
                        </m.span>
                    ))}
                </AnimatePresence>
                <input
                    ref={inputRef}
                    id={id}
                    value={text}
                    onChange={(event) => { setText(event.target.value); setOpen(true); setActive(0) }}
                    onFocus={() => setOpen(true)}
                    placeholder={chosen.length ? '' : placeholder}
                    aria-label={label}
                    disabled={creating}
                    {...comboProps}
                />
                <CaretDown size={14} weight="bold" className="caret" onMouseDown={(event) => { event.preventDefault(); inputRef.current?.focus(); setOpen((current) => !current) }} />
            </div>
            <AnimatePresence>
                {open && <m.div className="pop" {...popMotion}>{list}</m.div>}
            </AnimatePresence>
        </Root>
    )
}

const Root = styled.div`
    position: relative;
    min-width: 0;

    /* ---------- botão de filtro */
    &.ms-filter { display: inline-flex; }
    .trigger {
        display: inline-flex;
        align-items: center;
        gap: 0.8rem;
        height: 4.2rem;
        max-width: 26rem;
        padding: 0 1.2rem 0 1.4rem;
        border: 0.1rem solid var(--gray-50);
        border-radius: 0.8rem;
        background: var(--white);
        color: var(--gray-300);
        font-size: 1.45rem;
        transition: border-color .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease;
        &:hover { border-color: var(--gray-100); }
        &:focus-visible, &.open { outline: 0; border-color: var(--primary); box-shadow: var(--focus-ring); }
        &.has { background: var(--primary-50); border-color: var(--primary-100); color: var(--primary); font-weight: 600; padding-right: 3.6rem; }
        .lead { flex-shrink: 0; }
        .summary { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .count {
            min-width: 2rem;
            height: 2rem;
            padding: 0 0.5rem;
            border-radius: 1rem;
            background: var(--primary);
            color: var(--white);
            font-size: 1.15rem;
            font-weight: 700;
            display: grid;
            place-items: center;
        }
        .caret { flex-shrink: 0; transition: transform .2s ease; }
        &.open .caret { transform: rotate(180deg); }
        &.has .caret { display: none; }
    }
    .clear {
        position: absolute;
        right: 0.9rem;
        top: 50%;
        transform: translateY(-50%);
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: var(--primary);
        &:hover { background: var(--primary); color: var(--white); }
    }

    /* ---------- campo com chips */
    .field {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.6rem;
        min-height: 4.6rem;
        padding: 0.6rem 3.6rem 0.6rem 0.6rem;
        border: 0.1rem solid var(--gray-50);
        border-radius: 0.8rem;
        background: var(--white);
        cursor: text;
        position: relative;
        transition: border-color .18s ease, box-shadow .18s ease;
        &:hover:not(:focus-within) { border-color: var(--gray-100); }
        &:focus-within { border-color: var(--primary); box-shadow: var(--focus-ring); }
        input { flex: 1; min-width: 12rem; height: 3.2rem; border: 0; font-size: 1.45rem; padding: 0 0.8rem; background: transparent; color: var(--gray-700); }
        input::placeholder { color: var(--gray-100); }
        .caret { position: absolute; right: 1.4rem; top: 50%; transform: translateY(-50%); color: var(--gray-200); cursor: pointer; transition: transform .2s ease; }
        &.open .caret { transform: translateY(-50%) rotate(180deg); }
    }
    .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        height: 3.2rem;
        padding: 0 0.5rem 0 1.2rem;
        border-radius: 2rem;
        background: var(--primary-50);
        color: var(--primary);
        font-size: 1.35rem;
        font-weight: 600;
        button { display: grid; place-items: center; width: 2.2rem; height: 2.2rem; border-radius: 50%; color: var(--primary); transition: background .15s ease, color .15s ease; &:hover { background: var(--primary); color: var(--white); } }
    }

    /* ---------- lista */
    .pop {
        position: absolute;
        z-index: 20;
        left: 0;
        top: calc(100% + 0.6rem);
        min-width: 100%;
        width: max-content;
        max-width: min(32rem, calc(100vw - 3.2rem));
        background: var(--white);
        border: 0.1rem solid var(--white-500);
        border-radius: 1.2rem;
        box-shadow: 0 1.6rem 4rem rgba(16, 7, 23, 0.16);
        padding: 0.6rem;
        transform-origin: top left;
    }
    &.ms-chips .pop { width: 100%; max-width: none; }
    .search {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 0 1rem;
        margin-bottom: 0.4rem;
        height: 4rem;
        border-radius: 0.8rem;
        background: var(--white-600);
        color: var(--gray-200);
        input { flex: 1; min-width: 0; border: 0; background: transparent; font-size: 1.4rem; color: var(--gray-700); }
    }
    .list { max-height: 28rem; overflow-y: auto; overscroll-behavior: contain; }
    .list li {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.9rem 1rem;
        border-radius: 0.8rem;
        font-size: 1.4rem;
        color: var(--gray-400);
        cursor: pointer;
        user-select: none;
        &.active { background: var(--white-600); color: var(--gray-800); }
        &[aria-selected='true'] { color: var(--primary); font-weight: 600; }
        &.create { color: var(--primary); font-weight: 600; }
        &.empty { color: var(--gray-200); cursor: default; justify-content: center; padding: 1.6rem; }
        .ico { color: var(--gray-200); flex-shrink: 0; }
        &[aria-selected='true'] .ico { color: var(--primary); }
        .text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .hint { font-size: 1.2rem; color: var(--gray-200); font-weight: 500; }
    }
    .box {
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 0.5rem;
        border: 0.15rem solid var(--gray-100);
        display: grid;
        place-items: center;
        flex-shrink: 0;
        color: var(--white);
        transition: background .15s ease, border-color .15s ease;
        &.on, &.add { background: var(--primary); border-color: var(--primary); }
    }
    .foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.2rem;
        margin-top: 0.4rem;
        padding: 0.8rem 1rem 0.4rem;
        border-top: 0.1rem solid var(--white-500);
        font-size: 1.25rem;
        color: var(--gray-200);
        button { font-size: 1.3rem; font-weight: 600; color: var(--primary); &:hover { text-decoration: underline; } }
    }
`
