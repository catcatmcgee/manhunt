import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ButtonToHome } from '../components/Buttons';

export type UserData = {
  username: string;
  email: string;
  authId: string;
  gamesPlayed: number;
  gamesWon: number;
  killsConfirmed: number;
  // Add other user data properties as needed
};

const ProfilePage: React.FC<{ userData: UserData | null }> = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>(`/Users/${user?.sub}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, []);

  console.log(userData, 'USeRdatA');

  if (!user) {
    return null;
  }

  return (
    <div
      className='content-layout'
      style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#fcf18d',
        minHeight: '100vh', // Fill the entire screen vertically
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#6e6b8c',
        fontWeight: 'bold',
      }}
    >
      <h1 id='page-title' className='content__title'>
        Profile
      </h1>
      <div className='content__body'>
        <p id='page-description'>
          <span></span>
          <span>
            <strong></strong>
          </span>
        </p>
        <div className='profile-grid'>
          <div
            className='profile__header'
            style={{
              display: 'flex',
              margin: 'auto',
              width: '100%',
              backgroundColor: '#fcf18d',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ marginRight: '20px' }}>
              <img
                src={user.picture}
                alt='Profile'
                className='profile__avatar'
              />
            </div>
            <div>
              <h2 className='profile__title'>{user.name}</h2>
              <span className='profile__description'>
                {user.email}
                {/* <ButtonToUpdateEmail /> */}
              </span>
            </div>
          </div>
          <div className='profile__details'>
            <h2>Games Played: {userData?.gamesPlayed}</h2>
            <h2>Games Won: {userData?.gamesWon}</h2>
            <h2>Kills Confirmed: {userData?.killsConfirmed}</h2>
            {/* <h2>userData from database</h2>
            <p>{JSON.stringify(userData, null, 2)}</p> */}
            <ButtonToHome />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
