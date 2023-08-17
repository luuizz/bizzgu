import React from 'react';

export function Category({category}) {
    return (
        <>
            <h2>{category.name}</h2>
            <p>{category.info1}</p>
        </>
    )
}