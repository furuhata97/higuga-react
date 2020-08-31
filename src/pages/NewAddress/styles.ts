import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const FormContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff5ea;

  h2 {
    margin-bottom: 8px;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    div {
      & + div {
        margin-top: 8px;
      }
    }
  }
`;
