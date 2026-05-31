import { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';

export default function Home() {
  const [jobs, setJobs]       = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => { setJobs(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 0 30px' }}>
        <h1 style={{ fontSize: '32px', color: '#1a1a2e' }}>Find Your Next Job 🚀</h1>
        <p style={{ color: '#666' }}>Browse latest openings posted by top companies</p>
        <input
          placeholder="Search by title, company or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '500px', padding: '12px 16px',
            border: '1px solid #ccc', borderRadius: '8px', fontSize: '15px',
            marginTop: '12px'
          }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading jobs...</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No jobs found.</p>
      ) : (
        filtered.map(job => <JobCard key={job._id} job={job} />)
      )}
    </div>
  );
}