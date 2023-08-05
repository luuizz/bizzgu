import { CardProduct } from '../CardProduct'
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
                <CardProduct />
            </div>
        </MostPopulars>
        </>
    )
}