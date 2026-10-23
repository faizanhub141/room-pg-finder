import { Link, useNavigate } from 'react-router-dom';
import { imgUrl } from '../api';
import { useAuth } from '../context/AuthContext';

const kind = { room: 'Room', pg: 'PG', flat: 'Flat' };
const who = { boys: 'for boys', girls: 'for girls', unisex: 'for anyone' };

export default function ListingCard({ l }) {
  const { user, favorites, toggleFavorite } = useAuth();
  const nav = useNavigate();
  const saved = favorites.includes(l._id);
  const save = (e) => { e.preventDefault(); user ? toggleFavorite(l._id) : nav('/login'); };

  return (
    <Link to={`/listings/${l._id}`} className="group flex flex-col border-2 border-ink bg-white hover:-translate-y-0.5 hover:border-petrol">
      <div className="relative aspect-[4/3] border-b-2 border-ink bg-slate-200">
        {l.images?.[0]
          ? <img src={imgUrl(l.images[0])} alt={l.title} className="h-full w-full object-cover" loading="lazy" />
          : <div className="flex h-full items-center justify-center px-4 text-center text-slate-500">Owner hasn't added photos yet</div>}
        <button onClick={save} className="absolute right-0 top-0 bg-white px-3 py-1 text-sm font-bold text-petrol">
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-display text-3xl font-extrabold leading-none text-petrol">
          &#8377;{l.rent.toLocaleString('en-IN')}<span className="ml-1 font-sans text-base font-normal text-slate-600">a month</span>
        </p>
        <h3 className="mt-2 text-lg font-bold">{l.title}</h3>
        <p className="text-slate-600">{kind[l.type]} {who[l.gender]} in {l.area}, {l.city}</p>
      </div>
    </Link>
  );
}
