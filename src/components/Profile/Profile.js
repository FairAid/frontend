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
        console.log("Starting to fetch JSON from IPFS...");

        const response = await fetch('https://amaranth-accepted-hare-424.mypinata.cloud/ipfs/QmbC5CKm3SNETXZM4Ym8vMZqhQDKg3dvi5GPHdGzMiC74J');
        console.log("Fetch response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("Fetched JSON data:", jsonData);

        console.log("User address:", user);
        console.log("JSON keys:", Object.keys(jsonData));

        const isAdmin = Object.keys(jsonData).includes(user);
        setIsAdmin(isAdmin);

      } catch (error) {
        console.error('Error fetching JSON from IPFS:', error);
        alert('Error fetching JSON from IPFS. Check console for details.');
      }
    };

    fetchJsonFromIPFS();
  }, [user]);

  if (isAdmin === null) {
    return <div style={{ padding: "30px" }}>Loading...</div>;
  }

  return isAdmin ? <AdminPage signer={signer} user={user}/> : <UserPage signer={signer} user={user} />;
};

export default Profile;
