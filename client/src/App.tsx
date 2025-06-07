import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AppShell from './layout/AppShell';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} /> {/*Toast Messages*/}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
         <Route
          path="/dashboard"
          element={
            <AppShell>
              <Dashboard />
            </AppShell>
          }
        />
   
      </Routes>
    </BrowserRouter>
  );
}

export default App;
