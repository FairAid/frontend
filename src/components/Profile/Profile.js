import React from 'react';
import { useAuthContext } from '../Auth/AuthProvider';
import AdminPage from './AdminPage';
import UserPage from './UserPage';

const Profile = () => {
  const { user, signer } = useAuthContext();
  
  const adminAddress = '0xfd1F5B5F618313E19fA0eA3eEFAb422337AF4f99';

  return user === adminAddress ? <AdminPage signer={signer}/> : <UserPage signer={signer} user={user}/>;
};

export default Profile;
