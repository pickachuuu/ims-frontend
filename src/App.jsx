import './App.css';
import { AuthProvider }  from '../src/context/AuthContext';
import AppRoutes from './components/routes/AppRoutes';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <AuthProvider>
      <AppRoutes/>
    </AuthProvider>
  )
}

export default App
