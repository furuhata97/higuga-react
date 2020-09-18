import styled, { keyframes } from 'styled-components';

import { shade } from 'polished';

export const Container = styled.div`
  height: 100%;
  display: flex;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
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

  img {
    height: 210px;
    width: 210px;
  }

  animation: ${appearFromLeft} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

  /* O > diz para estilizar somente os elementos que vierem diretamente dentro de
  outro. Neste caso, estilizar somente o a que está dentro de content. Dessa forma
  o a dentro do form não sofre alteração */
  > a {
    color: #ff9000;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.3, '#ff9000')};
    }
  }
`;

export const Background = styled.div`
  /* Faz ocupar todo o espaço disponível menos os 700px de content */
  flex: 1;
  background: #ff9000;
  background-size: cover;
`;
