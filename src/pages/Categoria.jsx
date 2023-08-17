import React from 'react';
import { useParams } from 'react-router-dom';
import { CategoryContainer } from '../components/CategoryContainer';

export function Categoria() {

    const { slug } = useParams();

    return (
        <>
            <h1>Página da categoria {slug}</h1>
            <CategoryContainer categorySlug={slug} />
        </>
    )
}