import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { formatBRL } from '../lib/format'

const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
const HEIGHT = 132

// Largura real do gráfico: desenha na escala da tela, com altura fixa e discreta
function useWidth() {
    const ref = useRef(null)
    const [width, setWidth] = useState(0)
    useEffect(() => {
        if (!ref.current) return undefined
        const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])
    return [ref, width]
}

// Gráfico de barras simples (faturamento por dia) em SVG puro
export function SalesChart({ title, data }) {
    const [hover, setHover] = useState(null)
    const [boxRef, width] = useWidth()
    const padding = { top: 8, right: 0, bottom: 22, left: 0 }
    const innerW = Math.max(width - padding.left - padding.right, 1)
    const innerH = HEIGHT - padding.top - padding.bottom

    const max = Math.max(...data.map((d) => Number(d.total)), 1)
    const slot = innerW / data.length
    const barW = Math.min(14, Math.max(3, slot * 0.5))
    const total = data.reduce((sum, d) => sum + Number(d.total), 0)
    const orders = data.reduce((sum, d) => sum + Number(d.orders), 0)
    const active = hover !== null ? data[hover] : null
    const labelEvery = width < 520 ? 10 : 5

    return (
        <Wrapper>
            <div className="head">
                {title && <h2>{title}</h2>}
                <div className="readout" aria-live="polite">
                    {active
                        ? <><strong>{formatBRL(active.total)}</strong><span>{shortDate.format(new Date(active.day))} · {active.orders} {Number(active.orders) === 1 ? 'pedido' : 'pedidos'}</span></>
                        : <><strong>{formatBRL(total)}</strong><span>{orders} {orders === 1 ? 'pedido' : 'pedidos'} no período</span></>}
                </div>
            </div>
            <div className="plot" ref={boxRef}>
                {width > 0 && (
                    <svg width={width} height={HEIGHT} role="img" aria-label="Faturamento diário dos últimos 30 dias" onMouseLeave={() => setHover(null)}>
                        {[0.5, 1].map((step) => (
                            <line key={step} x1={0} x2={width} y1={padding.top + innerH * (1 - step)} y2={padding.top + innerH * (1 - step)} className="grid" />
                        ))}
                        <line x1={0} x2={width} y1={padding.top + innerH} y2={padding.top + innerH} className="axis" />
                        {data.map((d, i) => {
                            const value = Number(d.total)
                            const h = value > 0 ? Math.max(3, (value / max) * innerH) : 0
                            const x = padding.left + i * slot + (slot - barW) / 2
                            const y = padding.top + innerH - h
                            const showLabel = i % labelEvery === 0 || i === data.length - 1
                            return (
                                <g key={d.day} onMouseEnter={() => setHover(i)}>
                                    <rect x={padding.left + i * slot} y={padding.top} width={slot} height={innerH} fill="transparent" />
                                    {value === 0 && <rect x={x} y={padding.top + innerH - 2} width={barW} height={2} rx={1} className="zero" />}
                                    {value > 0 && <rect x={x} y={y} width={barW} height={h} rx={Math.min(3, barW / 2)} className={hover === i ? 'bar active' : 'bar'} />}
                                    {showLabel && (
                                        <text x={Math.min(Math.max(x + barW / 2, 16), width - 16)} y={HEIGHT - 4} textAnchor="middle">{shortDate.format(new Date(d.day))}</text>
                                    )}
                                </g>
                            )
                        })}
                    </svg>
                )}
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    .head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.8rem 2rem;
        flex-wrap: wrap;
        margin-bottom: 1.6rem;
    }
    h2 { font-size: 1.7rem; }
    .readout {
        display: flex;
        align-items: baseline;
        gap: 0.8rem;
        strong { font-family: var(--font-red-hat); font-size: 2rem; color: var(--gray-800); }
        span { font-size: 1.3rem; color: var(--gray-200); }
    }
    .plot { height: ${HEIGHT}px; }
    svg { display: block; overflow: visible; }
    .grid { stroke: var(--white-500); stroke-width: 1; stroke-dasharray: 3 4; }
    .axis { stroke: var(--gray-50); stroke-width: 1; }
    .zero { fill: var(--white-500); }
    .bar { fill: var(--primary-100); transition: fill .15s ease; }
    .bar.active { fill: var(--primary); }
    svg:not(:hover) .bar { fill: rgba(105, 60, 234, 0.7); }
    text { font-size: 11px; fill: var(--gray-200); font-family: 'Inter', sans-serif; }
`
