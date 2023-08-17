import React, { useEffect, useState } from "react"
import { ItemDetail } from "../ItemDetail"
import { products } from "../../data/products"

export function ItemDetailContainer({productSlug }) {
    
    const [Item, setItem] = useState(null);

    useEffect(() => {
        const productSelected = products.find((product) => product.urlSlug === productSlug);
    
    
        if (productSelected) {
            setTimeout(() => {
                setItem(productSelected);
            }, 2000);
        }
    }, [productSlug]);



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