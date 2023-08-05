import { ItemCount } from './ItemCount'
import { MostPopulars } from './styles'
import { TitleSection } from './TitleSection'

export function ItemList() {
    return (
        <>
        <MostPopulars>
            <div className="container">
                <TitleSection
                title="Mais vendidos"
                />
                <ItemCount
                stock="5"
                initial="1"
                onAdd={(count) => console.log(`Adicionado ${count} produtos ao carrinho`)}
                />
            </div>
        </MostPopulars>
        </>
    )
}