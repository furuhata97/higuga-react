/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { parseISO, format, subHours } from 'date-fns';
import debounce from 'lodash.debounce';

import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import CurrencyInput from '../../components/InputCurrency';

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
  sales: ISale[];
  size: number;
  skip: number;
  take: number;
}

const ELEMENTS_PER_PAGE = 15;
const INITIAL_SKIP = 0;

interface SelectPaymentProps {
  sale: ISale;
}

const SelectPayment: React.FC<SelectPaymentProps> = ({ sale }) => {
  const [componentPayment, setComponentPayment] = useState('');
  const [componentMoney, setComponentMoney] = useState('0,00');

  const handleChangeSelect = useCallback(
    (e) => {
      const { value } = e.target;
      setComponentPayment(value);
      let updateMoney = componentMoney.replace(',', '.');
      if (value === 'CARTAO') {
        setComponentMoney('0,00');
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

  useEffect(() => {
    const parsedMoney = componentMoney.replace(',', '.');
    const props = JSON.stringify({
      payment: componentPayment,
      money: parsedMoney,
    });
    // @ts-ignore
    swal.setActionValue({ confirm: props });
  }, [componentPayment, componentMoney]);

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
      <CurrencyInput
        disabled={componentPayment !== 'DINHEIRO'}
        separator=","
        name="Dinheiro recebido"
        value={componentMoney}
        setValue={setComponentMoney}
      />
      {componentPayment === 'DINHEIRO' &&
      Number(componentMoney.replace(',', '.')) > sale.total ? (
        <>
          <div style={{ color: '#333' }}>
            Troco:{' '}
            {formatter.format(
              Number(componentMoney.replace(',', '.')) - sale.total,
            )}
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
  const [searchWord, setSearchWord] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    sales: [],
    take: 0,
    skip: 0,
    size: 0,
  });
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
      .get('/sales/unfinished', {
        params: {
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
        },
      })
      .then((response) => {
        if (!response.data.length) {
          setIsEmpty(true);
        }
        setPagination({
          sales: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
        });
      })
      .catch((err) => {
        addToast({
          title: 'Erro ao carregar vendas',
          description: `${err.message}`,
          type: 'error',
        });
      });
  }, [addToast]);

  const updateSearch = (): void => {
    if (searchWord) {
      api
        .get('/sales/unfinished', {
          params: {
            search: searchWord,
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
          },
        })
        .then((response) => {
          setPagination({
            sales: response.data[0],
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
            size: response.data[1],
          });
        });
      return;
    }

    api
      .get('/sales/unfinished', {
        params: {
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
        },
      })
      .then((response) => {
        setPagination({
          sales: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
        });
      });
  };

  const delayedSearch = useCallback(debounce(updateSearch, 500), [searchWord]);

  useEffect(() => {
    delayedSearch();

    return delayedSearch.cancel;
  }, [searchWord, delayedSearch]);

  const handlePageClick = useCallback(
    async (e) => {
      const { selected } = e;
      const skip = selected * ELEMENTS_PER_PAGE;
      if (searchWord) {
        const response = await api.get('/sales/unfinished', {
          params: {
            search: searchWord,
            take: ELEMENTS_PER_PAGE,
            skip,
          },
        });
        setPagination({
          sales: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip,
          size: response.data[1],
        });
        return;
      }
      const response = await api.get('/sales/unfinished', {
        params: {
          take: ELEMENTS_PER_PAGE,
          skip,
        },
      });
      setPagination({
        sales: response.data[0],
        take: ELEMENTS_PER_PAGE,
        skip,
        size: response.data[1],
      });
    },
    [searchWord],
  );

  const handleChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchWord(event.currentTarget.value);
  };

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
            if (parsedValue.money === '0.00') {
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
                  money_received: Number(parsedValue.money),
                }
              : {
                  sale_id: sale.id,
                  payment_method: Number(parsedValue.payment),
                };

          api
            .put('sales', data)
            .then((_) => {
              api
                .get('sales/unfinished', {
                  params: {
                    take: ELEMENTS_PER_PAGE,
                    skip: INITIAL_SKIP,
                  },
                })
                .then((response) => {
                  setPagination({
                    sales: response.data[0],
                    take: ELEMENTS_PER_PAGE,
                    skip: INITIAL_SKIP,
                    size: response.data[1],
                  });
                  addToast({
                    type: 'success',
                    title: 'Venda atualizada com sucesso',
                  });
                })
                .catch((err) => {
                  addToast({
                    title: 'Erro ao carregar categorias',
                    description: err,
                    type: 'error',
                  });
                });
            })
            .catch((err) => {
              addToast({
                type: 'error',
                title: 'Erro ao atualizar venda',
                description: `${err.message}`,
              });
            });
        }
        if (componentValue !== null) {
          addToast({
            type: 'error',
            title: 'Preencha os campos de pagamento',
          });
        }
      });
    },
    [addToast],
  );

  return (
    <SaleContainer>
      <p>Vendas em aberto</p>
      <input
        type="text"
        onChange={handleChangeInput}
        value={searchWord}
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
          <span>Total de vendas em aberto: {pagination.size}</span>
          {pagination.sales.map((p) => (
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
    </SaleContainer>
  );
};

export default UnfinishedSales;
