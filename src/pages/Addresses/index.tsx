import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import FooterNav from '../../components/footer';
import Header from '../../components/GenericHeader';
import {
  Container,
  AddressContainer,
  AddressCard,
  MainAddress,
  AddressDetail,
  AddressButtons,
  NewAddress,
} from './styles';
import { useAuth } from '../../hooks/auth';

interface IAddress {
  id: string;
  zip_code: string;
  city: string;
  address: string;
  is_main: boolean;
}

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (user) {
      const userAddresses = user.addresses.map((a) => a);
      setAddresses(userAddresses);
    }
  }, [user]);

  const handleAddAddress = useCallback(() => {
    history.push('/new-address');
  }, [history]);

  return (
    <>
      <Container>
        <Header back="/profile" text="Voltar" />
        {addresses.length > 0 ? (
          <AddressContainer>
            <h2>Seus endereços</h2>
            <div>
              <NewAddress>
                <button type="button" onClick={handleAddAddress}>
                  <FiPlus size={32} />
                  <span>Adicionar Endereço</span>
                </button>
              </NewAddress>
              {addresses.map((a) => (
                <AddressCard key={a.id}>
                  {a.is_main ? (
                    <MainAddress>
                      <span>Endereço principal</span>
                    </MainAddress>
                  ) : null}
                  <AddressDetail>
                    <p>{a.address}</p>
                    <p>{a.city}</p>
                    <p>CEP: {a.zip_code}</p>
                  </AddressDetail>
                  <AddressButtons>
                    <button type="button">Alterar</button>
                    <button type="button">Excluir</button>
                  </AddressButtons>
                </AddressCard>
              ))}
            </div>
          </AddressContainer>
        ) : (
          <div>Você não possui nenhum endereço cadastrado</div>
        )}
      </Container>
      <FooterNav />
    </>
  );
};

export default Addresses;
