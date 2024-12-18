import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './App.css';
import { isEmpty } from 'lodash';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [loginStatus, setLoginStatus] = useState(false);

  const getAllUsers = async () => {
	console.log("getAllUsers called");
    try {
      const data = await axios.get(`${API_URL}/user/authenticated/getAll`, { withCredentials: true });
    } catch (e) {
      console.log(`error@getAllUsers function: ${e}`);
    }
  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
	console.log("handleGoogleLoginSuccess called");
    const idToken = credentialResponse.credential; 
    if (!isEmpty(idToken)) {
      const bodyObject = { authId: idToken };
      try {
        await axios.post(`${API_URL}/login/user`, bodyObject, { withCredentials: true });
        setLoginStatus(true);
      } catch (e) {
        console.log(`error@handleGoogleLoginSuccess function: ${e}`);
      }
    }
  }

  const logout = async () => {
    console.log("logout called");
    try {
      await axios.get(`${API_URL}/logout/user`, { withCredentials: true });
      setLoginStatus(false);
    } catch (e) {
      console.log(`error@logout function: ${e}`);
    }
}

  useEffect(() => {
    async function getStatus() {
	  console.log("getStatus called");
      try {
        const data = await axios.get(`${API_URL}/user/checkLoginStatus`, { withCredentials: true });
        if (data.status === 200 && data.data.success === true) {
          console.log("loginStatus set to true !!");
          setLoginStatus(true);
        } else if (data.status === 200 && data.data.success === false) {
          console.log("loginStatus set to false");
          setLoginStatus(false);
        }
      } catch (e) {
        console.log(`error@getStatus function: ${e}`);
        setLoginStatus(false);
      }
    }
    getStatus();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Google Login React/Node/Express</p>
      </header>
      <div>
		{loginStatus ? 
		<>
		<button onClick={logout}>Logout</button>
		<button onClick={getAllUsers}>Get All Users in db</button>
		</>
		: 
		<GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            console.log('Login Failed');
          }}
        />
		}
      </div>
    </div>
  );
}

export default App;