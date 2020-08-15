import styled from 'styled-components';
import { shade, lighten } from 'polished';

import profileBackground from '../../assets/profile_background.jpg';
import profileMobileBackground from '../../assets/profile_mobile_background.jpg';

export const Background = styled.div`
  background: url(${profileBackground}) no-repeat center;
  background-size: cover;
  flex: 1;

  @media (max-width: 640px) and (orientation: portrait) {
    background: url(${profileMobileBackground}) no-repeat center;
  }
`;

export const Container = styled.div`
  height: 100%;
  background: rgba(170, 67, 0, 0.5);
`;

export const Header = styled.header`
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-height: 60px;
`;

export const ReturnButton = styled.button`
  background: transparent;
  border: 0;

  svg {
    width: 30px;
    height: 30px;
    color: white;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#fff')};
    }
  }
`;

export const LeaveButton = styled.button`
  background: #aa2727;
  color: white;
  border: 0;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background: ${shade(0.2, '#aa2727')};
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  h2 {
    margin-bottom: 16px;
  }

  form {
    width: 100%;
    max-width: 350px;
    margin: 4px;
  }
`;

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
`;

export const SaveButton = styled.button`
  background: #3b8d4d;
  border-radius: 50px;
  height: 100%;
  max-height: 60px;
  border: 0;
  padding: 0 16px;
  color: #fff;
  width: 100%;
  max-width: 185px;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.3, '#3B8D4D')};
  }
  height: 86px;
`;

export const AdminArea = styled.button`
  background: #2e8ca9;
  border-radius: 15px;
  height: 100%;
  max-height: 60px;
  border: 0;
  padding: 0 16px;
  color: #fff;
  width: 100%;
  max-width: 185px;
  font-weight: 300;
  margin-top: 16px;
  transition: background-color 0.2s;
  position: relative;
  top: -120px;
  left: 0;

  @media (max-width: 550px) {
    top: -50px;
  }

  &:hover {
    background: ${shade(0.3, '#2E8CA9')};
  }
  height: 86px;
`;

export const ButtonPassword = styled.button`
  height: 50px;
  width: 150px;
  color: white;
  border: 0;
  border-radius: 10px;
  background: #1c0c03;
  margin-top: 12px;

  &:hover {
    background: ${lighten(0.1, '#1c0c03')};
  }
`;
