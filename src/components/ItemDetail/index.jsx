import React, { useState } from "react"
import { useCart } from "../../context/CartContext"
import starsReview from '/src/assets/stars.svg'
import { ItemCount } from "../ItemListContainer/ItemCount"
import { ThumbsItem } from "./ThumbsItem"
import { StyleItemDetail } from './style'
import ShareImg from '/src/assets/icon-share-2.svg'
import WishListIcon from '/src/assets/icon-heart.svg'

export function ItemDetail({item}) {
    const { addItem, isInCart} = useCart();

    const handleAddToCart = (count) => {
        if (!isInCart(item.id)) {
            addItem(item, count);
            console.log(`Adicionado ${count} produtos ao carrinho`);
        } else {
            console.log('Este produto já está no carrinho.');
        }
    };
    return (
        <>
            <StyleItemDetail>
                <div className="container">
                    <div className="images">
                        <div className="destaque">
                            <img src={item.imgUrl} alt={item.nome} />
                        </div>
                    <ThumbsItem />
                    </div>
                    <div className="infos">
                        <h1>{item.nome}</h1>
                        <p>{item.descrição}</p>
                        <img src={starsReview} alt="" />
                        <h3>{item.preço.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                    {item.stock > 0 && (
                        <ItemCount
                        stock={item.stock.toString()}
                        initial="1"
                        onAdd={handleAddToCart}
                        />
                    )}
                    <div className="share">
                        <ul>
                            <li>
                                <button>
                                    <span className="icon">
                                        <img src={WishListIcon} alt="Ícone de um coração" />
                                    </span>
                                    <span>Lista de desejos</span>
                                </button>
                            </li>
                            <li>
                                <button>
                                    <span className="icon">
                                        <img src={ShareImg} alt="Imagem de Compartilhamento nas redes sociais" />
                                    </span>
                                    <span>Compartilhe nas redes sociais</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    </div>
                </div>
            </StyleItemDetail>
        </>
    )
}