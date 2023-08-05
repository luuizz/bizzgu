import { StyleCardProduct } from './style'
import { ItemCount } from "../ItemList/ItemCount";
import imgProduct from '/src/assets/img-product.png'
import starsReview from '/src/assets/stars.svg'
import favoriteIcon from '/src/assets/heart.svg'
import shareSocial from '/src/assets/icon-share.svg'

export function CardProduct() {
    return (
        <>
            <StyleCardProduct>
                <div className="image">
                    <a href="#">
                        <img src={imgProduct} alt="Iphone" />
                    </a>
                </div>
                <div className="middle">
                    <div className="review">
                        <img src={starsReview} alt="Estrelas" />
                        <span>(3)</span>
                    </div>
                    <div className="share">
                        <img src={favoriteIcon} alt="Adicionar na lista de desejos" />
                        <img src={shareSocial} alt="Compartilhar nas redes sociais" />
                    </div>
                </div>
                <div className="info">
                    <span>Smartphone Samsung Galaxy S21 FE 256GB Violeta 5G Octa-Core 8GB RAM 6,4” Câm. Tripla + Selfie 32MP</span>
                    <h3>R$ 2.299,00</h3>
                </div>
                <ItemCount
                stock="5"
                initial="1"
                onAdd={(count) => console.log(`Adicionado ${count} produtos ao carrinho`)}
                />
            </StyleCardProduct>
        </>
    )
}