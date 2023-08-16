import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ItemDetail } from './pages/ItemDetail';
import { Chart } from './pages/Chart';
import { Login } from './pages/Login';
import { Search } from './pages/Search';
import { WishList } from './pages/WishList';

export function Router() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/produto/:id" element={<ItemDetail />} />
            <Route path='/item' element={<ItemDetail />} />
            <Route path='/lista-desejos' element={<WishList />} />
            <Route path='/busca' element={<Search />} />
            <Route path='/login' element={<Login />} />
            <Route path='/carrinho-compras' element={<Chart />} />
        </Routes>
    );
}