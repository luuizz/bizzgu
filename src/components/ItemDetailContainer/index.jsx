import React, { useEffect, useState } from "react"
import { ItemDetail } from "../ItemDetail"
import { products } from "../../data/products"

export function ItemDetailContainer() {
    
    const [Item, setItem] = useState(null);

    useEffect(() => {
        const productId = 2;
        const productSelected = products.find((product) => product.id === productId);
    
        if (productSelected) {
            setTimeout(() => {
                setItem(productSelected);
            }, 2000);
        }
    }, []);



    return (
        <>
            {Item ? (
                <ItemDetail item={Item} />
            ) : (
                <p>Carregando</p>
            )}
        </>
    )
}