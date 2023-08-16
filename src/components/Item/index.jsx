import { Link } from 'react-router-dom'
import { ItemCount } from "../ItemListContainer/ItemCount";
import { products } from '../../data/products';
import starsReview from '/src/assets/stars.svg'
import favoriteIcon from '/src/assets/heart.svg'
import shareSocial from '/src/assets/icon-share.svg'

export function Item() {
    const MaisAcessados = products.slice(0,4);
    return (
        <>
        {MaisAcessados.map((item) => (
            <Link to={`/produto/${item.id}`} className='item-list' key={item.id}>
                <div className="image">
                    <img src={item.imgUrl} alt={item.nome} />
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
                    <span>{item.nome}</span>
                    <h3>{item.preço.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                </div>
                {item.stock > 0 && (
                    <ItemCount
                    stock={item.stock.toString()}
                    initial="1"
                    onAdd={(count) => console.log(`Adicionado ${count} produtos ao carrinho`)}
                    />
                )}
            </Link>
        ))}
        </>
    )
}