import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { StyleModalLocalization } from './styles'
import { Button, Input } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { lookupCep } from '../../services/cep'
import { maskCep } from '../../lib/format'
import { MapPinArea, X } from '@phosphor-icons/react'

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
                        <X size={24} aria-label="Fechar" />
                    </button>
                </div>
                <div className="content">
                    <span className="map-icon"><MapPinArea size={44} /></span>
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
