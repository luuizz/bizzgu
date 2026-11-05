import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { StyleModalLocalization } from './styles'
import { Button, Input } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { lookupCep } from '../../services/cep'
import { maskCep } from '../../lib/format'
import IconMap from '/src/assets/icon-local-modal.svg'
import IconClose from '/src/assets/icon-close.svg'

export function ModalLocalization({ closeModal, onConfirm }) {
    const { user } = useAuth()
    const [cep, setCep] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current?.focus()
        const onKey = (event) => event.key === 'Escape' && closeModal()
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [closeModal])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)
        try {
            const address = await lookupCep(cep)
            onConfirm({ cep: maskCep(cep), city: address.city, state: address.state })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <StyleModalLocalization className="overlay" onClick={(event) => event.target === event.currentTarget && closeModal()}>
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-localizacao">
                <div className="top">
                    <button type="button" onClick={closeModal} title="Fechar">
                        <img src={IconClose} alt="Fechar" />
                    </button>
                </div>
                <div className="content">
                    <img src={IconMap} alt="" />
                    <h3 id="titulo-localizacao">Qual a sua localização?</h3>
                    <p>Informe seu CEP para ver as condições de entrega da sua região.</p>
                    <form onSubmit={handleSubmit}>
                        <Input
                            ref={inputRef}
                            inputMode="numeric"
                            placeholder="00000-000"
                            aria-label="CEP"
                            value={cep}
                            onChange={(event) => setCep(maskCep(event.target.value))}
                            aria-invalid={Boolean(error)}
                        />
                        <Button type="submit" disabled={loading || cep.length < 9}>
                            {loading ? 'Buscando...' : 'Confirmar'}
                        </Button>
                    </form>
                    {error && <small className="error">{error}</small>}
                </div>
                {!user && (
                    <div className="bottom">
                        <span>Ou</span>
                        <Link to="/login" onClick={closeModal}>Fazer login</Link>
                    </div>
                )}
            </div>
        </StyleModalLocalization>
    )
}
