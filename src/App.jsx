import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './pages/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from '@/lib/theme';
import { StoreProvider } from '@/lib/store';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Wishlist from '@/pages/Wishlist';
import Account from '@/pages/Account';
import Search from '@/pages/Search';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import { Shipping, SizeGuide, Privacy, Terms } from '@/pages/ContentPages';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AdminRoute from '@/components/admin/AdminRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminReviews from '@/pages/admin/AdminReviews';
import AdminPromos from '@/pages/admin/AdminPromos';
import AdminSettings from '@/pages/admin/AdminSettings';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary border-t-kinetic rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="promos" element={<AdminPromos />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/profile" element={<Navigate to="/account" replace />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ThemeProvider>
          <StoreProvider>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </StoreProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App