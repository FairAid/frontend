import { React, useState, useEffect } from 'react';
import { useAuthContext } from '../Auth/AuthProvider';
import AdminPage from './AdminPage';
import UserPage from './UserPage';

const Profile = () => {
  const { user, signer } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const fetchJsonFromIPFS = async () => {
      try {
        const response = await fetch('https://ipfs.io/ipfs/QmTco55QQz7wQofKjTrFWLBHKxNqPLqR9qNEpmt2X2nYzx');
        const jsonData = await response.json();
        const isAdmin = Object.values(jsonData).includes(user);
        setIsAdmin(isAdmin);
      } catch (error) {
        alert('Error fetching JSON from IPFS:', error);
      }
    };

    fetchJsonFromIPFS();
    
  }, [user]);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <AdminPage signer={signer} /> : <UserPage signer={signer} user={user} />;
};

export default Profile;
