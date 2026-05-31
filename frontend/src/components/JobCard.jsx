import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0', borderRadius: '10px',
      padding: '20px', marginBottom: '16px',
      background: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3 style={{ margin: '0 0 4px', color: '#1a1a2e' }}>{job.title}</h3>
          <p style={{ margin: '0 0 8px', color: '#555', fontSize: '15px' }}>
            🏢 {job.company} &nbsp;|&nbsp; 📍 {job.location}
          </p>
          <span style={{
            background: '#eef2ff', color: '#4f46e5',
            padding: '3px 10px', borderRadius: '20px', fontSize: '13px'
          }}>
            {job.type}
          </span>
          {job.salary && (
            <span style={{ marginLeft: '8px', fontSize: '13px', color: '#16a34a', fontWeight: '500' }}>
              💰 {job.salary}
            </span>
          )}
        </div>
        <Link to={`/jobs/${job._id}`} style={{
          background: '#1a1a2e', color: 'white',
          padding: '8px 18px', borderRadius: '6px',
          textDecoration: 'none', fontSize: '14px', whiteSpace: 'nowrap'
        }}>
          View Job
        </Link>
      </div>
    </div>
  );
}