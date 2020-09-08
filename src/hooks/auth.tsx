import React, { createContext, useState, useCallback, useContext } from 'react';
import { decode } from 'jsonwebtoken';
import { isBefore, fromUnixTime } from 'date-fns';
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
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface ITokenPayload {
  payload: {
    exp: number;
  };
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
    const token = localStorage.getItem('@Higuga:token');
    const user = localStorage.getItem('@Higuga:user');

    if (token && user) {
      const decoded = decode(token, { complete: true });
      const dateNow = new Date();
      const { payload } = decoded as ITokenPayload;
      if (isBefore(fromUnixTime(payload.exp), dateNow)) return {} as AuthState;
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const [address, setAddress] = useState<Address>(() => {
    const localAddress = localStorage.getItem('@Higuga:address');
    console.log(localAddress);

    if (localAddress) {
      return JSON.parse(localAddress);
    }
    return {} as Address;
  });

  const chooseAddress = useCallback((chosenAddress: Address) => {
    setAddress(chosenAddress);
    localStorage.setItem('Higuga:address', JSON.stringify(chosenAddress));
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@Higuga:token', token);
    localStorage.setItem('@Higuga:user', JSON.stringify(user));
    const userAddress = user.addresses.find((add: Address) => add.is_main);
    localStorage.setItem('@Higuga:address', JSON.stringify(userAddress));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Higuga:token');
    localStorage.removeItem('@Higuga:user');
    localStorage.removeItem('@Higuga:address');

    // localStorage.removeItem('@Higuga:cartProducts');
    // localStorage.removeItem('@Higuga:cartQuantity');
    // localStorage.removeItem('@Higuga:paymentMethod');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@Higuga:user', JSON.stringify(user));
      const { token } = data;
      setData({
        token,
        user,
      });
      api.defaults.headers.authorization = `Bearer ${token}`;
    },
    [data],
  );

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
