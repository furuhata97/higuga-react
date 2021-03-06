/* eslint-disable no-underscore-dangle */

import React, { useEffect } from 'react';
import {
  RouteProps as ReactRouteProps,
  Route as ReactRoute,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';
import api from '../services/api';

interface RouteProps extends ReactRouteProps {
  isPrivate?: boolean;
  isAdmin?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  isAdmin = false,
  component: Component,
  ...rest
}) => {
  const { user, signOut, updateUser } = useAuth();

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (err) => {
      if (!user) {
        return Promise.reject(err);
      }

      const { id } = user;

      const originalReq = err.config;

      if (!err.response?.status) {
        Promise.reject(err);
      }

      if (err.response.status === 401) {
        return new Promise((resolve, reject) => {
          async function refreshToken(): Promise<void> {
            try {
              const response = await api.post(
                `${process.env.REACT_APP_API_URL}/sessions/token`,
                { id },
              );
              updateUser(response.data.user);
              originalReq._retry = true;
              resolve(api(originalReq));
            } catch (error) {
              signOut();
              reject(error);
            }
          }

          refreshToken();
        });
      }

      return Promise.reject(err);
    },
  );

  useEffect(() => {
    const checkToken = async (): Promise<void> => {
      if (user) {
        const csrf_token = await api.get('sessions/csrf-token');

        api.defaults.headers['X-CSRF-Token'] = csrf_token.data.csrfToken;
        const response = await api.get('/sessions/check-token');
        if (!response) {
          signOut();
        }
        if (response.data.is_admin !== user.is_admin) {
          signOut();
        }
      }
    };

    checkToken();
  }, [signOut, user]);

  if (user && isAdmin) {
    // console.log('Estou logado e preciso ser admin');
    if (!user.is_admin) {
      // console.log('Estou logado e não sou admin');
      return (
        <ReactRoute
          {...rest}
          render={({ location }) => (
            <Redirect
              to={{
                pathname: '/',
                state: { from: location },
              }}
            />
          )}
        />
      );
    }
  }

  if (!!user === isPrivate) {
    // console.log('Estou logado? - ', !!user);
    // console.log(' É privado? ', isPrivate);
    // console.log(' Retorno ', !!user === isPrivate);
    return (
      <ReactRoute
        {...rest}
        render={() => {
          return <Component />;
        }}
      />
    );
  }

  if (user && !isPrivate) {
    // console.log(
    //   'Estou logado e a rota não é privada, posso acessa-la, a menos se for login ou register',
    // );
    return (
      <ReactRoute
        {...rest}
        render={({ location }) => {
          if (
            location.pathname === '/login' ||
            location.pathname === '/register'
          ) {
            return (
              <Redirect
                to={{
                  pathname: '/',
                  state: { from: location },
                }}
              />
            );
          }
          return <Component />;
        }}
      />
    );
  }

  return (
    <ReactRoute
      {...rest}
      render={({ location }) => (
        <Redirect
          to={{
            pathname: '/',
            state: { from: location },
          }}
        />
      )}
    />
  );
};

export default Route;
