import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { SearchProvider } from './search';
import { CartProvider } from './cart';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      <SearchProvider>
        <CartProvider>{children}</CartProvider>
      </SearchProvider>
    </ToastProvider>
  </AuthProvider>
);

export default AppProvider;
