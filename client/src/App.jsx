import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import { Login, Register } from './pages/AuthPages';
import Favorites from './pages/Favorites';
import Dashboard from './pages/Dashboard';
import AddListing from './pages/AddListing';

function Private({ children, owner }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (owner && user.role === 'tenant') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={<Private><Favorites /></Private>} />
          <Route path="/dashboard" element={<Private owner><Dashboard /></Private>} />
          <Route path="/add" element={<Private owner><AddListing /></Private>} />
          <Route path="*" element={<p className="py-16 text-center">Page not found.</p>} />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        Room & PG Finder. Always meet the owner and see the place before you pay anything.
      </footer>
    </>
  );
}
