import styled from 'styled-components';

export const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #333;

  height: 95%;
  color: #333;

  overflow: scroll;
`;

export const FormContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

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
