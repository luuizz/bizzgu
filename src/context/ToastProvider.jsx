import { useCallback, useMemo, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { ToastContext } from './contexts'

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const nextId = useRef(0)

    const dismiss = useCallback((id) => setToasts((prev) => prev.filter((toast) => toast.id !== id)), [])

    const show = useCallback((message, tone = 'neutral', duration = 3500) => {
        const id = ++nextId.current
        setToasts((prev) => [...prev.slice(-3), { id, message, tone }])
        setTimeout(() => dismiss(id), duration)
    }, [dismiss])

    const value = useMemo(() => ({ show }), [show])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastStack role="status" aria-live="polite">
                {toasts.map((toast) => (
                    <Toast key={toast.id} $tone={toast.tone} onClick={() => dismiss(toast.id)}>
                        {toast.message}
                    </Toast>
                ))}
            </ToastStack>
        </ToastContext.Provider>
    )
}

const slideIn = keyframes`
    from { opacity: 0; transform: translateY(1rem); }
    to { opacity: 1; transform: none; }
`

const tones = {
    neutral: 'var(--gray-500)',
    success: 'var(--success)',
    danger: 'var(--danger)',
    info: 'var(--primary)',
}

const ToastStack = styled.div`
    position: fixed;
    right: 2.4rem;
    bottom: 2.4rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 100;
    max-width: calc(100vw - 3.2rem);
    @media (max-width: 600px) {
        right: 1.6rem;
        left: 1.6rem;
        bottom: 1.6rem;
    }
`

const Toast = styled.div`
    background: ${({ $tone }) => tones[$tone] || tones.neutral};
    color: var(--white);
    font-size: 1.5rem;
    line-height: 1.4;
    padding: 1.4rem 2rem;
    border-radius: 1rem;
    box-shadow: 0 1rem 3rem rgba(16, 7, 23, 0.25);
    max-width: 40rem;
    cursor: pointer;
    animation: ${slideIn} 0.25s ease;
`
