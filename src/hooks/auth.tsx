import React, { createContext, useState, useCallback, useContext } from 'react';
import api from '../services/api';

interface Address {
  id: string;
  zip_code: string;
  city: string;
  address: string;
  is_main: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  addresses: Address[];
  phone_number: string;
  is_admin: boolean;
}

interface AuthState {
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextState {
  address: Address;
  user: User | null;
  chooseAddress(add: Address): void;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const user = localStorage.getItem('@Higuga:user');

    if (user) {
      return { user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const [address, setAddress] = useState<Address>(() => {
    const localAddress = localStorage.getItem('@Higuga:address');

    if (localAddress) {
      return JSON.parse(localAddress);
    }
    return {} as Address;
  });

  const chooseAddress = useCallback((chosenAddress: Address) => {
    setAddress(chosenAddress);
    localStorage.setItem('@Higuga:address', JSON.stringify(chosenAddress));
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const csrf_token = await api.get('sessions/csrf-token');

    api.defaults.headers['X-CSRF-Token'] = csrf_token.data.csrfToken;

    const response = await api.post('sessions', {
      email,
      password,
    });

    const { user } = response.data;

    localStorage.setItem('@Higuga:user', JSON.stringify(user));
    const userAddress = user.addresses.find((add: Address) => add.is_main);
    localStorage.setItem('@Higuga:address', JSON.stringify(userAddress));

    setData({ user });
    setAddress(userAddress);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api.delete('/sessions/logout');
      localStorage.removeItem('@Higuga:user');
      localStorage.removeItem('@Higuga:address');
    } catch (error) {
      throw new Error('Erro ao realizar logout');
    }

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback((user: User) => {
    localStorage.setItem('@Higuga:user', JSON.stringify(user));
    setData({
      user,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        address,
        chooseAddress,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
