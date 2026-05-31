import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login }         = useAuth();
  const navigate          = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={formWrap}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Login to HireHub</h2>
      {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email"    type="email"    value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}    style={inputStyle} required />
        <input placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} required />
        <button type="submit" style={submitBtn}>Login</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

const formWrap   = { maxWidth: '420px', margin: '60px auto', padding: '32px', border: '1px solid #e0e0e0', borderRadius: '12px', background: 'white' };
const inputStyle = { display: 'block', width: '100%', padding: '11px 14px', margin: '0 0 14px', border: '1px solid #ccc', borderRadius: '7px', fontSize: '15px', boxSizing: 'border-box' };
const submitBtn  = { width: '100%', padding: '12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '7px', fontSize: '16px', cursor: 'pointer' };