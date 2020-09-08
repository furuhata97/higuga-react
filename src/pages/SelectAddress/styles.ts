import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const AddressContainer = styled.div`
  height: 100%;
  background: #fff5ea;
  flex: 1;
  color: #333;
  h2 {
    margin: 12px;
  }

  > div {
    display: flex;
    flex-flow: row wrap;
    /* flex: 1; */
    height: auto;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
  }
`;

export const AddressCard = styled.div`
  background: #fff;
  border-radius: 10px;
  margin: 12px 8px;
  border: 0;
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.16);
  height: 340px;
  width: 250px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const MainAddress = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #096faa;
  color: #fff;
  min-height: 32px;
  padding: 12px;
  border-radius: 8px 8px 0 0;
`;

export const AddressDetail = styled.div`
  margin: 12px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  flex-grow: 1;
  text-align: left;

  p {
    & + p {
      margin-top: 4px;
    }
  }

  @media (max-width: 420px) {
    font-size: 11px;
  }
`;

export const AddressButtons = styled.div`
  display: flex;
  flex-direction: row;
  margin: 12px;

  button {
    border: 0;
    background: transparent;
    font-size: 13px;
    padding: 4px;
    color: #0066c0;

    &:hover {
      color: ${shade(0.5, '#0066c0')};
    }

    & + button {
      border-left: 1px solid #0066c0;
    }
  }

  @media (max-width: 420px) {
    font-size: 12px;
  }
`;
