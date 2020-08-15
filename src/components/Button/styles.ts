import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #402e32;
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

  & + button {
    margin-left: 16px;
  }

  &:hover {
    background: ${shade(0.3, '#402e32')};
  }
  height: 86px;
`;
