import styled from 'styled-components';
import { lighten } from 'polished';

export const Footer = styled.footer`
  width: 100%;
  position: relative;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(64, 46, 50, 0.8);
`;

export const FooterContent = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  img {
    height: 50px;

    @media (max-width: 395px) {
      height: 30px;
    }

    /* @media (max-width: 320px) {
      height: 25px;
    }

    @media (max-width: 290px) {
      display: none;
    }

    @media (max-width: 395px) {
      margin-left: 45px;
    } */
  }
`;

export const FooterAddress = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  svg {
    margin-left: 5px;
    stroke-width: 1px;
    min-height: 16px;
    min-width: 16px;
  }

  & + div {
    margin-top: 8px;
  }

  p {
    font-size: 12px;
    font-weight: 200;
    margin-left: auto;
    text-align: right;

    @media (max-width: 395px) {
      font-size: 9px;
    }
  }
`;

export const VerticalBar = styled.div`
  margin: 8px;
  border-left: 1px solid ${lighten(0.2, '#402E32')};
  height: 70px;
`;

export const FooterAttendance = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 5px;
    stroke-width: 1px;
    min-height: 16px;
    min-width: 16px;
  }

  & + div {
    margin-top: 8px;
  }

  p {
    font-size: 12px;
    font-weight: 200;
    margin-right: auto;

    @media (max-width: 395px) {
      font-size: 9px;
    }
  }
`;
