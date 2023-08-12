import { Item } from '../Item'
import {StyleGroupList } from './style'

export function ItemList() {
    return (
        <>
            <StyleGroupList className="group">
                <Item />
            </StyleGroupList>
        </>
    )
}