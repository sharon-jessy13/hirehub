import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PostJob() {
  const { token, user } = useAuth();
  const navigate        = useNavigate();
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time', description: '', salary: ''
  });
  const [error, setError] = useState('');

  if (!user || user.role !== 'recruiter') {
    return <p style={{ textAlign: 'center', marginTop: '60px', color: 'red' }}>
      Only recruiters can post jobs. Please login as a recruiter.
    </p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm({ ...form, [field]: e.target.value }),
    style: inputStyle
  });

  return (
    <div style={{ maxWidth: '560px', margin: '40px auto', padding: '32px', border: '1px solid #e0e0e0', borderRadius: '12px', background: 'white' }}>
      <h2 style={{ marginBottom: '24px' }}>Post a New Job</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Job Title"       {...f('title')}       required />
        <input placeholder="Company Name"    {...f('company')}     required />
        <input placeholder="Location"        {...f('location')}    required />
        <input placeholder="Salary (e.g. ₹8-12 LPA)" {...f('salary')} />
        <select {...f('type')}>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Remote</option>
          <option>Internship</option>
        </select>
        <textarea placeholder="Job Description..." rows={5}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          style={{ ...inputStyle, resize: 'vertical' }} required />
        <button type="submit" style={submitBtn}>Post Job</button>
      </form>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: '11px 14px', margin: '0 0 14px', border: '1px solid #ccc', borderRadius: '7px', fontSize: '15px', boxSizing: 'border-box' };
const submitBtn  = { width: '100%', padding: '12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '7px', fontSize: '16px', cursor: 'pointer' };