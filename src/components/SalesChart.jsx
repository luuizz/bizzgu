import { useState } from 'react'
import styled from 'styled-components'
import { formatBRL } from '../lib/format'

const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })

// Gráfico de barras simples (faturamento por dia) em SVG puro
export function SalesChart({ data }) {
    const [hover, setHover] = useState(null)
    const width = 720
    const height = 220
    const padding = { top: 16, right: 8, bottom: 28, left: 8 }
    const innerW = width - padding.left - padding.right
    const innerH = height - padding.top - padding.bottom

    const max = Math.max(...data.map((d) => Number(d.total)), 1)
    const slot = innerW / data.length
    const barW = Math.max(4, slot * 0.62)
    const total = data.reduce((sum, d) => sum + Number(d.total), 0)
    const active = hover !== null ? data[hover] : null

    return (
        <Wrapper>
            <div className="readout" aria-live="polite">
                {active
                    ? <><strong>{formatBRL(active.total)}</strong><span>{shortDate.format(new Date(active.day))} · {active.orders} {Number(active.orders) === 1 ? 'pedido' : 'pedidos'}</span></>
                    : <><strong>{formatBRL(total)}</strong><span>nos últimos 30 dias</span></>}
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Faturamento diário dos últimos 30 dias" onMouseLeave={() => setHover(null)}>
                <line x1={padding.left} x2={width - padding.right} y1={padding.top + innerH} y2={padding.top + innerH} className="axis" />
                {data.map((d, i) => {
                    const value = Number(d.total)
                    const h = value > 0 ? Math.max(3, (value / max) * innerH) : 0
                    const x = padding.left + i * slot + (slot - barW) / 2
                    const y = padding.top + innerH - h
                    const showLabel = i % 5 === 0 || i === data.length - 1
                    return (
                        <g key={d.day} onMouseEnter={() => setHover(i)}>
                            <rect x={padding.left + i * slot} y={padding.top} width={slot} height={innerH} fill="transparent" />
                            <rect
                                x={x}
                                y={y}
                                width={barW}
                                height={h}
                                rx={Math.min(3, barW / 2)}
                                className={hover === i ? 'bar active' : 'bar'}
                            />
                            {showLabel && (
                                <text x={x + barW / 2} y={height - 8} textAnchor="middle">{shortDate.format(new Date(d.day))}</text>
                            )}
                        </g>
                    )
                })}
            </svg>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    .readout {
        display: flex;
        align-items: baseline;
        gap: 1rem;
        margin-bottom: 1.6rem;
        min-height: 3.4rem;
        strong { font-family: var(--font-red-hat); font-size: 2.8rem; color: var(--gray-800); }
        span { font-size: 1.4rem; color: var(--gray-200); }
    }
    svg { width: 100%; height: auto; display: block; }
    .axis { stroke: var(--gray-50); stroke-width: 1; }
    .bar { fill: var(--primary-100); transition: fill .15s ease; }
    .bar.active { fill: var(--primary); }
    svg:not(:hover) .bar { fill: var(--primary); }
    text { font-size: 11px; fill: var(--gray-200); font-family: 'Inter', sans-serif; }
    @media (max-width: 600px) { text { font-size: 22px; } }
`
