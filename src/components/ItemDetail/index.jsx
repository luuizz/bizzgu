import React from "react"
import { products } from "../../data/products"
import starsReview from '/src/assets/stars.svg'
import { ItemCount } from "../ItemListContainer/ItemCount"

export function ItemDetail({item}) {
    return (
        <>
            <section>
                <div className="container">
                    <div className="images">
                        <div className="destaque">
                            <img src={item.imgUrl} alt={item.nome} />
                        </div>
                        <div className="thumbs">
                            <button>
                                <img src="" alt="" />
                            </button>

                            <button>
                                <img src="" alt="" />
                            </button>

                            <button>
                                <img src="" alt="" />
                            </button>
                        </div>
                    </div>
                    <div className="infos">
                        <h1>{item.nome}</h1>
                        <p>{item.descrição}</p>
                        <img src={starsReview} alt="" />
                        <h3>{item.preço.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        <ItemCount className="item-detail" />
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