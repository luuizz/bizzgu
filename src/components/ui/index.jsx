import { CaretRight, House } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { ORDER_STATUS } from '../../lib/format'

// ---------------------------------------------------------------- Botões
const buttonVariants = {
    primary: css`
        background: var(--primary);
        color: var(--white);
        border-color: var(--primary);
        &:hover:not(:disabled) { background: var(--violet-700); border-color: var(--violet-700); }
    `,
    secondary: css`
        background: transparent;
        color: var(--primary);
        border-color: var(--primary);
        &:hover:not(:disabled) { background: var(--primary); color: var(--white); }
    `,
    ghost: css`
        background: transparent;
        color: var(--gray-400);
        border-color: var(--gray-50);
        &:hover:not(:disabled) { border-color: var(--gray-100); color: var(--gray-800); }
    `,
    danger: css`
        background: transparent;
        color: var(--danger);
        border-color: var(--danger);
        &:hover:not(:disabled) { background: var(--danger); color: var(--white); }
    `,
    dark: css`
        background: var(--gray-500);
        color: var(--white);
        border-color: var(--gray-500);
        &:hover:not(:disabled) { background: var(--primary); border-color: var(--primary); }
    `,
}

const buttonSizes = {
    sm: css`height: 3.6rem; padding: 0 1.4rem; font-size: 1.4rem;`,
    md: css`height: 4.4rem; padding: 0 2.4rem; font-size: 1.5rem;`,
    lg: css`height: 5.6rem; padding: 0 3.2rem; font-size: 1.8rem; border-radius: 1.2rem;`,
}

const buttonBase = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    border: 0.1rem solid transparent;
    border-radius: var(--radius);
    font-family: var(--font-red-hat);
    font-weight: 600;
    white-space: nowrap;
    transition: background .2s ease, color .2s ease, border-color .2s ease;
    ${({ $variant = 'primary' }) => buttonVariants[$variant]}
    ${({ $size = 'md' }) => buttonSizes[$size]}
    ${({ $block }) => $block && css`width: 100%;`}
    &:disabled { opacity: 0.55; cursor: not-allowed; }
`

export const Button = styled.button`${buttonBase}`
export const ButtonLink = styled(Link)`${buttonBase}`

// ---------------------------------------------------------------- Formulário
export const Field = ({ label, error, hint, children, htmlFor }) => (
    <FieldWrapper>
        {label && <label htmlFor={htmlFor}>{label}</label>}
        {children}
        {error ? <small className="error">{error}</small> : hint && <small>{hint}</small>}
    </FieldWrapper>
)

const FieldWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    label {
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--gray-400);
    }
    small {
        font-size: 1.25rem;
        color: var(--gray-200);
        &.error { color: var(--danger); }
    }
`

const control = css`
    width: 100%;
    height: 4.6rem;
    padding: 0 1.4rem;
    border: 0.1rem solid var(--gray-50);
    border-radius: 0.8rem;
    background: var(--white);
    color: var(--gray-700);
    font-size: 1.5rem;
    transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
    &::placeholder { color: var(--gray-100); }
    &:hover:not(:disabled):not(:focus) { border-color: var(--gray-100); }
    &:focus {
        border-color: var(--primary);
        box-shadow: var(--focus-ring);
    }
    &:disabled { background: var(--white-500); color: var(--gray-200); cursor: not-allowed; }
    &[aria-invalid='true'] { border-color: var(--danger); }
    &[aria-invalid='true']:focus { box-shadow: var(--focus-ring-danger); }
`

// Seta própria no select nativo (a do navegador muda de sistema para sistema)
const caret = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="#5f5964" d="M213.7 101.7l-80 80a8 8 0 0 1-11.4 0l-80-80a8 8 0 0 1 11.4-11.4L128 164.7l74.3-74.4a8 8 0 0 1 11.4 11.4Z"/></svg>')

export const Input = styled.input`${control}`
export const Select = styled.select`
    ${control}
    appearance: none;
    padding-right: 4rem;
    background-image: url("data:image/svg+xml,${caret}");
    background-repeat: no-repeat;
    background-position: right 1.4rem center;
    background-size: 1.6rem;
    cursor: pointer;
    text-overflow: ellipsis;
`
export const Textarea = styled.textarea`
    ${control}
    height: auto;
    min-height: 12rem;
    padding: 1.2rem 1.4rem;
    line-height: 1.5;
    resize: vertical;
`

export const Checkbox = ({ label, ...props }) => (
    <CheckboxLabel>
        <input type="checkbox" {...props} />
        <span>{label}</span>
    </CheckboxLabel>
)

const CheckboxLabel = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.5rem;
    color: var(--gray-400);
    cursor: pointer;
    input { width: 1.8rem; height: 1.8rem; accent-color: var(--primary); border-radius: 0.4rem; }
    input:focus-visible { outline: 0.2rem solid var(--primary); outline-offset: 0.2rem; }
`

// ---------------------------------------------------------------- Blocos
export const Card = styled.div`
    background: var(--white);
    border-radius: 1.2rem;
    padding: ${({ $padding = '2.4rem' }) => $padding};
    box-shadow: var(--shadow-sm);
`

export const Alert = styled.div`
    padding: 1.4rem 1.6rem;
    border-radius: 0.8rem;
    font-size: 1.45rem;
    line-height: 1.5;
    ${({ $tone = 'info' }) => css`
        background: var(--${$tone}-50);
        color: var(--${$tone});
    `}
`

export const Badge = styled.span`
    display: inline-flex;
    align-items: center;
    height: 2.6rem;
    padding: 0 1rem;
    border-radius: 2rem;
    font-size: 1.25rem;
    font-weight: 600;
    white-space: nowrap;
    ${({ $tone = 'primary' }) => $tone === 'primary'
        ? css`background: var(--primary-50); color: var(--primary);`
        : css`background: var(--${$tone}-50); color: var(--${$tone});`}
`

export const StatusBadge = ({ status }) => {
    const info = ORDER_STATUS[status] || { label: status, tone: 'primary' }
    return <Badge $tone={info.tone}>{info.label}</Badge>
}

const spin = keyframes`to { transform: rotate(360deg); }`

export const Spinner = styled.span`
    display: inline-block;
    width: ${({ $size = 2 }) => $size}rem;
    height: ${({ $size = 2 }) => $size}rem;
    border: 0.25rem solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ${spin} 0.7s linear infinite;
`

export const Loader = ({ label = 'Carregando...', fullScreen = false }) => (
    <LoaderWrapper role="status" $full={fullScreen}>
        <Spinner $size={3} />
        <span>{label}</span>
    </LoaderWrapper>
)

const LoaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    padding: 6rem 0;
    min-height: ${({ $full }) => ($full ? '100vh' : 'auto')};
    color: var(--primary);
    span { font-size: 1.5rem; color: var(--gray-300); }
`

export const EmptyState = ({ image, icon: Icon, title, description, action }) => (
    <EmptyWrapper>
        {image && <img src={image} alt="" />}
        {!image && Icon && <span className="icon"><Icon size={40} /></span>}
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        {action}
    </EmptyWrapper>
)

const EmptyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 6rem 1.6rem;
    gap: 1.2rem;
    img { max-width: 24rem; margin-bottom: 1.6rem; }
    .icon {
        display: grid;
        place-items: center;
        width: 8rem;
        height: 8rem;
        border-radius: 50%;
        background: var(--primary-50);
        color: var(--primary);
        margin-bottom: 0.8rem;
    }
    h3 { font-size: 2.4rem; }
    p { font-size: 1.6rem; color: var(--gray-300); max-width: 48rem; margin-bottom: 1.2rem; }
`

export const ErrorState = ({ error, onRetry }) => (
    <EmptyState
        title="Algo deu errado"
        description={error?.message || 'Não foi possível carregar as informações.'}
        action={onRetry && <Button $variant="secondary" onClick={onRetry}>Tentar novamente</Button>}
    />
)

export const SectionTitle = styled.h2`
    font-weight: 500;
    font-size: 3.6rem;
    letter-spacing: -0.05rem;
    display: flex;
    align-items: center;
    gap: 1.3rem;
    &::before {
        content: '';
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background: var(--primary);
        flex-shrink: 0;
    }
    @media (max-width: 600px) { font-size: 2.6rem; }
`

export const PageTitle = styled.h1`
    font-size: 3.2rem;
    letter-spacing: -0.05rem;
    @media (max-width: 600px) { font-size: 2.6rem; }
`

// Breadcrumb: casinha no início, setas entre os níveis e nomes longos cortados.
// $tone="light" para usar sobre fundo escuro (topo das categorias).
export const Breadcrumb = ({ items, $tone }) => (
    <BreadcrumbNav aria-label="Navegação estrutural" $tone={$tone}>
        <ol>
            {items.map((item, index) => {
                const last = index === items.length - 1
                const content = index === 0 ? <><House size={16} /> <span>{item.label}</span></> : <span>{item.label}</span>
                return (
                    <li key={`${item.label}-${index}`}>
                        {index > 0 && <CaretRight size={12} weight="bold" className="sep" aria-hidden="true" />}
                        {item.to && !last
                            ? <Link to={item.to}>{content}</Link>
                            : <span className="current" aria-current={last ? 'page' : undefined}>{content}</span>}
                    </li>
                )
            })}
        </ol>
    </BreadcrumbNav>
)

const BreadcrumbNav = styled.nav`
    --crumb: ${({ $tone }) => ($tone === 'light' ? 'rgba(255, 255, 255, 0.72)' : 'var(--gray-200)')};
    --crumb-current: ${({ $tone }) => ($tone === 'light' ? 'var(--white)' : 'var(--gray-700)')};
    --crumb-hover-bg: ${({ $tone }) => ($tone === 'light' ? 'rgba(255, 255, 255, 0.12)' : 'var(--primary-50)')};
    --crumb-hover: ${({ $tone }) => ($tone === 'light' ? 'var(--white)' : 'var(--primary)')};
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
    ol { display: flex; align-items: center; gap: 0.2rem; white-space: nowrap; }
    li { display: flex; align-items: center; gap: 0.2rem; font-size: 1.35rem; min-width: 0; }
    .sep { color: var(--crumb); opacity: 0.6; flex-shrink: 0; margin: 0 0.2rem; }
    a, .current {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 0.8rem;
        border-radius: 0.8rem;
        color: var(--crumb);
        transition: background .2s ease, color .2s ease;
        span { overflow: hidden; text-overflow: ellipsis; max-width: 28rem; }
    }
    li:first-child a, li:first-child .current { padding-left: 0; }
    a:hover { background: var(--crumb-hover-bg); color: var(--crumb-hover); padding-left: 0.8rem; }
    .current { color: var(--crumb-current); font-weight: 600; }
    @media (max-width: 600px) { a span, .current span { max-width: 18rem; } }
`

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 1.45rem;
    th {
        text-align: left;
        font-weight: 600;
        color: var(--gray-200);
        font-size: 1.25rem;
        text-transform: uppercase;
        letter-spacing: 0.05rem;
        padding: 1.2rem 1.4rem;
        border-bottom: 0.1rem solid var(--gray-50);
        white-space: nowrap;
    }
    td {
        padding: 1.4rem;
        border-bottom: 0.1rem solid var(--white-500);
        color: var(--gray-400);
        vertical-align: middle;
    }
    tbody tr:hover td { background: var(--white-100); }
    .num { text-align: right; white-space: nowrap; }
    .link { color: var(--primary); font-weight: 600; }
    .stack {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        span { color: var(--gray-700); }
        small { font-size: 1.25rem; color: var(--gray-200); }
    }
`

export const TableScroll = styled.div`
    overflow-x: auto;
    margin: 0 -2.4rem;
    padding: 0 2.4rem;
`

