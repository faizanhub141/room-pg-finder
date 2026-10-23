import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

function Form({ register }) {
  const [v, setV] = useState({ name: '', email: '', password: '', phone: '', role: 'tenant' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const { authenticate } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api.post(register ? '/auth/register' : '/auth/login', v);
      authenticate(r.data);
      nav(r.data.user.role === 'owner' ? '/dashboard' : '/');
    } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-3 rounded-xl bg-white p-6 ring-1 ring-slate-200">
      <h1 className="font-display text-2xl font-bold">{register ? 'Create your account' : 'Welcome back'}</h1>
      {err && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{err}</p>}
      {register && <input required className="input" placeholder="Full name" value={v.name} onChange={set('name')} />}
      <input required type="email" className="input" placeholder="Email" value={v.email} onChange={set('email')} />
      {register && <input className="input" placeholder="Phone number" value={v.phone} onChange={set('phone')} />}
      <input required minLength="6" type="password" className="input" placeholder="Password (6+ characters)" value={v.password} onChange={set('password')} />
      {register && (
        <select className="input" value={v.role} onChange={set('role')}>
          <option value="tenant">I'm looking for a room</option>
          <option value="owner">I want to list my property</option>
        </select>
      )}
      <button className="btn w-full" disabled={busy}>{busy ? 'Please wait…' : register ? 'Sign up' : 'Log in'}</button>
      <p className="text-center text-sm">
        {register ? <>Already registered? <Link className="text-petrol underline" to="/login">Log in</Link></> : <>New here? <Link className="text-petrol underline" to="/register">Create an account</Link></>}
      </p>
    </form>
  );
}
export const Login = () => <Form />;
export const Register = () => <Form register />;
