import { StylesSearchHeader } from './styles'
import iconSearch from '/src/assets/icon-search.svg'

export function SearchHeader({textHolder}) {
    return (
        <>
            <StylesSearchHeader action="">
                <input type="text" placeholder={textHolder} />
                <button type='submit'>
                    <img src={iconSearch} alt="" />
                </button>
            </StylesSearchHeader>
        </>
    )
}