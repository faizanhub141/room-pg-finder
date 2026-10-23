import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg, imgUrl } from '../api';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [enq, setEnq] = useState([]);
  const [err, setErr] = useState('');

  const load = () => {
    api.get('/listings/mine').then((r) => setItems(r.data)).catch((e) => setErr(errMsg(e)));
    api.get('/enquiries/received').then((r) => setEnq(r.data)).catch(() => {});
  };
  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    await api.delete(`/listings/${id}`);
    load();
  };
  const toggle = async (l) => {
    await api.put(`/listings/${l._id}`, { available: !l.available });
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">My listings</h1>
        <Link to="/add" className="btn">Post a room</Link>
      </div>
      {err && <p className="text-red-700">{err}</p>}
      {items.length === 0 ? <p>Nothing posted yet. Post your first room or PG and tenants can find it.</p> : (
        <div className="space-y-3">
          {items.map((l) => (
            <div key={l._id} className="flex flex-col gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200 sm:flex-row sm:items-center">
              <img src={imgUrl(l.images[0])} alt="" className="h-24 w-full rounded object-cover sm:w-32" onError={(e) => (e.target.style.visibility = 'hidden')} />
              <div className="flex-1">
                <Link to={`/listings/${l._id}`} className="font-semibold hover:underline">{l.title}</Link>
                <p className="text-sm text-slate-600">{l.area}, {l.city} · ₹{l.rent}/month</p>
                <p className={`text-sm ${l.available ? 'text-green-700' : 'text-slate-500'}`}>{l.available ? 'Available' : 'Not available'}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-alt" onClick={() => toggle(l)}>{l.available ? 'Mark taken' : 'Mark available'}</button>
                <button className="btn-alt !border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white" onClick={() => remove(l._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        <h2 className="mb-3 font-display text-xl font-bold">Enquiries received</h2>
        {enq.length === 0 ? <p>No enquiries yet.</p> : (
          <ul className="space-y-2">
            {enq.map((e) => (
              <li key={e._id} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">{e.listing?.title} · {new Date(e.createdAt).toLocaleDateString()}</p>
                <p className="mt-1">{e.message}</p>
                <p className="mt-1 text-sm font-medium">{e.user?.name} · {e.user?.email}{e.user?.phone && ` · ${e.user.phone}`}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
