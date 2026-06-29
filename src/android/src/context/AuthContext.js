import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from '../api/authApi';

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

// atob is not available in React Native — use this polyfill
function atob(input) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = input.replace(/=+$/, '');
  let output = '';
  if (str.length % 4 === 1) return '';
  for (let bc = 0, bs = 0, buffer, i = 0; (buffer = str.charAt(i++)); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)))) : 0) {
    buffer = chars.indexOf(buffer);
  }
  return output;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('token').then((stored) => {
      if (stored) {
        setToken(stored);
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsOwner(false);
      setIsLoading(false);
      return;
    }

    const decoded = decodeJwt(token);
    if (!decoded?.id) {
      setIsLoading(false);
      return;
    }

    getUserById(decoded.id)
      .then((userData) => {
        setUser(userData);
        setIsOwner(!!userData.isRestaurantOwner);
      })
      .catch(() => {
        AsyncStorage.removeItem('token');
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  async function signIn(jwt) {
    await AsyncStorage.setItem('token', jwt);
    setToken(jwt);
  }

  async function signOut() {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsOwner(false);
  }

  return (
    <AuthContext.Provider value={{ token, user, isOwner, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
