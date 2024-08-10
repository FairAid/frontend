import React, { useReducer } from 'react';
import { useAuthContext } from '../Auth/AuthProvider';
import AdminPage from './AdminPage';
import UserPage from './UserPage';

const Profile = () => {
  const { user, signer } = useAuthContext();

  const adminAddress = '0x803752055A2499E7F2e25F90937c89e685dc01db';

  return user === adminAddress ? <AdminPage signer={signer}/> : <UserPage signer={signer} user={user}/>;
};

export default Profile;
