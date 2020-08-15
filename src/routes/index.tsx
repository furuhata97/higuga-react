import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import Login from '../pages/LogIn';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Cart from '../pages/Cart';
import OrderResume from '../pages/OrderResume';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/cart" component={Cart} />

    <Route path="/profile" isPrivate component={Profile} />
    <Route path="/order_resume" isPrivate component={OrderResume} />
  </Switch>
);

export default Routes;
