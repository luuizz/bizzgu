import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { RequireAuth, RequireAdmin } from './components/RouteGuards'
import { Loader } from './components/ui'
import { Home } from './pages/Home'
import { Categoria } from './pages/Categoria'
import { ItemDetail } from './pages/ItemDetail'
import { Search } from './pages/Search'
import { Chart } from './pages/Chart'
import { NotFound } from './pages/NotFound'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { ResetPassword } from './pages/auth/ResetPassword'

// Páginas carregadas sob demanda: quem só navega pela loja não baixa o painel
const WishList = lazy(() => import('./pages/WishList').then((m) => ({ default: m.WishList })))
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })))
const Institutional = lazy(() => import('./pages/Institutional').then((m) => ({ default: m.Institutional })))

const AccountLayout = lazy(() => import('./pages/account/AccountLayout').then((m) => ({ default: m.AccountLayout })))
const AccountOverview = lazy(() => import('./pages/account/Overview').then((m) => ({ default: m.Overview })))
const AccountOrders = lazy(() => import('./pages/account/Orders').then((m) => ({ default: m.Orders })))
const AccountOrderDetail = lazy(() => import('./pages/account/OrderDetail').then((m) => ({ default: m.OrderDetail })))
const AccountProfile = lazy(() => import('./pages/account/Profile').then((m) => ({ default: m.Profile })))

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then((m) => ({ default: m.Dashboard })))
const AdminOrders = lazy(() => import('./pages/admin/Orders').then((m) => ({ default: m.Orders })))
const AdminOrderDetail = lazy(() => import('./pages/admin/OrderDetail').then((m) => ({ default: m.OrderDetail })))
const AdminProducts = lazy(() => import('./pages/admin/Products').then((m) => ({ default: m.Products })))
const AdminProductForm = lazy(() => import('./pages/admin/ProductForm').then((m) => ({ default: m.ProductForm })))
const AdminCategories = lazy(() => import('./pages/admin/Categories').then((m) => ({ default: m.Categories })))
const AdminCustomers = lazy(() => import('./pages/admin/Customers').then((m) => ({ default: m.Customers })))

export function Router() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categoria/:slug" element={<Categoria />} />
                <Route path="/produto/:slug" element={<ItemDetail />} />
                <Route path="/busca" element={<Search />} />
                <Route path="/carrinho-compras" element={<Chart />} />
                <Route path="/institucional/:slug" element={<Institutional />} />

                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Register />} />
                <Route path="/recuperar-senha" element={<ForgotPassword />} />
                <Route path="/redefinir-senha" element={<ResetPassword />} />

                <Route element={<RequireAuth />}>
                    <Route path="/lista-desejos" element={<WishList />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/minha-conta" element={<AccountLayout />}>
                        <Route index element={<AccountOverview />} />
                        <Route path="pedidos" element={<AccountOrders />} />
                        <Route path="pedidos/:id" element={<AccountOrderDetail />} />
                        <Route path="dados" element={<AccountProfile />} />
                    </Route>
                </Route>

                <Route element={<RequireAdmin />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="pedidos" element={<AdminOrders />} />
                        <Route path="pedidos/:id" element={<AdminOrderDetail />} />
                        <Route path="produtos" element={<AdminProducts />} />
                        <Route path="produtos/novo" element={<AdminProductForm />} />
                        <Route path="produtos/:id" element={<AdminProductForm />} />
                        <Route path="categorias" element={<AdminCategories />} />
                        <Route path="clientes" element={<AdminCustomers />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    )
}
