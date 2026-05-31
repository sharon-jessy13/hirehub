import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import JobDetail from './pages/JobDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/post-job"  element={<PostJob />} />
            <Route path="/jobs/:id"  element={<JobDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}