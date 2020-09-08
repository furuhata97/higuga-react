import React from 'react';
import {
  RouteProps as ReactRouteProps,
  Route as ReactRoute,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

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
  const { user } = useAuth();
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

  // if (isPrivate === false && !!user === false) {
  //   return <ReactRoute {...rest} render={() => <Component />} />;
  // }
  // if (isPrivate === true && !!user === true) {
  //   if (isAdmin === true && user?.is_admin === true) {
  //     return <ReactRoute {...rest} render={() => <Component />} />;
  //   }
  //   return (
  //     <ReactRoute
  //       {...rest}
  //       render={({ location }) => (
  //         <Redirect to={{ pathname: 'dashboard', state: { from: location } }} />
  //       )}
  //     />
  //   );
  // }
  // if (isPrivate === false && !!user === true) {
  //   return (
  //     <ReactRoute
  //       {...rest}
  //       render={({ location }) => (
  //         <Redirect
  //           to={{
  //             pathname: 'dashboard',
  //             state: { from: location },
  //           }}
  //         />
  //       )}
  //     />
  //   );
  // }
  // return (
  //   <ReactRoute
  //     {...rest}
  //     render={({ location }) => (
  //       <Redirect
  //         to={{
  //           pathname: '/',
  //           state: { from: location },
  //         }}
  //       />
  //     )}
  //   />
  // );
};

export default Route;
