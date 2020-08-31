import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import Login from '../pages/LogIn';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import Cart from '../pages/Cart';
import OrderResume from '../pages/OrderResume';
import Orders from '../pages/Orders';
import Addresses from '../pages/Addresses';
import NewAddress from '../pages/NewAddress';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/cart" component={Cart} />

    <Route path="/profile" isPrivate component={Profile} />
    <Route path="/edit-profile" isPrivate component={EditProfile} />
    <Route path="/order_resume" isPrivate component={OrderResume} />
    <Route path="/my-orders" isPrivate component={Orders} />
    <Route path="/addresses" isPrivate component={Addresses} />
    <Route path="/new-address" isPrivate component={NewAddress} />
  </Switch>
);

export default Routes;
