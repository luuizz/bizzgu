import { StyleBtnPrimary } from './style'

export function BtnPrimary({txt, url}) {
    return <StyleBtnPrimary className="btn-primary" src={url}>{txt}</StyleBtnPrimary>
}