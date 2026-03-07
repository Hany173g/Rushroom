import { Navigate, Route, Routes } from 'react-router-dom'
import AuthCallbackPage from './pages/AuthCallback'
import CompleteProfilePage from './pages/CompleteProfile'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import ProfilePage from './pages/Profile'
import ProtectedRoute from './routes/ProtectedRoute'
import { isAuthed } from './lib/auth'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/complete-profile" element={
        <ProtectedRoute>
          <CompleteProfilePage />
        </ProtectedRoute>
      } />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to={isAuthed() ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App
