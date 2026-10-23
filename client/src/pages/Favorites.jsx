import { useEffect, useState } from 'react';
import api from '../api';
import ListingCard from '../components/ListingCard';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
  const [items, setItems] = useState([]);
  const { favorites } = useAuth();
  useEffect(() => { api.get('/users/favorites').then((r) => setItems(r.data)); }, [favorites]);
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl font-bold">Places you saved</h1>
      {items.length === 0 ? <p>Nothing saved yet. Tap the heart on any listing to keep it here.</p> : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((l) => <ListingCard key={l._id} l={l} />)}</div>
      )}
    </div>
  );
}
