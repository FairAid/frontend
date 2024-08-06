import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Offices from './components/Offices';
import VerifyID from './components/VerifyID';
import Profile from './components/Profile/Profile';
import Navbar from './components/Navbars/Navbar';
import NotAuthNavbar from './components/Navbars/AuthNavbar';
import { AuthProvider, useAuthContext } from './components/Auth/AuthProvider';
import PrivateRoute from './components/Auth/PrivateRoute';
import MetaMask from './MetaMask';

const AppRoutes = () => {
  const { auth } = useAuthContext();

  return (
    <>
      {auth ? <NotAuthNavbar /> : <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="offices" element={<Offices />} />
        <Route path="verifyID" element={<VerifyID />} />
        <Route path="connect" element={<MetaMask />} /> {/* Add this route */}
        <Route
          path="/profile"
          element={(
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          )}
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter basename="/">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;