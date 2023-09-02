import { addDoc, collection, doc, getFirestore, updateDoc, writeBatch } from 'firebase/firestore'

export function Orders() {
    const mountOrder = () => {
        const oder = {
            buyer: { name: 'Luiz', phone: '1194858585858', email: 'teste@gmail.com' },
            items: [{ name: 'Tenis', price: 50, quantity:  50}],
            total: 300
        }

        const db = getFirestore();
        const dbCollection = collection(db, 'orders');
        addDoc(dbCollection, oder).then(({ id }) => console.log(id));
    }

    const updateOrder = () => {
        const oder = {
            buyer: { name: 'Luiz', phone: '1194858585858', email: 'teste@gmail.com' },
            items: [{ name: 'Tenis', price: 50, quantity:  50}],
            total: 300
        }

        const db = getFirestore();
        const dbCollection = doc(db, 'orders', 'bwFiASxilaQUNLvgcml5');
        updateDoc(dbCollection, {total: 985}, {buyer: {name: 'Antonio Nunes'}});
    }

    const updadeBatchOrder = () => {
        const db = getFirestore();
        const batch = writeBatch;
        const dbCollection = doc(db, 'orders', '');
        batch.update(dbCollection, {total: 200});
        batch.set(dbCollection, {field: 'bwFiASxilaQUNLvgcml5'});
        batch.commit();
    }
    return (
        <>
                <button onClick={mountOrder}>Cadastrar</button>
        <button onClick={updateOrder}>Atualizar</button>
        </>

    )
}