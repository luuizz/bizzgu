import { Armchair, Baby, Basket, Bicycle, CookingPot, Desktop, DeviceMobile, GameController, SquaresFour, Television } from '@phosphor-icons/react'

// Ícone de cada departamento (usado quando a categoria não tem imagem)
const ICONS = {
    celulares: DeviceMobile,
    games: GameController,
    eletrodomesticos: CookingPot,
    'esporte-lazer': Bicycle,
    moveis: Armchair,
    smarttv: Television,
    supermercado: Basket,
    'bebes-infantil': Baby,
    informatica: Desktop,
}

export const categoryIcon = (slug) => ICONS[slug] || SquaresFour
