import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import PasswordPage from './pages/PasswordPage';
import HomePage from './pages/HomePage';
import MusicPage from './pages/MusicPage';
import LetterPage from './pages/LetterPage';
import GalleryPage from './pages/GalleryPage';
import GiftPage from './pages/GiftPage';
import PhotoboothPage from './pages/PhotoboothPage';
import WishlistPage from './pages/WishlistPage';
import AdminPage from './pages/AdminPage';

function ProtectedRoute({ children }) {
  const isUnlocked = sessionStorage.getItem('love_unlocked') === 'true';
  return isUnlocked ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PasswordPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/music" element={<ProtectedRoute><MusicPage /></ProtectedRoute>} />
        <Route path="/letter" element={<ProtectedRoute><LetterPage /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
        <Route path="/gift" element={<ProtectedRoute><GiftPage /></ProtectedRoute>} />
        <Route path="/photobooth" element={<ProtectedRoute><PhotoboothPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}
