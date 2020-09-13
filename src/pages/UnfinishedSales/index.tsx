/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { parseISO, format, subHours } from 'date-fns';

import { FiLoader } from 'react-icons/fi';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

import { formatter } from '../../utils/moneyFormatter';

import { SaleContainer, SaleCard, Loading } from './styles';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category_id: string;
  barcode: string;
  image_url?: string;
  product_image?: FormData;
  hidden: boolean;
}

interface ISaleProducts {
  id: string;
  quantity: number;
  product: IProduct;
}

interface ISale {
  id: string;
  client_name: string;
  total: number;
  discount: number;
  created_at: string;
  sale_products: ISaleProducts[];
}

interface Pagination {
  data: ISale[];
  offset: number;
  numberPerPage: number;
  pageCount: number;
  currentData: ISale[];
}

interface SelectPaymentProps {
  sale: ISale;
}

const SelectPayment: React.FC<SelectPaymentProps> = ({ sale }) => {
  const [componentPayment, setComponentPayment] = useState('');
  const [componentMoney, setComponentMoney] = useState('0');

  const handleChangeSelect = useCallback(
    (e) => {
      const { value } = e.target;
      setComponentPayment(value);
      let updateMoney = componentMoney;
      if (value === 'CARTAO') {
        setComponentMoney('0');
        updateMoney = '0';
      }
      const props = JSON.stringify({
        payment: value,
        money: updateMoney,
      });
      // @ts-ignore
      swal.setActionValue({ confirm: props });
    },
    [componentMoney],
  );

  const handleChangeInputMoney = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      setComponentMoney(value);
      const props = JSON.stringify({
        payment: componentPayment,
        money: value,
      });
      // @ts-ignore
      swal.setActionValue({ confirm: props });
    },
    [componentPayment],
  );

  return (
    <div>
      <FormControl variant="outlined" style={{ width: '200px' }}>
        <InputLabel htmlFor="select_pagamento_label">
          Forma de pagamento
        </InputLabel>
        <Select
          native
          value={componentPayment}
          onChange={handleChangeSelect}
          required
          label="Forma de pagamento"
          inputProps={{
            name: 'payment',
            id: 'select_pagamento_label',
          }}
        >
          <option disabled aria-label="None" value="" />
          <option value="DINHEIRO">Dinheiro</option>
          <option value="CARTAO">Cartão</option>
        </Select>
      </FormControl>
      <br />
      <TextField
        style={{ marginTop: '16px' }}
        disabled={componentPayment !== 'DINHEIRO'}
        id="money-received"
        label="Dinheiro recebido"
        type="text"
        value={componentMoney}
        onChange={handleChangeInputMoney}
        margin="dense"
        variant="outlined"
        required
      />
      {componentPayment === 'DINHEIRO' &&
      Number(componentMoney) > sale.total ? (
        <>
          <div style={{ color: '#333' }}>
            Troco: {formatter.format(Number(componentMoney) - sale.total)}
          </div>
          <br />
        </>
      ) : null}
      {componentPayment === 'DINHEIRO' &&
      Number(componentMoney) < sale.total ? (
        <>
          <div style={{ color: '#333' }}>
            Valor recebido menor que o valor da compra
          </div>
          <br />
        </>
      ) : null}
    </div>
  );
};

const UnfinishedSales: React.FC = () => {
  const [pagination, setPagination] = useState<Pagination>({
    data: [],
    offset: 0,
    numberPerPage: 20,
    pageCount: 0,
    currentData: [],
  });
  const [allSales, setAllSales] = useState<ISale[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const { addToast } = useToast();

  function formatDate(date: string): string {
    const parsedDate = parseISO(date);
    const realDate = subHours(parsedDate, 3);
    const formattedDate = format(realDate, 'dd/MM/yyyy HH:mm');

    return formattedDate;
  }

  useEffect(() => {
    api
      .get('/sales/unfinished')
      .then((response) => {
        if (!response.data.length) {
          setIsEmpty(true);
        }
        setPagination((prevState) => ({
          ...prevState,
          data: response.data,
        }));
      })
      .catch((err) => {
        addToast({
          title: 'Erro ao carregar vendas',
          description: `${err.message}`,
          type: 'error',
        });
      });
  }, [addToast]);

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

  const handlePageClick = useCallback(
    (e) => {
      const { selected } = e;
      const offset = selected * pagination.numberPerPage;
      setPagination({ ...pagination, offset });
    },
    [pagination],
  );

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.value) {
        if (!allSales.length) {
          setAllSales(pagination.data);
          const filteredSales = pagination.data.filter((suggestion) => {
            let searchName = suggestion.client_name.toUpperCase();
            searchName = searchName.replace(/[ÀÁÂÃÄÅ]/, 'A');
            searchName = searchName.replace(/[ÈÉÊË]/, 'E');
            searchName = searchName.replace(/[ÚÙÛ]/, 'U');
            searchName = searchName.replace(/[ÕÓÒÔ]/, 'O');
            searchName = searchName.replace(/['Ç']/, 'C');
            return searchName
              .toLowerCase()
              .includes(event.currentTarget.value.toLowerCase());
          });

          setPagination({
            data: filteredSales,
            offset: 0,
            numberPerPage: 20,
            pageCount: 0,
            currentData: [],
          });
        } else {
          const filteredSales = allSales.filter((suggestion) => {
            let searchName = suggestion.client_name.toUpperCase();
            searchName = searchName.replace(/[ÀÁÂÃÄÅ]/, 'A');
            searchName = searchName.replace(/[ÈÉÊË]/, 'E');
            searchName = searchName.replace(/[ÚÙÛ]/, 'U');
            searchName = searchName.replace(/[ÕÓÒÔ]/, 'O');
            searchName = searchName.replace(/['Ç']/, 'C');
            return searchName
              .toLowerCase()
              .includes(event.currentTarget.value.toLowerCase());
          });

          setPagination({
            data: filteredSales,
            offset: 0,
            numberPerPage: 20,
            pageCount: 0,
            currentData: [],
          });
        }
      } else {
        setPagination({
          data: allSales,
          offset: 0,
          numberPerPage: 20,
          pageCount: 0,
          currentData: [],
        });
        setAllSales([]);
      }
    },
    [allSales, pagination.data],
  );

  const handlePaymentClick = useCallback(
    (sale: ISale) => {
      const wrapper = document.createElement('div');
      ReactDOM.render(<SelectPayment sale={sale} />, wrapper);
      const el = wrapper.firstChild;
      swal({
        text: 'Escolha a forma de pagamento',
        content: {
          element: el || 'div',
        },
        buttons: {
          cancel: {
            text: 'Cancelar',
            value: null,
            visible: true,
            className: '',
            closeModal: true,
          },
          confirm: {
            value: '',
          },
        },
      }).then((componentValue) => {
        if (componentValue) {
          const parsedValue = JSON.parse(componentValue);

          if (parsedValue.payment === 'DINHEIRO') {
            if (parsedValue.money === 0) {
              addToast({
                type: 'error',
                title: 'Quantidade inválida',
              });
              return;
            }
            if (Number(parsedValue.money) < sale.total) {
              addToast({
                type: 'error',
                title: 'Quantidade inválida',
              });
              return;
            }
          }

          const data =
            parsedValue.payment === 'DINHEIRO'
              ? {
                  sale_id: sale.id,
                  payment_method: parsedValue.payment,
                  money_received: parsedValue.money,
                }
              : {
                  sale_id: sale.id,
                  payment_method: parsedValue.payment,
                };

          api
            .put('sales', data)
            .then((response) => {
              const updateSales = pagination.data.filter(
                (s) => s.id !== response.data.id,
              );
              if (!updateSales.length) {
                setIsEmpty(true);
              }
              setPagination({
                data: updateSales,
                offset: 0,
                numberPerPage: 20,
                pageCount: 0,
                currentData: [],
              });
              addToast({
                type: 'success',
                title: 'Venda atualizada com sucesso',
              });
            })
            .catch((err) => {
              addToast({
                type: 'error',
                title: 'Erro ao atualizar venda',
                description: `${err.message}`,
              });
            });
        } else if (componentValue !== null) {
          addToast({
            type: 'error',
            title: 'Preencha os campos de pagamento',
          });
        }
      });
    },
    [addToast, pagination.data],
  );

  return (
    <>
      <SaleContainer>
        <p>Vendas em aberto</p>
        <input
          type="text"
          onChange={handleChangeInput}
          placeholder="Nome do cliente"
        />
        {isEmpty ? (
          <div>
            <Loading>
              <p>Nenhuma venda em aberto</p>
            </Loading>
          </div>
        ) : (
          <div>
            {pagination.currentData.map((p) => (
              <SaleCard key={p.id}>
                <span>Cliente: {p.client_name}</span>
                <span>Data da compra: {formatDate(p.created_at)}</span>
                <span>Total: {formatter.format(p.total)}</span>
                <span>Desconto: {formatter.format(p.discount)}</span>
                <span>
                  <strong>Produtos</strong>
                </span>
                {p.sale_products.map((sp) => (
                  <div key={sp.id}>
                    <img src={sp.product.image_url} alt={sp.product.name} />
                    <span>{sp.product.name}</span>
                    <span>{sp.quantity}</span>
                    <span>{formatter.format(sp.product.price)}</span>
                    <span>
                      {formatter.format(sp.product.price * sp.quantity)}
                    </span>
                  </div>
                ))}
                <button type="button" onClick={() => handlePaymentClick(p)}>
                  Realizar pagamento
                </button>
              </SaleCard>
            ))}
          </div>
        )}
        {pagination.currentData.length && pagination.pageCount > 0.5 ? (
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
      </SaleContainer>
    </>
  );
};

export default UnfinishedSales;
