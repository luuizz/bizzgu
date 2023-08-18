import React from 'react';
import { StyleThumbsItem } from './style'
import { useLocation } from 'react-router-dom';
import { products } from '../../data/products'

export function ThumbsItem() {


    const location = useLocation();
    const productSlug = location.pathname.split('/').pop();
    const currentProduct = products.find(product => product.urlSlug === productSlug);

    return (
        <>
            <StyleThumbsItem className="thumbs">
                {currentProduct && (
                    <>
                        <button>
                            <img src={currentProduct.imgThumb01} alt="" />
                        </button>

                        <button>
                            <img src={currentProduct.imgThumb02} alt="" />
                        </button>

                        <button>
                            <img src={currentProduct.imgThumb03} alt="" />
                        </button>
                    </>
                )}
            </StyleThumbsItem>
        </>
    )
}