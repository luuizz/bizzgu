import { useCallback, useEffect, useRef, useState } from 'react'

// Executa uma função assíncrona e controla carregando/erro/dados.
// Ignora respostas antigas quando as dependências mudam no meio do caminho.
export function useAsync(fn, deps = []) {
    const [state, setState] = useState({ data: null, error: null, loading: true })
    const callId = useRef(0)

    const run = useCallback(async () => {
        const id = ++callId.current
        setState((prev) => ({ ...prev, loading: true, error: null }))
        try {
            const data = await fn()
            if (id === callId.current) setState({ data, error: null, loading: false })
        } catch (error) {
            if (id === callId.current) setState({ data: null, error, loading: false })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    useEffect(() => {
        run()
    }, [run])

    return { ...state, reload: run, setData: (data) => setState((prev) => ({ ...prev, data })) }
}
