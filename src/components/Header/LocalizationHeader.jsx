import { StylesLocalization } from './styles'
import iconLocalization from '/src/assets/icon-local.svg'
import iconDropDown from '/src/assets/icon-dropdown.svg'

export function LocalizationHeader({ location, toggleModal }) {
    return (
        <StylesLocalization>
            <button type="button" title="Informar CEP" onClick={toggleModal}>
                <img src={iconLocalization} alt="" />
                <p>
                    {location
                        ? <><small>Entregar em</small>{location.city} - {location.state}</>
                        : 'Localização'}
                </p>
                <img className="dropdown" src={iconDropDown} alt="" />
            </button>
        </StylesLocalization>
    )
}
