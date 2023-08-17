import React from "react"
import starsReview from '/src/assets/stars.svg'
import { ItemCount } from "../ItemListContainer/ItemCount"
import { ThumbsItem } from "./ThumbsItem"

export function ItemDetail({item}) {
    return (
        <>
            <section>
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
                        onAdd={(count) => console.log(`Adicionado ${count} produtos ao carrinho`)}
                        />
                    )}
                        <div className="share">
                            <ul>
                                <li>
                                    <img src="" alt="" />
                                    <span>Lista de desejos</span>
                                </li>

                                <li>
                                    <img src="" alt="" />
                                    <span>Compartilhe nas redes sociais</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}