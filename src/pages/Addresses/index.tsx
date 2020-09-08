import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import swal from 'sweetalert';
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
import api from '../../services/api';

interface IAddress {
  id: string;
  zip_code: string;
  city: string;
  address: string;
  is_main: boolean;
}

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const { user, updateUser } = useAuth();
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

  const handleEditAddress = useCallback(
    (address: IAddress) => {
      history.push(`/update-address/${address.id}`);
    },
    [history],
  );

  const handleDelete = useCallback(
    (address: IAddress) => {
      swal({
        title: 'Tem certeza que quer excluir o endereço?',
        text: 'Uma vez excluído, você não conseguirá recuperar este endereço',
        icon: 'warning',
        buttons: ['Cancelar', 'Confirmar'],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          if (address.is_main) {
            swal('Não é possível excluir o endereço principal', {
              icon: 'info',
            });
          } else {
            api
              .delete('/users/delete-address', {
                data: {
                  address_id: address.id,
                },
              })
              .then(() => {
                const updatedUser = user;

                if (!updatedUser) {
                  throw new Error();
                }

                const remainingAddresses = updatedUser.addresses.filter(
                  (add) => add.id !== address.id,
                );

                updatedUser.addresses = remainingAddresses;
                setAddresses(remainingAddresses);

                updateUser(updatedUser);

                swal('Endereço excluído com sucesso', {
                  icon: 'success',
                });
              })
              .catch((err) => {
                swal(`Erro ao excluir endereço: ${err}`, {
                  icon: 'warning',
                });
              });
          }
        }
      });
    },
    [user, updateUser],
  );

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
                    <button type="button" onClick={() => handleEditAddress(a)}>
                      Alterar
                    </button>
                    <button type="button" onClick={() => handleDelete(a)}>
                      Excluir
                    </button>
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
