import {StyleButtonContact} from './style'

export function ButtonContact({title, txt}) {
    return (
        <StyleButtonContact>
            <strong>{title}</strong>
            <span>{txt}</span>
        </StyleButtonContact>
    )
}