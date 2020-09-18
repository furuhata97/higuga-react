import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

import { FiLoader } from 'react-icons/fi';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';

import { formatter } from '../../utils/moneyFormatter';

import {
  ProductContainer,
  ProductCard,
  ProductButtons,
  Loading,
} from './styles';

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

interface Pagination {
  products: IProduct[];
  size: number;
  skip: number;
  take: number;
  type: string;
}

const ELEMENTS_PER_PAGE = 15;
const INITIAL_SKIP = 0;
const REQUEST_TYPE = 'private';

const Products: React.FC = () => {
  const [searchWord, setSearchWord] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    products: [],
    take: 0,
    skip: 0,
    size: 0,
    type: 'private',
  });
  const { addToast } = useToast();

  const removeQuantity = useCallback(
    async (id: string, name: string, changeStock: number) => {
      try {
        await api.patch('/products/removal-quantity', {
          product_id: id,
          product_name: name,
          quantity_removed: changeStock,
        });

        const response = await api.get('/products', {
          params: {
            take: ELEMENTS_PER_PAGE,
            skip: pagination.skip,
            type: REQUEST_TYPE,
          },
        });

        setPagination({
          products: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip: pagination.skip,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        swal('Estoque atualizado', {
          icon: 'success',
        });
      } catch (err) {
        swal(`Ocorreu um erro ao atualizar o estoque: ${err}`, {
          icon: 'error',
        });
      }
    },
    [pagination.skip],
  );

  const handleChangeStock = useCallback(
    async (product: IProduct) => {
      swal({
        title: 'Insira a quantidade a remover do estoque',
        content: {
          element: 'input',
          attributes: {
            placeholder: 'Digite a quantidade',
            type: 'number',
            min: '0',
          },
        },
        buttons: ['Cancelar', 'Alterar'],
      }).then((changeStock) => {
        if (changeStock) {
          removeQuantity(product.id, product.name, Number(changeStock));
        }
      });
    },
    [removeQuantity],
  );

  useEffect(() => {
    api
      .get('/products', {
        params: {
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          type: REQUEST_TYPE,
        },
      })
      .then((response) => {
        setPagination({
          products: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
      })
      .catch((err) => {
        addToast({
          title: 'Erro ao carregar produtos',
          description: err,
          type: 'error',
        });
      });
  }, [addToast]);

  const updateSearch = (): void => {
    if (searchWord) {
      api
        .get('/products/search', {
          params: {
            search_word: searchWord,
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
            type: REQUEST_TYPE,
          },
        })
        .then((response) => {
          setPagination({
            products: response.data[0],
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
            size: response.data[1],
            type: REQUEST_TYPE,
          });
        });
      return;
    }

    api
      .get('/products', {
        params: {
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          type: REQUEST_TYPE,
        },
      })
      .then((response) => {
        setPagination({
          products: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
          type: REQUEST_TYPE,
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
        const response = await api.get('/products/search', {
          params: {
            search_word: searchWord,
            take: ELEMENTS_PER_PAGE,
            skip,
            type: REQUEST_TYPE,
          },
        });
        setPagination({
          products: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        return;
      }
      const response = await api.get('/products', {
        params: {
          take: ELEMENTS_PER_PAGE,
          skip,
          type: REQUEST_TYPE,
        },
      });
      setPagination({
        products: response.data[0],
        take: ELEMENTS_PER_PAGE,
        skip,
        size: response.data[1],
        type: REQUEST_TYPE,
      });
    },
    [searchWord],
  );

  const handleChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchWord(event.currentTarget.value);
  };

  return (
    <>
      <ProductContainer>
        <p>Produtos</p>
        <input type="text" onChange={handleChangeInput} value={searchWord} />
        {!pagination.products.length ? (
          <div>
            <Loading>
              <FiLoader size={24} />

              <p>Carregando</p>
            </Loading>
          </div>
        ) : (
          <div>
            {pagination.products.map((p) => (
              <ProductCard key={p.id}>
                <img src={p.image_url} alt={`Foto do produto ${p.name}`} />
                <span>{p.name}</span>
                <span>{formatter.format(p.price)}</span>
                <span>Estoque: {p.stock}</span>
                <ProductButtons>
                  <button type="button" onClick={() => handleChangeStock(p)}>
                    Dominuir estoque
                  </button>
                </ProductButtons>
              </ProductCard>
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
      </ProductContainer>
    </>
  );
};

export default Products;
