import React, { useState, useEffect } from 'react';
import { Category } from '../../Category';
import { categories } from '../../data/categories';

export function CategoryContainer({ categorySlug }) {

    const [category, setCategory] = useState(null);

    useEffect(() => {
        const categorySelected = categories.find((category) => category.slug === categorySlug);
    
        if (categorySelected) {
            setCategory(categorySelected);
        }
    }, [categorySlug]);
    return (
        <>
            {category ? (
                <Category category={category} />
            ) : (
                <p>Categoria não encontrada.</p>
            )}
        </>
    )
}