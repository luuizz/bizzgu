import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Page } from '../components/layout'
import { OrderSummary } from '../components/OrderSummary'
import { ProductImage } from '../components/product/ProductImage'
import { Alert, Button, Card, Field, Input, PageTitle, Select, Spinner } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { createOrder } from '../services/orders'
import { getProducts } from '../services/catalog'
import { lookupCep } from '../services/cep'
import { BR_STATES, PAYMENT_METHODS, formatBRL, maskCep, maskPhone, onlyDigits } from '../lib/format'

const paymentHints = {
    pix: 'Aprovação imediata após o pagamento.',
    credit_card: 'Em até 10x sem juros.',
    boleto: 'Compensação em até 2 dias úteis.',
}

export function Checkout() {
    useDocumentTitle('Finalizar compra')
    const { user, profile } = useAuth()
    const cart = useCart()
    const navigate = useNavigate()
    const placed = useRef(false)

    const [form, setForm] = useState({
        name: profile?.full_name || '',
        email: user.email,
        phone: profile?.phone ? maskPhone(profile.phone) : '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: '',
    })
    const [payment, setPayment] = useState('pix')
    const [errors, setErrors] = useState({})
    const [cepStatus, setCepStatus] = useState({ loading: false, message: '' })
    const [submitting, setSubmitting] = useState(false)
    const [serverError, setServerError] = useState('')
    const numberRef = useRef(null)

    if (cart.items.length === 0 && !placed.current) return <Navigate to="/carrinho-compras" replace />

    const set = (field) => (event) => {
        let value = event.target.value
        if (field === 'cep') value = maskCep(value)
        if (field === 'phone') value = maskPhone(value)
        setForm((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
        if (field === 'cep' && value.length === 9) fillAddress(value)
    }

    const fillAddress = async (cep) => {
        setCepStatus({ loading: true, message: '' })
        try {
            const address = await lookupCep(cep)
            setForm((prev) => ({
                ...prev,
                street: address.street || prev.street,
                district: address.district || prev.district,
                city: address.city,
                state: address.state,
            }))
            setCepStatus({ loading: false, message: '' })
            numberRef.current?.focus()
        } catch (error) {
            setCepStatus({ loading: false, message: error.message })
        }
    }

    const validate = () => {
        const next = {}
        if (form.name.trim().split(' ').length < 2) next.name = 'Informe nome e sobrenome.'
        if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'E-mail inválido.'
        if (onlyDigits(form.phone).length < 10) next.phone = 'Telefone com DDD.'
        if (onlyDigits(form.cep).length !== 8) next.cep = 'CEP inválido.'
        ;['street', 'number', 'district', 'city'].forEach((field) => {
            if (!form[field].trim()) next[field] = 'Obrigatório.'
        })
        if (!form.state) next.state = 'Selecione.'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setServerError('')
        if (!validate()) return

        setSubmitting(true)
        try {
            const orderId = await createOrder({
                items: cart.items,
                customer: { name: form.name.trim(), email: form.email.trim(), phone: onlyDigits(form.phone) },
                address: {
                    cep: onlyDigits(form.cep),
                    street: form.street.trim(),
                    number: form.number.trim(),
                    complement: form.complement.trim(),
                    district: form.district.trim(),
                    city: form.city.trim(),
                    state: form.state,
                },
                paymentMethod: payment,
            })
            placed.current = true
            navigate(`/minha-conta/pedidos/${orderId}?novo=1`, { replace: true })
            cart.clear()
        } catch (error) {
            setServerError(error.message)
            // Estoque ou preço mudou: atualiza o carrinho para o cliente revisar
            getProducts({ ids: cart.items.map((item) => item.id) })
                .then((products) => cart.syncWithCatalog(products))
                .catch(() => {})
            setSubmitting(false)
        }
    }

    return (
        <Page>
            <div className="container">
                <div className="page-head">
                    <PageTitle>Finalizar compra</PageTitle>
                </div>

                <Form onSubmit={handleSubmit} noValidate>
                    <div className="steps">
                        <Card>
                            <h2><span>1</span> Seus dados</h2>
                            <div className="grid">
                                <div className="span-2">
                                    <Field label="Nome completo" htmlFor="name" error={errors.name}>
                                        <Input id="name" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} />
                                    </Field>
                                </div>
                                <Field label="E-mail" htmlFor="email" error={errors.email}>
                                    <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} />
                                </Field>
                                <Field label="Telefone" htmlFor="phone" error={errors.phone}>
                                    <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 99999-9999" value={form.phone} onChange={set('phone')} aria-invalid={!!errors.phone} />
                                </Field>
                            </div>
                        </Card>

                        <Card>
                            <h2><span>2</span> Endereço de entrega</h2>
                            <div className="grid">
                                <Field label="CEP" htmlFor="cep" error={errors.cep || cepStatus.message}>
                                    <div className="with-spinner">
                                        <Input id="cep" inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={form.cep} onChange={set('cep')} aria-invalid={!!errors.cep} />
                                        {cepStatus.loading && <Spinner $size={1.8} />}
                                    </div>
                                </Field>
                                <div className="cep-help">
                                    <a href="https://buscacepinter.correios.com.br/" target="_blank" rel="noreferrer">Não sei meu CEP</a>
                                </div>
                                <div className="span-2">
                                    <Field label="Rua / Avenida" htmlFor="street" error={errors.street}>
                                        <Input id="street" autoComplete="address-line1" value={form.street} onChange={set('street')} aria-invalid={!!errors.street} />
                                    </Field>
                                </div>
                                <Field label="Número" htmlFor="number" error={errors.number}>
                                    <Input id="number" ref={numberRef} value={form.number} onChange={set('number')} aria-invalid={!!errors.number} />
                                </Field>
                                <Field label="Complemento" htmlFor="complement" hint="Opcional">
                                    <Input id="complement" autoComplete="address-line2" value={form.complement} onChange={set('complement')} />
                                </Field>
                                <div className="span-2">
                                    <Field label="Bairro" htmlFor="district" error={errors.district}>
                                        <Input id="district" value={form.district} onChange={set('district')} aria-invalid={!!errors.district} />
                                    </Field>
                                </div>
                                <Field label="Cidade" htmlFor="city" error={errors.city}>
                                    <Input id="city" autoComplete="address-level2" value={form.city} onChange={set('city')} aria-invalid={!!errors.city} />
                                </Field>
                                <Field label="Estado" htmlFor="state" error={errors.state}>
                                    <Select id="state" value={form.state} onChange={set('state')} aria-invalid={!!errors.state}>
                                        <option value="">UF</option>
                                        {BR_STATES.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                                    </Select>
                                </Field>
                            </div>
                        </Card>

                        <Card>
                            <h2><span>3</span> Pagamento</h2>
                            <div className="payments" role="radiogroup" aria-label="Forma de pagamento">
                                {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                                    <label key={key} className={payment === key ? 'selected' : ''}>
                                        <input type="radio" name="payment" value={key} checked={payment === key} onChange={() => setPayment(key)} />
                                        <strong>{label}</strong>
                                        <span>{paymentHints[key]}</span>
                                    </label>
                                ))}
                            </div>
                            <Alert $tone="info" style={{ marginTop: '1.6rem' }}>
                                Este é um projeto de demonstração: nenhuma cobrança real é feita. Depois de confirmar, você poderá simular o pagamento na página do pedido.
                            </Alert>
                        </Card>
                    </div>

                    <OrderSummary subtotal={cart.subtotal} shipping={cart.shipping} total={cart.total} count={cart.count} showFreeShippingHint={false}>
                        <ul className="mini-items">
                            {cart.items.map((item) => (
                                <li key={item.id}>
                                    <div className="thumb"><ProductImage src={item.image} alt={item.name} /></div>
                                    <span>{item.quantity}× {item.name}</span>
                                    <strong>{formatBRL(item.price * item.quantity)}</strong>
                                </li>
                            ))}
                        </ul>
                        {serverError && <Alert $tone="danger">{serverError}</Alert>}
                        <Button type="submit" $size="lg" $block disabled={submitting}>
                            {submitting ? <><Spinner /> Processando...</> : 'Confirmar pedido'}
                        </Button>
                    </OrderSummary>
                </Form>
            </div>
        </Page>
    )
}

const Form = styled.form`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 38rem;
    gap: 3.2rem;
    align-items: start;
    .steps { display: flex; flex-direction: column; gap: 2.4rem; }
    h2 {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        font-size: 2rem;
        margin-bottom: 2.4rem;
        span {
            width: 3.2rem;
            height: 3.2rem;
            border-radius: 50%;
            background: var(--primary);
            color: var(--white);
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.6rem; }
    .span-2 { grid-column: span 2; }
    .with-spinner { position: relative; > span { position: absolute; right: 1.4rem; top: 1.4rem; color: var(--primary); } }
    .cep-help { display: flex; align-items: flex-end; padding-bottom: 1.4rem; a { font-size: 1.4rem; color: var(--primary); } }
    .payments {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.2rem;
        label {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            padding: 1.6rem;
            border: 0.15rem solid var(--gray-50);
            border-radius: 1rem;
            cursor: pointer;
            transition: border-color .2s ease, background .2s ease;
            &.selected { border-color: var(--primary); background: var(--primary-50); }
            &:focus-within { outline: 0.2rem solid var(--primary); outline-offset: 0.2rem; }
            input { position: absolute; opacity: 0; pointer-events: none; }
            strong { font-family: var(--font-red-hat); font-size: 1.6rem; color: var(--gray-800); }
            span { font-size: 1.3rem; color: var(--gray-300); }
        }
    }
    .mini-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 24rem;
        overflow-y: auto;
        border-bottom: 0.1rem solid var(--gray-50);
        padding-bottom: 1.6rem;
        li { display: grid; grid-template-columns: 4.4rem 1fr auto; gap: 1rem; align-items: center; font-size: 1.35rem; color: var(--gray-400); }
        .thumb { width: 4.4rem; height: 4.4rem; background: var(--white-600); border-radius: 0.6rem; padding: 0.3rem; }
        strong { color: var(--gray-700); white-space: nowrap; }
    }
    @media (max-width: 960px) { grid-template-columns: 1fr; }
    @media (max-width: 600px) {
        .grid { grid-template-columns: 1fr; }
        .span-2 { grid-column: auto; }
        .cep-help { padding-bottom: 0; }
        .payments { grid-template-columns: 1fr; }
    }
`
