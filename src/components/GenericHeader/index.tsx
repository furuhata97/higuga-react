import React, { useCallback } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

import { useHistory } from 'react-router-dom';
import logo from '../../assets/higugaLogo.svg';

import { Header } from './styles';

interface IHeaderProps {
  back: string;
  text: string;
}

const GenericHeader: React.FC<IHeaderProps> = ({ back, text }) => {
  const history = useHistory();

  const handleBackClick = useCallback(() => {
    history.push(back);
  }, [history, back]);

  return (
    <Header>
      <button type="button" onClick={handleBackClick}>
        <FiArrowLeft size={24} />
        {text}
      </button>
      <img src={logo} alt="Logo do Higuga" />
    </Header>
  );
};

export default GenericHeader;
