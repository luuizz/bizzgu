import { useEffect, useState } from 'react';
import { ItemList } from '../ItemList'
import { MostPopulars } from './styles'
import { TitleSection } from './TitleSection'
import { products } from '../../data/products';

export function ItemListContainer() {

    const [Items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setItems(products);
        };

        fetchData();
    }, []);
    return (
        <>
        <MostPopulars>
            <div className="container">
                <TitleSection
                title="Mais vendidos"
                />
                <ItemList items={Items} />
            </div>
        </MostPopulars>
        </>
    )
}