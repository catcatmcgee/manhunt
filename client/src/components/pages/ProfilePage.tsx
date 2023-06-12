import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/Users/${user.sub}`);
          setUserData(response.data);
          console.log(response);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated, user]);


  if (!user) {
    return null;
  }

  return (
    <div className="content-layout">
      <h1 id="page-title" className="content__title">
        Profile Page
      </h1>
      <div className="content__body">
        <p id="page-description">
          <span>
            You can use the <strong>ID Token</strong> to get the profile
            information of an authenticated user.
          </span>
          <span>
            <strong>Only authenticated users can access this page.</strong>
          </span>
        </p>
        <div className="profile-grid">
          <div className="profile__header">
            <img
              src={user.picture}
              alt="Profile"
              className="profile__avatar"
            />
            <div className="profile__headline">
              <h2 className="profile__title">{user.name}</h2>
              <span className="profile__description">{user.email}</span>
            </div>
          </div>
          <div className="profile__details">
            <h2>Decoded ID Token</h2>
            <p>{JSON.stringify(user, null, 2)}</p>
            <h2>userData from axios request to backend</h2>
            <p>{JSON.stringify(userData, null, 2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
