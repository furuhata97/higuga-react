import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import Login from '../pages/LogIn';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import Cart from '../pages/Cart';
import OrderResume from '../pages/OrderResume';
import Orders from '../pages/Orders';
import Addresses from '../pages/Addresses';
import NewAddress from '../pages/NewAddress';
import EditAddress from '../pages/EditAddress';
import SelectAddress from '../pages/SelectAddress';
import AdminArea from '../pages/AdminArea';
import ProfitSales from '../pages/ProfitSales';
import ProfitOrders from '../pages/ProfitOrders';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/forgot" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />
    <Route path="/cart" component={Cart} />

    <Route path="/profile" isPrivate component={Profile} />
    <Route path="/edit-profile" isPrivate component={EditProfile} />
    <Route path="/order-resume" isPrivate component={OrderResume} />
    <Route path="/my-orders" isPrivate component={Orders} />
    <Route path="/addresses" isPrivate component={Addresses} />
    <Route path="/select-address" isPrivate component={SelectAddress} />
    <Route path="/new-address" isPrivate component={NewAddress} />
    <Route path="/update-address/:id" isPrivate component={EditAddress} />
    <Route path="/admin" isPrivate isAdmin component={AdminArea} />
    <Route path="/profit-sales" isPrivate isAdmin component={ProfitSales} />
    <Route path="/profit-orders" isPrivate isAdmin component={ProfitOrders} />
  </Switch>
);

export default Routes;
