import React, { useCallback, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { parseISO, format, subHours } from 'date-fns';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import api from '../../services/api';

import { formatter } from '../../utils/moneyFormatter';

import {
  Container,
  SelectButton,
  OrderContainer,
  OrderHeader,
  Orders,
  SelectStatus,
} from './styles';
import { useToast } from '../../hooks/toast';

interface IUser {
  name: string;
}

interface IProduct {
  name: string;
  image_url: string;
}

interface IOrderProducts {
  id: string;
  price: number;
  quantity: number;
  product: IProduct;
}

interface IOrders {
  id: string;
  total: number;
  discount: number;
  status: string;
  payment_method: string;
  zip_code: string;
  address: string;
  city: string;
  created_at: string;
  updated_at: string;
  user: IUser;
  order_products: IOrderProducts[];
  newStatus: string;
}

interface Pagination {
  orders: IOrders[];
  size: number;
  skip: number;
  take: number;
  status: string;
}

const ELEMENTS_PER_PAGE = 15;
const INITIAL_SKIP = 0;
const ORDER_PROCESSING = 'EM PROCESSAMENTO';
const ORDER_FINISHED = 'FINALIZADO';
const ORDER_TRANSPORTING = 'EM TRANSITO';
const ORDER_CANCEL = 'CANCELADO';

const AdminOrders: React.FC = () => {
  const { addToast } = useToast();
  const [selectedButton, setSelectedButton] = useState('processing');
  const [pagination, setPagination] = useState<Pagination>({
    orders: [],
    take: 0,
    skip: 0,
    size: 0,
    status: '',
  });

  async function getOrders(status: string, sk: number): Promise<void> {
    const response = await api.get('/orders/status', {
      params: {
        take: ELEMENTS_PER_PAGE,
        skip: sk,
        status,
      },
    });
    const includeNewStatus = response.data[0].map((or: IOrders) => {
      const order = or;
      order.newStatus = or.status;
      return order;
    });
    setPagination({
      orders: includeNewStatus,
      take: ELEMENTS_PER_PAGE,
      skip: sk,
      size: response.data[1],
      status,
    });
  }

  useEffect(() => {
    if (selectedButton === 'processing') {
      getOrders(ORDER_PROCESSING, INITIAL_SKIP);
      return;
    }
    if (selectedButton === 'transport') {
      getOrders(ORDER_TRANSPORTING, INITIAL_SKIP);
      return;
    }
    if (selectedButton === 'close') {
      getOrders(ORDER_FINISHED, INITIAL_SKIP);
      return;
    }
    if (selectedButton === 'cancel') {
      getOrders(ORDER_CANCEL, INITIAL_SKIP);
    }
  }, [selectedButton]);

  function formatDate(date: string): string {
    const parsedDate = parseISO(date);
    const realDate = subHours(parsedDate, 3);
    const formattedDate = format(realDate, 'dd/MM/yyyy HH:mm');

    return formattedDate;
  }

  const handleButtonClick = useCallback((type: string) => {
    setSelectedButton(type);
  }, []);

  const handleStatusButton = useCallback(
    async (order: IOrders) => {
      async function updateStatus(id: string, status: string): Promise<void> {
        try {
          await api.patch('/orders/status', {
            id,
            status,
          });

          addToast({
            type: 'success',
            title: 'Status atualizado',
          });
        } catch {
          addToast({
            type: 'error',
            title: 'Erro ao atualizar status',
          });
        }
      }
      const previousStatus = order.status;

      await updateStatus(order.id, order.newStatus);
      await getOrders(previousStatus, INITIAL_SKIP);
    },
    [addToast],
  );

  const handlePageClick = useCallback(
    (e) => {
      const { selected } = e;
      const skip = selected * ELEMENTS_PER_PAGE;
      if (selectedButton === 'processing') {
        getOrders(ORDER_PROCESSING, skip);
        return;
      }
      if (selectedButton === 'transport') {
        getOrders(ORDER_TRANSPORTING, skip);
        return;
      }
      if (selectedButton === 'close') {
        getOrders(ORDER_FINISHED, skip);
        return;
      }
      if (selectedButton === 'cancel') {
        getOrders(ORDER_CANCEL, skip);
      }
    },
    [selectedButton],
  );

  const handleChangeStatus = useCallback(
    (e, id: string) => {
      const { value } = e.target;
      const orders = pagination.orders.map((or) => {
        if (or.id === id) {
          const o = or;
          o.newStatus = value;
          return o;
        }
        return or;
      });
      setPagination((oldState) => ({
        ...oldState,
        orders,
      }));
    },
    [pagination.orders],
  );

  return (
    <Container>
      <h3>Pedidos</h3>
      <div>
        <SelectButton
          type="button"
          onClick={() => handleButtonClick('processing')}
          selected={selectedButton === 'processing'}
        >
          Pedidos em processamento
        </SelectButton>
        <SelectButton
          type="button"
          onClick={() => handleButtonClick('transport')}
          selected={selectedButton === 'transport'}
        >
          Pedidos em transporte
        </SelectButton>
        <SelectButton
          type="button"
          onClick={() => handleButtonClick('close')}
          selected={selectedButton === 'close'}
        >
          Pedidos finalizados
        </SelectButton>
        <SelectButton
          type="button"
          onClick={() => handleButtonClick('cancel')}
          selected={selectedButton === 'cancel'}
        >
          Pedidos cancelados
        </SelectButton>
      </div>
      <Orders>
        {pagination.orders.map((or) => (
          <OrderContainer key={or.id}>
            <OrderHeader>Data: {formatDate(or.created_at)}</OrderHeader>
            <p>
              <strong>Cliente:</strong> {or.user.name}
            </p>
            <p>
              <strong>Endereço:</strong> {or.address}, {or.city} - {or.zip_code}
            </p>
            <p>
              <strong>Valor sem desconto:</strong>{' '}
              {formatter.format(Number(or.total) + Number(or.discount))}
            </p>
            <p>
              <strong>Desconto:</strong> {formatter.format(or.discount)}
            </p>
            <p>
              <strong>Total a cobrar:</strong> {formatter.format(or.total)}
            </p>
            <p>
              <strong>Produtos:</strong>
            </p>
            {or.order_products.map((op) => (
              <div key={op.id}>
                <img src={op.product.image_url} alt={op.product.name} />
                <p>{op.product.name}</p>

                <p>Qtd: {op.quantity}</p>

                <p>{formatter.format(op.price)} un.</p>
                <p>
                  Total{' '}
                  {formatter.format(Number(op.price) * Number(op.quantity))}
                </p>
              </div>
            ))}
            <SelectStatus>
              {or.status !== 'FINALIZADO' && or.status !== 'CANCELADO' ? (
                <>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="select_status_label">
                      Alterar status
                    </InputLabel>
                    <Select
                      native
                      value={or.newStatus}
                      onChange={(e) => handleChangeStatus(e, or.id)}
                      fullWidth
                      required
                      label="Alterar status"
                      inputProps={{
                        name: 'status',
                        id: 'select_status_label',
                      }}
                    >
                      <option disabled aria-label="None" value="" />
                      {or.status === 'EM PROCESSAMENTO' ? (
                        <>
                          <option value="EM PROCESSAMENTO">
                            Em Processamento
                          </option>
                          <option value="EM TRANSITO">Em trânsito</option>
                          <option value="CANCELADO">Cancelado</option>
                        </>
                      ) : null}
                      {or.status === 'EM TRANSITO' ? (
                        <>
                          <option value="EM TRANSITO">Em Trânsito</option>
                          <option value="CANCELADO">Cancelado</option>
                          <option value="FINALIZADO">Finalizado</option>
                        </>
                      ) : null}
                    </Select>
                  </FormControl>
                  <button type="button" onClick={() => handleStatusButton(or)}>
                    Alterar status
                  </button>
                </>
              ) : null}
            </SelectStatus>
          </OrderContainer>
        ))}
      </Orders>

      {pagination.size / pagination.take > 1 ? (
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          pageCount={pagination.size / pagination.take}
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

export default AdminOrders;
