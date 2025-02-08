import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/authentication/Register';
import LoginForm from './components/authentication/Login';
import HomePage from './components/landing-page/homepage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
