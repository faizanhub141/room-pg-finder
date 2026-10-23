import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const close = () => setOpen(false);

  const base = 'whitespace-nowrap rounded border-2 px-4 py-2 text-center font-bold';
  const outline = ({ isActive }) =>
    `${base} ${isActive ? 'border-white bg-white text-petrol' : 'border-white/40 text-white hover:bg-white hover:text-petrol'}`;
  const solid = `${base} border-marigold bg-marigold text-ink hover:bg-yellow-300`;
  const isOwner = user && user.role !== 'tenant';

  return (
    <header className="sticky top-0 z-30 border-b-4 border-marigold bg-petrol text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-2xl font-extrabold" onClick={close}>
          Room & PG Finder
        </Link>

        <button
          className="rounded p-2 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>

        <nav
          className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-2 bg-petrol px-4 pb-4 pt-2 lg:static lg:flex lg:flex-row lg:items-center lg:bg-transparent lg:p-0`}
        >
          <NavLink to="/" end className={outline} onClick={close}>Find a room</NavLink>
          {user && <NavLink to="/favorites" className={outline} onClick={close}>Saved</NavLink>}
          {isOwner && <NavLink to="/dashboard" className={outline} onClick={close}>My listings</NavLink>}
          {isOwner && <Link to="/add" className={solid} onClick={close}>Post a room</Link>}
          {user ? (
            <button
              className={`${base} border-white/40 text-white hover:bg-white hover:text-petrol`}
              onClick={() => { logout(); close(); nav('/'); }}
            >
              Log out ({user.name.split(' ')[0]})
            </button>
          ) : (
            <>
              <NavLink to="/login" className={outline} onClick={close}>Log in</NavLink>
              <Link to="/register" className={solid} onClick={close}>Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}