import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  color: #333;
  overflow: scroll;

  h3 {
    margin-bottom: 8px;
  }

  > div {
    width: 100%;
  }
`;

export const ProductCard = styled.div`
  display: flex;
  width: 100%;
  background: #fff;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-right: 2px;

  div {
    display: flex;
    max-width: 150px;
    min-width: 64px;
    min-height: 32px;
    text-align: center;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 80px;
    height: 80px;
  }

  button {
    background: transparent;
    border: 0;
  }
`;

export const Total = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SubmitButton = styled.button`
  display: flex;
  padding: 8px;
  color: #f2f2f2;
  width: 120px;
  border: 0;
  border-radius: 8px;
  background: #a4aa09;
  margin-left: auto;

  &:hover {
    background: ${shade(0.2, '#a4aa09')};
  }
`;

export const AddProduct = styled.button`
  width: 100%;
  border: 0;
  background: #096faa;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f2f2f2;

  &:hover {
    background: ${shade(0.2, '#096FAA')};
  }
`;

export const Camera = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CameraButtons = styled.div`
  display: flex;
  justify-content: space-evenly;

  button + button {
    margin-left: 8px;
  }
`;

export const CancelButton = styled.button`
  width: 120px;
  border: 0;
  border-radius: 10px;
  background: #ff1919;
  padding: 8px;
  color: #f2f2f2;

  &:hover {
    background: ${shade(0.2, '#FF1919')};
  }
`;

export const DigitButton = styled.button`
  width: 120px;
  border: 0;
  border-radius: 10px;
  background: #3ace3a;
  padding: 8px;
  color: #f2f2f2;

  &:hover {
    background: ${shade(0.2, '#3ace3a')};
  }
`;

export const FormContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff5ea;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
