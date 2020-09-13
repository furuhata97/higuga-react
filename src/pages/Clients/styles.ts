import styled from 'styled-components';
import { lighten } from 'polished';

export const Container = styled.div`
  color: #333;
`;

export const ClientCard = styled.div`
  width: 100%;
  min-height: 48px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  transition: background-color 0.2s;
  font-size: 11px;

  &:first-child {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    border: 0;
    background: transparent;
    color: #0f0f0f;
    font-size: 11px;

    &:hover {
      color: ${lighten(0.2, '#0f0f0f')};
    }
  }

  > div {
    flex: 5;
    padding-left: 2px;
    margin-top: 4px;
    box-sizing: border-box;

    &:nth-child(1) {
      flex: 5;
    }

    &:nth-child(2) {
      flex: 3;
    }

    &:nth-child(3) {
      flex: 1;
    }

    &:nth-child(4) {
      flex: 1;
    }
  }

  &:hover {
    background-color: #ccc;
  }
`;

export const CardHeader = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  box-sizing: border-box;
  background: #333;
  margin-top: 8px;
  color: #f2f2f2;
  align-items: center;
  font-size: 11px;

  &:first-child {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  > div {
    flex: 5;
    padding-left: 4px;
    padding: 5px;
    box-sizing: border-box;

    &:nth-child(1) {
      flex: 5;
    }

    &:nth-child(2) {
      flex: 3;
    }

    &:nth-child(3) {
      flex: 1;
    }

    &:nth-child(4) {
      flex: 1;
    }
  }
`;
