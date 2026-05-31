import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: '#1a1a2e', color: 'white',
      padding: '14px 30px', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: '22px', textDecoration: 'none' }}>
        🧳 HireHub
      </Link>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontSize: '14px', opacity: 0.8 }}>Hi, {user.name}</span>
            {user.role === 'recruiter' && (
              <Link to="/post-job" style={linkStyle}>Post Job</Link>
            )}
            <button onClick={handleLogout} style={btnStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = { color: 'white', textDecoration: 'none', fontSize: '15px' };
const btnStyle  = {
  background: '#e94560', color: 'white', border: 'none',
  padding: '8px 16px', borderRadius: '6px', cursor: 'pointer'
};