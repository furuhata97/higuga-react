import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import RegisterBackground from '../../assets/register-background.jpg';

export const Container = styled.div`
  height: 100%;
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
  height: 100%;
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
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
  width: 80%;
  height: 100%;

  img {
    max-width: 200px;
    /* margin-top: 200px; */

    @media (max-width: 550px) {
      margin-top: 200px;
    }

    @media (max-width: 450px) and (max-height: 600px) {
      margin-top: 250px;
    }

    @media (max-width: 411px) {
      margin-top: 100px;
    }

    @media (max-width: 375px) {
      margin-top: 250px;
    }

    @media (max-width: 350px) {
      margin-top: 300px;
    }

    @media (max-width: 320px) {
      margin-top: 400px;
    }

    @media (max-width: 280px) and (max-height: 653px) {
      margin-top: 200px;
    }
  }

  animation: ${appearFromRight} 1s;

  form {
    width: 100%;
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
    margin-bottom: 12px;
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
  background: url(${RegisterBackground}) no-repeat center;
  background-size: cover;
`;

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
`;
