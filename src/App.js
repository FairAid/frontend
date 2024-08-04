import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Offices from './components/Offices';
import VerifyID from './components/VerifyID';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import NotAuthNavbar from './components/AuthNavbar';
import { AuthProvider, useAuthContext } from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
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