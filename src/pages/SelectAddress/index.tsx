import React, { useEffect, useState, useCallback } from 'react';
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
} from './styles';
import { useAuth } from '../../hooks/auth';

interface IAddress {
  id: string;
  zip_code: string;
  city: string;
  address: string;
  is_main: boolean;
}

const SelectAddress: React.FC = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const { user, chooseAddress, address } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (user) {
      const userAddresses = user.addresses.filter((a) => a.id !== address.id);
      setAddresses(userAddresses);
    }
  }, [user, address.id]);

  const handleSelectAddress = useCallback(
    (add: IAddress) => {
      chooseAddress(add);
      history.goBack();
    },
    [chooseAddress, history],
  );

  return (
    <>
      <Container>
        <Header back="/order-resume" text="Voltar" />
        {addresses.length > 0 ? (
          <AddressContainer>
            <h2>Seus endereços</h2>
            <div>
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
                    <button
                      type="button"
                      onClick={() => handleSelectAddress(a)}
                    >
                      Selecionar endereço
                    </button>
                  </AddressButtons>
                </AddressCard>
              ))}
            </div>
          </AddressContainer>
        ) : (
          <div>Você não possui mais nenhum endereço cadastrado</div>
        )}
      </Container>
      <FooterNav />
    </>
  );
};

export default SelectAddress;
