import { StylesLocalization } from './styles'
import { CaretDown, MapPin } from '@phosphor-icons/react'

export function LocalizationHeader({ location, toggleModal }) {
    return (
        <StylesLocalization>
            <button type="button" title="Informar CEP" onClick={toggleModal}>
                <MapPin size={26} />
                <p>
                    {location
                        ? <><small>Entregar em</small>{location.city} - {location.state}</>
                        : 'Localização'}
                </p>
                <CaretDown className="dropdown" size={16} weight="bold" />
            </button>
        </StylesLocalization>
    )
}
