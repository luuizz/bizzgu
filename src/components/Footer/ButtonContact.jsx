import { StyleButtonContact } from './style'

export function ButtonContact({ title, txt, href }) {
    return (
        <StyleButtonContact as="a" href={href}>
            <strong>{title}</strong>
            <span>{txt}</span>
        </StyleButtonContact>
    )
}
