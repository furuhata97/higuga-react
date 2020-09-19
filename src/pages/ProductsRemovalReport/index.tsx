/* eslint-disable import/no-duplicates */
/* eslint-disable import/newline-after-import */
import React, { useState, useCallback, useEffect } from 'react';
import { startOfWeek, endOfWeek, parseISO, format } from 'date-fns';
import ReactPaginate from 'react-paginate';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';

import Header from '../../components/GenericHeader';

import { useToast } from '../../hooks/toast';

import {
  Container,
  Content,
  StyledDatePicker,
  Info,
  ProductRemovalContainer,
  Head,
} from './styles';
import api from '../../services/api';
registerLocale('ptBR', ptBR);

interface IProductRemoval {
  id: string;
  product_name: string;
  quantity_removed: number;
  created_at: string;
}

interface Pagination {
  data: IProductRemoval[];
  offset: number;
  numberPerPage: number;
  pageCount: number;
  currentData: IProductRemoval[];
}

const ProductsRemovalReport: React.FC = () => {
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
  const [totalRemoved, setTotalRemoved] = useState(0);
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
    const formattedDate = format(parsedDate, 'dd/MM/yyyy HH:mm');

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
          .get('/products/removal-quantity', {
            params: {
              date,
              type: 'day',
            },
          })
          .then((response) => {
            setPagination((prevState) => ({
              ...prevState,
              data: response.data,
            }));
            const amountRemoved = response.data.reduce(
              (acc: number, sale: IProductRemoval) => {
                let t = acc;
                t += Number(sale.quantity_removed);
                return t;
              },
              0,
            );
            setTotalRemoved(amountRemoved);
          })
          .catch((err) => {
            addToast({
              type: 'error',
              title: 'Erro ao gerar relatório',
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
          .get('/products/removal-quantity', {
            params: {
              date,
              type: 'week',
            },
          })
          .then((response) => {
            setPagination((prevState) => ({
              ...prevState,
              data: response.data,
            }));
            const amountRemoved = response.data.reduce(
              (acc: number, sale: IProductRemoval) => {
                let t = acc;
                t += Number(sale.quantity_removed);
                return t;
              },
              0,
            );
            setTotalRemoved(amountRemoved);
          })
          .catch((err) => {
            addToast({
              type: 'error',
              title: 'Erro ao gerar relatório',
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
          .get('/products/removal-quantity', {
            params: {
              date,
              type: 'month',
            },
          })
          .then((response) => {
            setPagination((prevState) => ({
              ...prevState,
              data: response.data,
            }));
            const amountRemoved = response.data.reduce(
              (acc: number, sale: IProductRemoval) => {
                let t = acc;
                t += Number(sale.quantity_removed);
                return t;
              },
              0,
            );
            setTotalRemoved(amountRemoved);
          })
          .catch((err) => {
            addToast({
              type: 'error',
              title: 'Erro ao gerar relatório',
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
          <h2>Relatório de produtos retirados</h2>
          <p>Exibe os produtos retirados para consumo interno</p>
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
              <span>Quantidade removida: {totalRemoved}</span>
            </Info>

            {pagination.currentData.map((s) => (
              <ProductRemovalContainer key={s.id}>
                <div>
                  <span>Data da venda: {formatDate(s.created_at)}</span>
                </div>

                <div>Produto: {s.product_name}</div>
                <div>Quantidade removida: {s.quantity_removed}</div>
              </ProductRemovalContainer>
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

export default ProductsRemovalReport;
