import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import PostPage from "./pages/PostPage";
import SearchPage from "./pages/SearchPage";



// Protected Route
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/messages" element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />
        <Route path="/post/:id" element={
          <ProtectedRoute>
            <PostPage />
          </ProtectedRoute>
        } />

      <Route path="/search" element={
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}