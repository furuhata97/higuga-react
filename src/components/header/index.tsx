import React, { HTMLAttributes, useState, useCallback } from 'react';

import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiArrowRightCircle,
  FiShoppingCart,
  FiUser,
  FiExternalLink,
} from 'react-icons/fi';
import { slide as Menu } from 'react-burger-menu';

import { useAuth } from '../../hooks/auth';

import {
  Header,
  HeaderContent,
  SearchBar,
  LoginButton,
  LoginText,
  CartButton,
  CircleCounter,
  UserProfileButton,
  ExitButton,
  ExitContainer,
  ExitButtonNav,
} from './styles';

import logo from '../../assets/higugaLogo.svg';
import { useSearch } from '../../hooks/search';
import { useCart } from '../../hooks/cart';

type HeaderProps = HTMLAttributes<HTMLElement>;

const HeaderNav: React.FC<HeaderProps> = () => {
  const { signOut, user } = useAuth();
  const { quantity, cleanCart } = useCart();
  const [isFocused, setIsFocused] = useState(false);
  const [searchedProduct, setSearchedProduct] = useState('');
  const { setSearchWord } = useSearch();

  const handleSignOut = useCallback(() => {
    cleanCart();
    signOut();
  }, [signOut, cleanCart]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleSubmit = useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      setSearchWord(searchedProduct);
    },
    [searchedProduct, setSearchWord],
  );

  return (
    <Header>
      <HeaderContent>
        <Menu>
          <Link to={user ? '/profile' : '/login'} className="menu-item">
            {user ? <FiUser /> : <FiArrowRightCircle />}
            {user ? <span>Perfil</span> : <span>Entrar ou criar conta</span>}
          </Link>
          {user ? (
            <ExitButtonNav>
              <button type="button" onClick={handleSignOut}>
                <FiExternalLink />
                <span>Sair</span>
              </button>
            </ExitButtonNav>
          ) : null}
        </Menu>
        <img src={logo} alt="Logo do Higuga" />
        <SearchBar isFocused={isFocused}>
          <form onSubmit={handleSubmit}>
            <input
              name="product_name"
              type="text"
              placeholder="O que você procura?"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              value={searchedProduct}
              onChange={(e) => setSearchedProduct(e.target.value)}
            />
            <button type="submit">
              <FiSearch />
            </button>
          </form>
        </SearchBar>
        {user ? (
          <UserProfileButton>
            <Link to="/profile">
              <p>Olá,</p>
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          </UserProfileButton>
        ) : (
          <LoginButton>
            <Link to="login">
              <FiArrowRightCircle />
              <LoginText>
                <p>Entre ou</p>
                <p>cadastre&#8209;se</p>
              </LoginText>
            </Link>
          </LoginButton>
        )}
        {user ? (
          <ExitContainer>
            <ExitButton type="button" onClick={handleSignOut}>
              Sair
            </ExitButton>
          </ExitContainer>
        ) : null}
        <CartButton>
          <Link to="/cart">
            <FiShoppingCart />
            <CircleCounter>
              <span>{quantity}</span>
            </CircleCounter>
          </Link>
        </CartButton>
      </HeaderContent>
    </Header>
  );
};

export default HeaderNav;
