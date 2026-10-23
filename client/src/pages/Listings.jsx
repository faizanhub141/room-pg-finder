import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import ListingCard from '../components/ListingCard';

export const AMENITIES = ['WiFi', 'Food', 'AC', 'Laundry', 'Parking', 'Geyser', 'Power backup', 'Attached bathroom'];
const empty = { city: '', area: '', type: '', gender: '', minRent: '', maxRent: '', amenities: [] };

export default function Listings() {
  const [f, setF] = useState(empty);
  const [data, setData] = useState({ listings: [], pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = (filters = f, p = page) => {
    setLoading(true);
    const params = { ...filters, amenities: filters.amenities.join(','), page: p };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    api.get('/listings', { params })
      .then((r) => { setData(r.data); setError(''); })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, [page]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggleAm = (a) => setF({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] });
  const search = (e) => { e.preventDefault(); setPage(1); fetchData(f, 1); setShow(false); };
  const reset = () => { setF(empty); setPage(1); fetchData(empty, 1); };

  return (
    <div>
      <section className="board mb-8 border-4 border-ink bg-petrol px-5 py-8 text-white sm:px-10 sm:py-10">
        <p className="font-display text-5xl font-extrabold leading-none text-marigold sm:text-7xl">To&#8209;Let</p>
        <h1 className="mt-3 max-w-2xl text-2xl font-bold sm:text-3xl">Rooms, PGs and flats listed by the people who own them.</h1>
        <p className="mt-2 max-w-xl text-white/85">Type your city, set a budget, and message the owner directly. No broker in between.</p>
        <form onSubmit={search} className="mt-6 flex flex-col gap-2 sm:flex-row">
          <input className="input !border-ink text-ink" placeholder="Which city?" aria-label="City" value={f.city} onChange={set('city')} />
          <input className="input !border-ink text-ink" placeholder="Any particular area?" aria-label="Area" value={f.area} onChange={set('area')} />
          <button className="btn !bg-marigold !text-ink hover:!bg-yellow-300">Find rooms</button>
        </form>
      </section>

      <button className="btn-alt mb-3 w-full md:hidden" onClick={() => setShow(!show)}>{show ? 'Close filters' : 'Filter results'}</button>
      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <aside className={`${show ? 'block' : 'hidden'} h-fit space-y-4 rounded-xl bg-white p-4 ring-1 ring-slate-200 md:block`}>
          <form onSubmit={search} className="space-y-4">
            <label className="block text-sm font-medium">Type
              <select className="input mt-1" value={f.type} onChange={set('type')}>
                <option value="">Any</option><option value="room">Room</option><option value="pg">PG</option><option value="flat">Flat</option>
              </select>
            </label>
            <label className="block text-sm font-medium">Suitable for
              <select className="input mt-1" value={f.gender} onChange={set('gender')}>
                <option value="">Anyone</option><option value="boys">Boys</option><option value="girls">Girls</option>
              </select>
            </label>
            <div>
              <p className="text-sm font-medium">Rent per month (₹)</p>
              <div className="mt-1 flex gap-2">
                <input type="number" min="0" className="input" placeholder="Min" value={f.minRent} onChange={set('minRent')} />
                <input type="number" min="0" className="input" placeholder="Max" value={f.maxRent} onChange={set('maxRent')} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Amenities</p>
              <div className="mt-1 grid grid-cols-2 gap-1 text-sm md:grid-cols-1">
                {AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2">
                    <input type="checkbox" checked={f.amenities.includes(a)} onChange={() => toggleAm(a)} /> {a}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn flex-1">Show results</button>
              <button type="button" className="btn-alt" onClick={reset}>Clear</button>
            </div>
          </form>
        </aside>

        <section>
          {error && <p className="mb-3 rounded bg-red-50 p-3 text-red-700">{error}</p>}
          {loading ? <p>Loading listings…</p> : data.listings.length === 0 ? (
            <p className="rounded-xl bg-white p-8 text-center ring-1 ring-slate-200">No listings match these filters. Try a higher budget or untick a few amenities.</p>
          ) : (
            <>
              <p className="mb-3 text-sm text-slate-600">Showing {data.total} place{data.total > 1 && 's'}</p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.listings.map((l) => <ListingCard key={l._id} l={l} />)}
              </div>
              {data.pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button className="btn-alt" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                  <span className="text-sm">Page {page} of {data.pages}</span>
                  <button className="btn-alt" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
