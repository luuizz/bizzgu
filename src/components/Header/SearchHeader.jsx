import { StylesSearchHeader } from './styles'
import iconSearch from '/src/assets/icon-search.svg'

export function SearchHeader() {
    return (
        <>
            <StylesSearchHeader action="">
                <input type="text" placeholder='O que você procura?' />
                <button type='submit'>
                    <img src={iconSearch} alt="" />
                </button>
            </StylesSearchHeader>
        </>
    )
}