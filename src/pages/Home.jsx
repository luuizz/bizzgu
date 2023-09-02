import { ItemListContainer } from "../components/ItemListContainer";
import { Slide } from "../components/Slider";
import { Orders } from "../data/oders";


export function Home() {
    return (
        <>
            <Slide />
            <ItemListContainer />
            <Orders />
        </>
    )
}