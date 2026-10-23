import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { AMENITIES } from './Listings';

export default function AddListing() {
  const [v, setV] = useState({ title: '', description: '', type: 'pg', city: '', area: '', address: '', rent: '', deposit: '', gender: 'unisex', amenities: [] });
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const toggleAm = (a) => setV({ ...v, amenities: v.amenities.includes(a) ? v.amenities.filter((x) => x !== a) : [...v.amenities, a] });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData();
    Object.entries(v).forEach(([k, val]) => fd.append(k, k === 'amenities' ? val.join(',') : val));
    files.forEach((f) => fd.append('images', f));
    try { await api.post('/listings', fd); nav('/dashboard'); } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-3 rounded-xl bg-white p-6 ring-1 ring-slate-200">
      <h1 className="font-display text-2xl font-bold">Post your room or PG</h1>
      {err && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{err}</p>}
      <input required className="input" placeholder="Title (e.g. Single room near Sanjay Place)" value={v.title} onChange={set('title')} />
      <textarea rows="4" className="input" placeholder="Describe the place, rules, nearby landmarks" value={v.description} onChange={set('description')} />
      <div className="grid gap-3 sm:grid-cols-2">
        <select className="input" value={v.type} onChange={set('type')}><option value="room">Room</option><option value="pg">PG</option><option value="flat">Flat</option></select>
        <select className="input" value={v.gender} onChange={set('gender')}><option value="unisex">Boys & girls</option><option value="boys">Boys only</option><option value="girls">Girls only</option></select>
        <input required className="input" placeholder="City" value={v.city} onChange={set('city')} />
        <input required className="input" placeholder="Area" value={v.area} onChange={set('area')} />
        <input required type="number" min="0" className="input" placeholder="Rent per month (₹)" value={v.rent} onChange={set('rent')} />
        <input type="number" min="0" className="input" placeholder="Deposit (₹)" value={v.deposit} onChange={set('deposit')} />
      </div>
      <input className="input" placeholder="Full address" value={v.address} onChange={set('address')} />
      <div>
        <p className="mb-1 text-sm font-medium">Amenities</p>
        <div className="grid grid-cols-2 gap-1 text-sm sm:grid-cols-3">
          {AMENITIES.map((a) => <label key={a} className="flex items-center gap-2"><input type="checkbox" checked={v.amenities.includes(a)} onChange={() => toggleAm(a)} />{a}</label>)}
        </div>
      </div>
      <label className="block text-sm font-medium">Photos (up to 5)
        <input type="file" accept="image/*" multiple className="mt-1 block w-full text-sm" onChange={(e) => setFiles([...e.target.files].slice(0, 5))} />
      </label>
      <button className="btn w-full" disabled={busy}>{busy ? 'Publishing…' : 'Post it'}</button>
    </form>
  );
}
