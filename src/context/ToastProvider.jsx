import { useMemo } from 'react'
import { Toaster, toast } from 'sonner'
import { createGlobalStyle } from 'styled-components'
import { CheckCircle, Info, WarningCircle, XCircle } from '@phosphor-icons/react'
import { ToastContext } from './contexts'

// Avisos com Sonner. A API continua a mesma: toast.show(mensagem, tom, duração)
// tom: 'success' | 'danger' | 'info' | 'warning' | 'neutral'
const byTone = {
    success: toast.success,
    danger: toast.error,
    info: toast.info,
    warning: toast.warning,
    neutral: toast,
}

const icons = {
    success: <CheckCircle size={22} weight="fill" />,
    error: <XCircle size={22} weight="fill" />,
    info: <Info size={22} weight="fill" />,
    warning: <WarningCircle size={22} weight="fill" />,
}

export function ToastProvider({ children }) {
    const value = useMemo(() => ({
        show: (message, tone = 'neutral', duration = 4000) => (byTone[tone] || toast)(message, { duration }),
        promise: toast.promise,
        dismiss: toast.dismiss,
    }), [])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastStyles />
            <Toaster
                position="bottom-right"
                icons={icons}
                closeButton
                gap={10}
                offset={24}
                mobileOffset={16}
                visibleToasts={4}
                toastOptions={{ className: 'bz-toast' }}
                containerAriaLabel="Avisos"
            />
        </ToastContext.Provider>
    )
}

// Visual dos avisos no padrão da loja (fundo claro, barra colorida por tom)
const ToastStyles = createGlobalStyle`
    [data-sonner-toaster] {
        --width: 38rem;
        font-family: 'Inter', sans-serif;
    }
    [data-sonner-toast].bz-toast {
        --tone: var(--gray-400);
        align-items: flex-start;
        gap: 1.2rem;
        padding: 1.4rem 4rem 1.4rem 1.8rem;
        border-radius: 1.2rem;
        border: 0.1rem solid var(--white-500);
        background: var(--white);
        color: var(--gray-700);
        font-size: 1.45rem;
        line-height: 1.45;
        box-shadow: 0 1.6rem 4rem rgba(16, 7, 23, 0.14), 0 0.2rem 0.6rem rgba(16, 7, 23, 0.06);
        overflow: hidden;
        &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 0.4rem;
            background: var(--tone);
        }
        &[data-type='success'] { --tone: var(--success); }
        &[data-type='error'] { --tone: var(--danger); }
        &[data-type='info'] { --tone: var(--primary); }
        &[data-type='warning'] { --tone: var(--warning); }
        [data-icon] { color: var(--tone); width: 2.2rem; height: 2.2rem; margin: 0; flex-shrink: 0; }
        [data-icon] svg { width: 2.2rem; height: 2.2rem; margin: 0; }
        [data-title] { font-weight: 500; }
        [data-close-button] {
            left: auto;
            right: 1rem;
            top: 1.2rem;
            transform: none;
            width: 2.2rem;
            height: 2.2rem;
            background: transparent;
            border: 0;
            color: var(--gray-200);
            opacity: 0;
            transition: opacity .15s ease;
        }
        &:hover [data-close-button], [data-close-button]:focus-visible { opacity: 1; }
        [data-close-button]:hover { background: var(--white-600); color: var(--gray-700); }
    }
`
