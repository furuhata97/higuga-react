import styled from 'styled-components';
import DatePicker from 'react-datepicker';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .pagination {
    margin: 1rem auto;
    list-style: none;
    display: flex;
    justify-content: space-evenly;
    width: 50%;

    @media (max-width: 450px) {
      width: 100%;
      font-size: 11px;
    }
  }
  .active {
    border: 1px solid black;
    border-radius: 10%;
    padding: 0 8px;
    outline: none;
    background: rgba(170, 67, 0, 0.84);
    color: #fff5ea;
  }

  ul {
    cursor: pointer;
    color: black;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f2f2f2;
  color: #333;

  p {
    margin: 8px 0;
  }
`;

export const Head = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
`;

export const StyledDatePicker = styled(DatePicker)`
  margin-top: 8px;
  border-radius: 8px;
  height: 32px;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;

  span {
    width: 100%;
    text-align: right;
    padding-right: 8px;
  }
`;

export const ProductRemovalContainer = styled.div`
  display: flex;
  width: 100%;
  color: #333;
  background: #fff;
  flex-direction: column;

  & + div {
    border-top: 1px solid #ccc;
  }

  > div {
    display: flex;
    justify-content: space-between;
    padding: 8px;

    span {
      margin-left: 4px;
    }
  }
`;
