import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id }            = useParams();
  const { user, token }   = useAuth();
  const [job, setJob]     = useState(null);
  const [msg, setMsg]     = useState('');
  const [resume, setResume]         = useState(null);
  const [applying, setApplying]     = useState(false);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/jobs/${id}`)
      .then(res => setJob(res.data));
  }, [id]);

  useEffect(() => {
    if (user?.role === 'recruiter' && token) {
      axios.get(`http://localhost:5000/api/jobs/${id}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setApplicants(res.data)).catch(() => {});
    }
  }, [user, token, id]);

  const handleApply = async () => {
    if (!resume) return setMsg('Please select your resume (PDF)');
    const formData = new FormData();
    formData.append('resume', resume);
    setApplying(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/jobs/${id}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error applying');
    }
    setApplying(false);
  };

  if (!job) return <p style={{ textAlign: 'center', marginTop: '60px' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '32px', border: '1px solid #e0e0e0', borderRadius: '12px', background: 'white' }}>

      <h2 style={{ color: '#1a1a2e' }}>{job.title}</h2>
      <p style={{ color: '#555', fontSize: '16px' }}>
        {job.company} | {job.location}
      </p>

      <div style={{ display: 'flex', gap: '10px', margin: '12px 0 20px', flexWrap: 'wrap' }}>
        <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>
          {job.type}
        </span>
        {job.salary && (
          <span style={{ color: '#16a34a', fontWeight: '500' }}>
            {job.salary}
          </span>
        )}
        <span style={{ color: '#888', fontSize: '13px' }}>
          Posted by: {job.postedBy?.name}
        </span>
      </div>

      <hr style={{ margin: '20px 0' }} />
      <h4 style={{ marginBottom: '10px' }}>Job Description</h4>
      <p style={{ lineHeight: '1.7', color: '#444', whiteSpace: 'pre-wrap' }}>
        {job.description}
      </p>
      <hr style={{ margin: '24px 0' }} />

      {user?.role === 'jobseeker' && (
        <div>
          <h4 style={{ marginBottom: '12px' }}>Apply for this Job</h4>
          <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontSize: '14px' }}>
            Upload Resume (PDF only) *
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={e => setResume(e.target.files[0])}
            style={{ display: 'block', marginBottom: '16px', fontSize: '14px' }}
          />
          {resume && (
            <p style={{ fontSize: '13px', color: '#16a34a', marginBottom: '12px' }}>
              Selected: {resume.name}
            </p>
          )}
          {msg && (
            <p style={{ color: msg.includes('success') ? '#16a34a' : 'red', marginBottom: '12px', fontWeight: '500' }}>
              {msg}
            </p>
          )}
          <button
            onClick={handleApply}
            disabled={applying}
            style={{
              background: applying ? '#888' : '#1a1a2e',
              color: 'white',
              padding: '12px 28px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              cursor: applying ? 'not-allowed' : 'pointer'
            }}
          >
            {applying ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      )}

      {user?.role === 'recruiter' && (
        <div>
          <h4 style={{ marginBottom: '16px' }}>Applicants ({applicants.length})</h4>
          {applicants.length === 0 ? (
            <p style={{ color: '#888' }}>No applications yet.</p>
          ) : (
            applicants.map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: '600' }}>{a.user?.name}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{a.user?.email}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                    Applied: {new Date(a.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={`http://localhost:5000/uploads/${a.resumePath}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#4f46e5',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '13px'
                  }}
                >
                  View Resume
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {!user && (
        <p style={{ color: '#888' }}>
          Please <a href="/login">login</a> as a job seeker to apply.
        </p>
      )}

    </div>
  );
}