import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ItemDetail } from './pages/ItemDetail';
import { Chart } from './pages/Chart';
import { LoginLayout } from './components/LoginLayout';
import { Login } from './pages/Login';
import { Search } from './pages/Search';
import { WishList } from './pages/WishList';
import { Categoria } from './pages/Categoria'
import { NotFound } from './pages/NotFound'

export function Router() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/produto/:slug" element={<ItemDetail />} />
            <Route path='/item' element={<ItemDetail />} />
            <Route path='/lista-desejos' element={<WishList />} />
            <Route path='/busca' element={<Search />} />
            <Route path='/login' element={<LoginLayout><Login /></LoginLayout>} />
            <Route path='/carrinho-compras' element={<Chart />} />
            <Route path='/categoria/:slug' element={<Categoria />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
}