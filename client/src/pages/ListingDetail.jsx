import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg, imgUrl } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [l, setL] = useState(null);
  const [img, setImg] = useState(0);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });

  useEffect(() => { api.get(`/listings/${id}`).then((r) => setL(r.data)).catch((e) => setStatus({ type: 'error', text: errMsg(e) })); }, [id]);

  const send = async (e) => {
    e.preventDefault();
    try {
      await api.post('/enquiries', { listing: id, message: msg });
      setMsg('');
      setStatus({ type: 'ok', text: 'Message sent. The owner will get back to you.' });
    } catch (err) { setStatus({ type: 'error', text: errMsg(err) }); }
  };

  if (!l) return <p>{status.text || 'Loading…'}</p>;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent([l.address, l.area, l.city].filter(Boolean).join(', '))}&output=embed`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="aspect-video overflow-hidden rounded-xl bg-slate-200">
          {l.images[img] ? <img src={imgUrl(l.images[img])} alt={l.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-500">No photo yet</div>}
        </div>
        {l.images.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {l.images.map((im, i) => (
              <button key={im} onClick={() => setImg(i)} className={`h-16 w-24 shrink-0 overflow-hidden rounded ${i === img ? 'ring-2 ring-petrol' : ''}`}>
                <img src={imgUrl(im)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{l.title}</h1>
        <p className="text-slate-600">{[l.address, l.area, l.city].filter(Boolean).join(', ')}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="rounded bg-marigold px-2 py-1 font-bold uppercase">{l.type}</span>
          <span className="rounded bg-white px-2 py-1 capitalize ring-1 ring-slate-200">For {l.gender}</span>
          <span className="rounded bg-white px-2 py-1 ring-1 ring-slate-200">Deposit ₹{l.deposit.toLocaleString('en-IN')}</span>
        </div>
        {l.description && <p className="mt-4 whitespace-pre-line">{l.description}</p>}
        {l.amenities.length > 0 && (
          <div className="mt-4">
            <h2 className="font-display text-lg font-semibold">Amenities</h2>
            <ul className="mt-2 flex flex-wrap gap-2">{l.amenities.map((a) => <li key={a} className="rounded-full bg-white px-3 py-1 text-sm ring-1 ring-slate-200">{a}</li>)}</ul>
          </div>
        )}
        <iframe title="Map" src={mapSrc} loading="lazy" className="mt-5 h-64 w-full rounded-xl border-0" />
      </div>

      <aside className="h-fit space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200 lg:sticky lg:top-20">
        <p className="text-3xl font-bold text-petrol">₹{l.rent.toLocaleString('en-IN')}<span className="text-base font-normal text-slate-500">a month</span></p>
        <div className="text-sm">
          <p className="font-medium">Posted by {l.owner?.name}</p>
          {user && l.owner?.phone && <a className="text-petrol underline" href={`tel:${l.owner.phone}`}>Call {l.owner.phone}</a>}
        </div>
        {user ? (
          <form onSubmit={send} className="space-y-2">
            <textarea required rows="4" className="input" placeholder="Hello, is this still available? When can I come to see it?" value={msg} onChange={(e) => setMsg(e.target.value)} />
            <button className="btn w-full">Message the owner</button>
          </form>
        ) : (
          <Link to="/login" className="btn w-full">Log in to message the owner</Link>
        )}
        {status.text && <p className={`text-sm ${status.type === 'ok' ? 'text-green-700' : 'text-red-700'}`}>{status.text}</p>}
      </aside>
    </div>
  );
}
