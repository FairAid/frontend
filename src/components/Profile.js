import React, { useReducer } from 'react';
import { useAuthContext } from './AuthProvider';
import AdminPage from './AdminPage';
import UserPage from './UserPage';

const Profile = () => {
  const { user } = useAuthContext();

  const adminAddress = '0x803752055a2499e7f2e25f90937c89e685dc01db';

  console.log(user);
  return user === adminAddress ? <AdminPage /> : <UserPage />;
};

export default Profile;
