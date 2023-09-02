import { useEffect, useState } from 'react';
import { ItemList } from '../ItemList'
import { MostPopulars } from './styles'
import { TitleSection } from './TitleSection'
import { products } from '../../data/products';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export function ItemListContainer() {
    const firebaseConfig = {
        apiKey: "AIzaSyAXNqfrrv3q1jipxTuZ0Cuomh1YmpDwSmU",
        authDomain: "bizzgu-d8854.firebaseapp.com",
        projectId: "bizzgu-d8854",
        storageBucket: "bizzgu-d8854.appspot.com",
        messagingSenderId: "1002210483961",
        appId: "1:1002210483961:web:308cf694df6bdfeadfcc28"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app); 
    const [Items, setItems] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, 'products'), where('categoryId', '==', categoryId)); 
                const querySnapshot = await getDocs(q);
                const itemsData = [];
    
                querySnapshot.forEach((doc) => {
                    itemsData.push(doc.data());
                });
    
                setItems(itemsData);
            } catch (error) {
                console.error("Erro ao buscar dados do Firestore:", error);
            }
        };
    
        fetchData();
    }, []);
    return (
        <>
        <MostPopulars>
            <div className="container">
                <TitleSection
                title="Mais vendidos"
                />
                <ItemList items={Items} />
            </div>
        </MostPopulars>
        </>
    )
}