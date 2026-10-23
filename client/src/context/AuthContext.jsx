import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = () =>
    api.get('/users/favorites').then((r) => setFavorites(r.data.map((l) => l._id))).catch(() => {});

  useEffect(() => {
    if (!localStorage.getItem('token')) return setLoading(false);
    api.get('/auth/me')
      .then((r) => { setUser(r.data); loadFavorites(); })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = (data) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    loadFavorites();
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); setFavorites([]); };
  const toggleFavorite = async (id) => {
    const r = await api.post(`/users/favorites/${id}`);
    setFavorites(r.data.favorites.map(String));
  };

  return (
    <AuthContext.Provider value={{ user, loading, favorites, authenticate, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}
