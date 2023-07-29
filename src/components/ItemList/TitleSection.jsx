import { StyleTitleSection } from './styles'
import DetailTitle from '/src/assets/pointer-title.svg'

export function TitleSection({title}) {
    return (
        <>
            <StyleTitleSection className="title">
                <img src={DetailTitle} alt="Imagem de um quadrado" />
                <h2>{title}</h2>
            </StyleTitleSection>
        </>
    )
}