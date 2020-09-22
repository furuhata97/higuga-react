import React, { useState, useEffect } from 'react';
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
  const { user, token, signOut } = useAuth();

  useEffect(() => {
    const checkToken = async (): Promise<void> => {
      if (token && user) {
        api.defaults.headers.authorization = `Bearer ${token}`;
        try {
          const response = await api.get('/sessions/check-token');
          if (response.data.is_admin !== user.is_admin) {
            api.defaults.headers.authorization = '';

            signOut();
            return;
          }
        } catch (error) {
          api.defaults.headers.authorization = '';

          signOut();
        }
      }
    };

    checkToken();
  }, [signOut, token, user]);

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
