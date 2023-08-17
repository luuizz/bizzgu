import React from "react";
import { useParams } from 'react-router-dom'
import { ItemDetailContainer } from "../components/ItemDetailContainer";

export function ItemDetail() {
    const { slug } = useParams();

    return (
        <>
            <ItemDetailContainer productSlug={slug} />
        </>
    )
}