import img1 from '../assets/images/1.png';
import img2 from '../assets/images/2.webp';
import thumb0201 from '../assets/images/ThumbsItem/2-1.webp'
import thumb0202 from '../assets/images/ThumbsItem/2-2.webp'
import thumb0203 from '../assets/images/ThumbsItem/2-3.webp'

export const products = [
    {
        id: 1,
        category: 'celular',
        nome: 'Smartphone Samsung Galaxy S21 FE 256GB Violeta 5G Octa-Core 8GB  RAM 6,4” Câm. Tripla + Selfie 32MP',
        descrição: 'Item01',
        preço: 2299,
        imgUrl: img1,
        imgThumb01: '',
        imgThumb02: '',
        imgThumb03: '',
        stock: 5,
    },
    {
        id: 2,
        category: 'games',
        nome: 'PlayStation 5 825GB 1 Controle Branco Sony',
        descrição: 'Para você que é fanático por games, jogar não tem limites! A Sony apresenta o PlayStation 5 2022 na cor branca. Ele tem SSD com 825GB de armazenamento, 1 controle Dualsense e o jogo God of War Ragnarok instalado. O PlayStation 5 oferece novas possibilidades de jogabilidade que você nunca imaginou. Reproduza jogos para PS5 e PS4 em Blu-ray Disc.',
        preço: 3894.05,
        imgUrl: img2,
        imgThumb01: thumb0201,
        imgThumb02: thumb0202,
        imgThumb03: thumb0203,
        stock: 5,
    },
    {
        id: 3,
        category: '',
        nome: 'Celular',
        descrição: 'Item01',
        preço: 19.99,
        imgUrl: '',
        imgThumb01: '',
        imgThumb02: '',
        imgThumb03: '',
        stock: 5,
    },
    {
        id: 4,
        category: '',
        nome: 'Celular',
        descrição: 'Item01',
        preço: 19.99,
        imgUrl: '',
        imgThumb01: '',
        imgThumb02: '',
        imgThumb03: '',
        stock: 5,
    },
    {
        id: 5,
        category: '',
        nome: 'Celular',
        descrição: 'Item01',
        preço: 19.99,
        imgUrl: '',
        imgThumb01: '',
        imgThumb02: '',
        imgThumb03: '',
        stock: 5,
    },
    {
        id: 6,
        category: '',
        nome: 'Celular',
        descrição: 'Item01',
        preço: 19.99,
        imgUrl: '',
        imgThumb01: '',
        imgThumb02: '',
        imgThumb03: '',
        stock: 5,
    },
    {
        id: 7,
        category: '',
        nome: 'Celular',
        descrição: 'Item01',
        preço: 19.99,
        imgUrl: '',
        imgThumb01: '',
        imgThumb02: '',
        imgThumb03: '',
        stock: 5,
    },
    {
        id: 8,
        category: '',
        nome: 'Celular',
        descrição: 'Item01',
        preço: 19.99,
        imgUrl: '',
        imgThumb01: '',
        imgThumb02: '',
        imgThumb03: '',
        stock: 5,
    },
]

products.forEach(product => {
    product.urlSlug = generateUrlSlug(product.nome);
});

function generateUrlSlug(title) {
    return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}