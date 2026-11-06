import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { RequireAuth, RequireAdmin } from './components/RouteGuards'
import { Loader } from './components/ui'
import { StoreLayout } from './components/StoreLayout'
import { Home } from './pages/Home'
import { Categoria } from './pages/Categoria'
import { TagPage } from './pages/TagPage'
import { About } from './pages/About'
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
const AdminTermsList = lazy(() => import('./pages/admin/Taxonomy').then((m) => ({ default: m.TermsList })))
const AdminTermForm = lazy(() => import('./pages/admin/Taxonomy').then((m) => ({ default: m.TermForm })))
const AdminBanners = lazy(() => import('./pages/admin/Banners').then((m) => ({ default: m.Banners })))
const AdminBannerForm = lazy(() => import('./pages/admin/BannerForm').then((m) => ({ default: m.BannerForm })))
const AdminPosts = lazy(() => import('./pages/admin/Posts').then((m) => ({ default: m.Posts })))
const AdminPostForm = lazy(() => import('./pages/admin/PostForm').then((m) => ({ default: m.PostForm })))
const Blog = lazy(() => import('./pages/Blog').then((m) => ({ default: m.Blog })))
const Post = lazy(() => import('./pages/Post').then((m) => ({ default: m.Post })))
const AdminSettings = lazy(() => import('./pages/admin/Settings').then((m) => ({ default: m.Settings })))
const AdminNotFound = lazy(() => import('./pages/admin/AdminNotFound').then((m) => ({ default: m.AdminNotFound })))
const AdminCustomers = lazy(() => import('./pages/admin/Customers').then((m) => ({ default: m.Customers })))

export function Router() {
    return (
        <Suspense fallback={<Loader fullScreen />}>
            <Routes>
                {/* Painel administrativo: layout próprio, fora da moldura da loja */}
                <Route element={<RequireAdmin />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="pedidos" element={<AdminOrders />} />
                        <Route path="pedidos/:id" element={<AdminOrderDetail />} />
                        <Route path="produtos" element={<AdminProducts />} />
                        <Route path="produtos/novo" element={<AdminProductForm />} />
                        <Route path="produtos/:id" element={<AdminProductForm />} />
                        <Route path="categorias" element={<AdminTermsList kind="categories" />} />
                        <Route path="categorias/nova" element={<AdminTermForm kind="categories" />} />
                        <Route path="categorias/:id" element={<AdminTermForm kind="categories" />} />
                        <Route path="tags" element={<AdminTermsList kind="tags" />} />
                        <Route path="tags/nova" element={<AdminTermForm kind="tags" />} />
                        <Route path="tags/:id" element={<AdminTermForm kind="tags" />} />
                        <Route path="clientes" element={<AdminCustomers />} />
                        <Route path="banners" element={<AdminBanners />} />
                        <Route path="configuracoes" element={<AdminSettings />} />
                        <Route path="blog" element={<AdminPosts />} />
                        <Route path="blog/novo" element={<AdminPostForm />} />
                        <Route path="blog/:id" element={<AdminPostForm />} />
                        <Route path="banners/novo" element={<AdminBannerForm />} />
                        <Route path="banners/:id" element={<AdminBannerForm />} />
                        <Route path="*" element={<AdminNotFound />} />
                    </Route>
                </Route>

                {/* Loja: cabeçalho, menu e rodapé */}
                <Route element={<StoreLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/categoria/:slug" element={<Categoria />} />
                    <Route path="/tag/:slug" element={<TagPage />} />
                    <Route path="/produto/:slug" element={<ItemDetail />} />
                    <Route path="/busca" element={<Search />} />
                    <Route path="/carrinho-compras" element={<Chart />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<Post />} />
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

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Suspense>
    )
}
