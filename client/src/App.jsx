import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import EditorPage from "./EditorPage";
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      <Route path="/room/:roomId" element={<ProtectedRoute><EditorPage /></ProtectedRoute>}/>
      <Route path="/signup" element={<AuthPage mode='signup'/>}/>
      <Route path="/login" element={<AuthPage mode='login'/>}/>
    </Routes>
  );
}

export default App;
