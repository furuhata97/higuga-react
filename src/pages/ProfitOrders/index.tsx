/* eslint-disable import/no-duplicates */
/* eslint-disable import/newline-after-import */
import React, { useState, useCallback, useEffect } from 'react';
import { startOfWeek, endOfWeek, parseISO, format, subHours } from 'date-fns';
import ReactPaginate from 'react-paginate';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';

import { formatter } from '../../utils/moneyFormatter';

import Header from '../../components/GenericHeader';

import { useToast } from '../../hooks/toast';

import {
  Container,
  Content,
  StyledDatePicker,
  Info,
  SalesContainer,
  Head,
  Product,
} from './styles';
import api from '../../services/api';
registerLocale('ptBR', ptBR);

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

interface IOrder {
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
  data: IOrder[];
  offset: number;
  numberPerPage: number;
  pageCount: number;
  currentData: IOrder[];
}

const ProfitOrders: React.FC = () => {
  const [pagination, setPagination] = useState<Pagination>({
    data: [],
    offset: 0,
    numberPerPage: 15,
    pageCount: 0,
    currentData: [],
  });
  const [dayDate, setDayDate] = useState(new Date());
  const [monthDate, setMonthDate] = useState(new Date());
  const [weekDate, setWeekDate] = useState(startOfWeek(new Date()));
  const [selectedOption, setSelectedOption] = useState('');
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [totalCard, setTotalCard] = useState(0);
  const { addToast } = useToast();

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

  function formatDate(date: string): string {
    const parsedDate = parseISO(date);
    const realDate = subHours(parsedDate, 3);
    const formattedDate = format(realDate, 'dd/MM/yyyy HH:mm');

    return formattedDate;
  }

  const handleChangeSelect = useCallback((e) => {
    const { value } = e.target;
    setSelectedOption(value);
    setPagination((prevState) => ({
      ...prevState,
      data: [],
    }));
  }, []);

  const handleChangeDayDate = useCallback(
    (date: Date | [Date, Date] | null) => {
      if (date && !Array.isArray(date)) {
        setDayDate(date);
        api
          .get('/orders/finished-date', {
            params: {
              order_date: date,
              time: 'day',
            },
          })
          .then((response) => {
            setPagination((prevState) => ({
              ...prevState,
              data: response.data,
            }));
            const amountProfit = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                t += Number(sale.total);
                return t;
              },
              0,
            );
            const amountDiscount = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                t += Number(sale.discount);
                return t;
              },
              0,
            );
            const amountMoney = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                if (sale.payment_method === 'DINHEIRO') t += 1;
                return t;
              },
              0,
            );
            const amountCard = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                if (sale.payment_method === 'CARTAO') t += 1;
                return t;
              },
              0,
            );
            setTotalProfit(amountProfit);
            setTotalDiscount(amountDiscount);
            setTotalMoney(amountMoney);
            setTotalCard(amountCard);
          })
          .catch((err) => {
            addToast({
              type: 'error',
              title: 'Erro gerar relatório',
              description: `${err.message}`,
            });
          });
        return;
      }
      if (!date) {
        addToast({
          type: 'error',
          title: 'Erro ao modificar data',
        });
      }
    },
    [addToast],
  );

  const handleChangeWeekDate = useCallback(
    (date: Date | [Date, Date] | null) => {
      if (date && !Array.isArray(date)) {
        setWeekDate(date);
        api
          .get('/orders/finished-date', {
            params: {
              order_date: date,
              time: 'week',
            },
          })
          .then((response) => {
            setPagination((prevState) => ({
              ...prevState,
              data: response.data,
            }));
            const amountProfit = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                t += Number(sale.total);
                return t;
              },
              0,
            );
            const amountDiscount = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                t += Number(sale.discount);
                return t;
              },
              0,
            );
            const amountMoney = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                if (sale.payment_method === 'DINHEIRO') t += 1;
                return t;
              },
              0,
            );
            const amountCard = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                if (sale.payment_method === 'CARTAO') t += 1;
                return t;
              },
              0,
            );
            setTotalProfit(amountProfit);
            setTotalDiscount(amountDiscount);
            setTotalMoney(amountMoney);
            setTotalCard(amountCard);
          })
          .catch((err) => {
            addToast({
              type: 'error',
              title: 'Erro gerar relatório',
              description: `${err.message}`,
            });
          });
        return;
      }
      if (!date) {
        addToast({
          type: 'error',
          title: 'Erro ao modificar data',
        });
      }
    },
    [addToast],
  );

  const handleChangeMonthDate = useCallback(
    (date: Date | [Date, Date] | null) => {
      if (date && !Array.isArray(date)) {
        setMonthDate(date);
        api
          .get('/orders/finished-date', {
            params: {
              order_date: date,
              time: 'month',
            },
          })
          .then((response) => {
            setPagination((prevState) => ({
              ...prevState,
              data: response.data,
            }));
            const amountProfit = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                t += Number(sale.total);
                return t;
              },
              0,
            );
            const amountDiscount = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                t += Number(sale.discount);
                return t;
              },
              0,
            );
            const amountMoney = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                if (sale.payment_method === 'DINHEIRO') t += 1;
                return t;
              },
              0,
            );
            const amountCard = response.data.reduce(
              (acc: number, sale: IOrder) => {
                let t = acc;
                if (sale.payment_method === 'CARTAO') t += 1;
                return t;
              },
              0,
            );
            setTotalProfit(amountProfit);
            setTotalDiscount(amountDiscount);
            setTotalMoney(amountMoney);
            setTotalCard(amountCard);
          })
          .catch((err) => {
            addToast({
              type: 'error',
              title: 'Erro gerar relatório',
              description: `${err.message}`,
            });
          });
        return;
      }
      if (!date) {
        addToast({
          type: 'error',
          title: 'Erro ao modificar data',
        });
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Header back="/admin" text="Voltar" />
      <Content>
        <Head>
          <h2>Relatório de lucro de pedidos</h2>
          <p>
            Selecione o perído do relatório. O período pode ser por dia, mês ou
            semana
          </p>
          <FormControl variant="outlined" style={{ width: '150px' }}>
            <InputLabel htmlFor="select-date">Período</InputLabel>
            <Select
              native
              value={selectedOption}
              onChange={handleChangeSelect}
              required
              label="Período"
              inputProps={{
                name: 'date',
                id: 'select-date',
              }}
            >
              <option aria-label="None" value="" />
              <option value="DIA">Dia</option>
              <option value="SEMANA">Semana</option>
              <option value="MES">Mês</option>
            </Select>
          </FormControl>
          {selectedOption === 'DIA' ? (
            <>
              <StyledDatePicker
                locale="ptBR"
                dateFormat="dd/MM/yyyy"
                selected={dayDate}
                onChange={(date) => handleChangeDayDate(date)}
              />
            </>
          ) : null}

          {selectedOption === 'SEMANA' ? (
            <StyledDatePicker
              locale="ptBR"
              dateFormat="w"
              shouldCloseOnSelect={false}
              selected={startOfWeek(weekDate)}
              onChange={(date) => handleChangeWeekDate(date)}
              startDate={startOfWeek(weekDate)}
              endDate={endOfWeek(weekDate)}
            />
          ) : null}

          {selectedOption === 'MES' ? (
            <StyledDatePicker
              locale="ptBR"
              dateFormat="MM/yyyy"
              selected={monthDate}
              onChange={(date) => handleChangeMonthDate(date)}
              showMonthYearPicker
            />
          ) : null}
        </Head>
        {pagination.data.length ? (
          <>
            <Info>
              <span>
                Valor total: {formatter.format(totalProfit + totalDiscount)}
              </span>
              <span>
                Valor dos descontos: {formatter.format(totalDiscount)}
              </span>
              <span>Total ganho: {formatter.format(totalProfit)}</span>
              <span>Qtd. de pedidos em dinheiro: {totalMoney}</span>
              <span>Qtd. de pedidos com cartão: {totalCard}</span>
            </Info>

            {pagination.currentData.map((s) => (
              <SalesContainer key={s.id}>
                <div>
                  <span>Data do pedido: {formatDate(s.created_at)}</span>
                  <span>Data de finalização: {formatDate(s.updated_at)}</span>
                </div>

                <div>Cliente: {s.user.name}</div>
                <div>
                  <span>
                    Total:{' '}
                    {formatter.format(Number(s.total) + Number(s.discount))}
                  </span>
                  <span>Desconto: {formatter.format(Number(s.discount))}</span>
                  <span>Valor final {formatter.format(Number(s.total))}</span>
                </div>
                <div>
                  <span>
                    Forma de pagamento:{' '}
                    {s.payment_method === 'DINHEIRO' ? 'Dinheiro' : 'Cartão'}
                  </span>
                </div>
                {s.order_products.map((sp) => (
                  <Product key={sp.id}>
                    <img src={sp.product.image_url} alt={sp.product.name} />
                    <span>{sp.product.name}</span>
                    <span>{sp.quantity}</span>
                    <span>{formatter.format(sp.price)}</span>
                    <span>{formatter.format(sp.price * sp.quantity)}</span>
                  </Product>
                ))}
              </SalesContainer>
            ))}
          </>
        ) : null}
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
      </Content>
    </Container>
  );
};

export default ProfitOrders;
