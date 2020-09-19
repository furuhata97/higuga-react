import React, { useEffect, useState, useCallback } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import ReactPaginate from 'react-paginate';
import swal from 'sweetalert';

import { Container, CardHeader, ClientCard } from './styles';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface IAddress {
  zip_code: string;
  city: string;
  address: string;
}

interface IClient {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  is_admin: boolean;
  addresses: IAddress[];
}

interface IPagination {
  data: IClient[];
  offset: number;
  numberPerPage: number;
  pageCount: number;
  currentData: IClient[];
}

const Clients: React.FC = () => {
  const { user } = useAuth();
  const [pagination, setPagination] = useState<IPagination>({
    data: [],
    offset: 0,
    numberPerPage: 15,
    pageCount: 0,
    currentData: [],
  });

  useEffect(() => {
    async function loadClients(): Promise<void> {
      const response = await api.get('/users/all');
      setPagination((prevState) => ({
        ...prevState,
        data: response.data,
      }));
    }

    loadClients();
  }, []);

  useEffect(() => {
    setPagination((prevState) => ({
      ...prevState,
      pageCount: prevState.data.length / prevState.numberPerPage,
      currentData: prevState.data.slice(
        pagination.offset,
        pagination.offset + pagination.numberPerPage,
      ),
    }));
  }, [pagination.data, pagination.numberPerPage, pagination.offset]);

  const handleCheckboxChange = useCallback(
    (id: string) => {
      swal({
        title:
          'Tem certeza que quer alterar os privilégios de administrador do usuário?',
        icon: 'warning',
        buttons: ['Cancelar', 'Confirmar'],
        dangerMode: true,
      }).then((willChange) => {
        if (willChange) {
          api
            .patch('/users/admin', { user_id: id })
            .then((response) => {
              const newClients = pagination.data.map((client) => {
                if (client.id !== response.data.id) return client;
                return response.data;
              });
              setPagination((prevState) => ({
                ...prevState,
                data: newClients,
              }));
              swal('Privilégio de administrador alterado com sucesso', {
                icon: 'success',
              });
            })
            .catch((err) => {
              swal(`Erro ao alterar privilégio de administrador: ${err}`, {
                icon: 'warning',
              });
            });
        }
      });
    },
    [pagination.data],
  );

  const handleDetailClick = useCallback((client: IClient) => {
    const mainDiv = document.createElement('div');
    mainDiv.style.color = 'black';
    const name = document.createElement('p');
    name.innerHTML = `${client.name}`;
    const email = document.createElement('p');
    email.innerHTML = `${client.email}`;
    const phone = document.createElement('p');
    phone.innerHTML = `${client.phone_number}`;
    const address = document.createElement('p');
    address.innerHTML = '<strong>Endereços</strong>';

    mainDiv.appendChild(name);
    mainDiv.appendChild(email);
    mainDiv.appendChild(phone);
    mainDiv.appendChild(address);

    const addressDiv = document.createElement('div');
    addressDiv.setAttribute(
      'style',
      '::-webkit-scrollbar { diplay: none }; -webkit-scrollbar: none; scrollbar-width: none',
    );

    client.addresses.map((add) => {
      const userAdd = document.createElement('p');
      userAdd.style.marginTop = '8px';
      userAdd.innerHTML = `${add.address}, ${add.city} - ${add.zip_code}`;
      addressDiv.appendChild(userAdd);
      return add;
    });

    mainDiv.appendChild(addressDiv);
    swal({
      title: 'Detalhes',
      content: {
        element: mainDiv,
      },
    });
  }, []);

  const handlePageClick = useCallback(
    (e) => {
      const { selected } = e;
      const offset = selected * pagination.numberPerPage;
      setPagination({ ...pagination, offset });
    },
    [pagination],
  );

  return (
    <Container>
      <h3>Clientes cadastrados</h3>
      <CardHeader className="header">
        <div>Nome</div>
        <div>Email</div>
        <div>Admin</div>
        <div />
      </CardHeader>
      {pagination.currentData.map((client) => {
        if (client.id !== user?.id) {
          return (
            <ClientCard key={client.id}>
              <div className="nameClass">{client.name.split(' ')[0]}</div>
              <div>{client.email}</div>
              <div>
                <Checkbox
                  checked={client.is_admin}
                  onChange={() => handleCheckboxChange(client.id)}
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </div>
              <div>
                <button type="button" onClick={() => handleDetailClick(client)}>
                  Detalhes
                </button>
              </div>
            </ClientCard>
          );
        }
        return null;
      })}
      {pagination.currentData.length && pagination.data.length > 15 ? (
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          pageCount={pagination.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          activeClassName="active"
        />
      ) : null}
    </Container>
  );
};

export default Clients;
