import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import signInBackground from '../../assets/login-background.jpg';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 950px;
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromLeft} 1s;

  > img {
    width: 100%;
    max-width: 700px;
    padding: 0 4px;
  }

  form {
    width: 80%;
    padding-top: 16px;
    text-align: center;

    a {
      color: #d99e81;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#D99E81')};
      }
    }
  }

  > a {
    color: #fff;
    display: flex;
    margin-top: 50px;
    text-decoration: none;
    transition: color 0.2s;
    align-items: center;
    justify-content: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.3, '#fff')};
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackground}) no-repeat center;
  background-size: cover;
`;

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
`;
