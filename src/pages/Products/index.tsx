import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

import { FiPlus } from 'react-icons/fi';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';

import { formatter } from '../../utils/moneyFormatter';

import {
  ProductContainer,
  NewProduct,
  ProductCard,
  ProductButtons,
} from './styles';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import EditProduct from '../EditProduct';
import AddProduct from '../AddProduct';

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
  const [actionType, setActionType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<IProduct>(
    {} as IProduct,
  );
  const [pagination, setPagination] = useState<Pagination>({
    products: [],
    take: 0,
    skip: 0,
    size: 0,
    type: 'private',
  });
  const { addToast } = useToast();

  const handleChangeStock = useCallback(
    (product: IProduct) => {
      swal({
        title: 'Insira a quantidade a adicionar em estoque',
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
          api
            .put('/products', {
              id: product.id,
              name: product.name,
              price: product.price,
              category_id: product.category_id,
              barcode: product.barcode,
              stock: Number(product.stock) + Number(changeStock),
            })
            .then((response) => {
              const updatedProducs = pagination.products.map((p) => {
                if (p.id === response.data.id) {
                  return response.data;
                }
                return p;
              });
              setPagination((prevState) => ({
                ...prevState,
                products: updatedProducs,
              }));
              swal('Estoque atualizado', {
                icon: 'success',
              });
            })
            .catch((err) => {
              swal(`Ocorreu um erro ao atualizar o estoque: ${err}`, {
                icon: 'error',
              });
            });
        }
      });
    },
    [pagination.products],
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

  const handleClickEdit = useCallback((product: IProduct) => {
    setActionType('edit');
    setSelectedProduct(product);
  }, []);

  const handleClickAdd = useCallback(() => {
    setActionType('add');
  }, []);

  const handleClickHidden = useCallback((id: string) => {
    api
      .patch('/products/hidden', {
        id,
      })
      .then((response) => {
        setPagination((prevState) => ({
          ...prevState,
          products: prevState.products.map((p) => {
            if (p.id === id) {
              return response.data;
            }
            return p;
          }),
        }));
      });
  }, []);

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
      {actionType === '' ? (
        <ProductContainer>
          <p>Produtos</p>
          <input type="text" onChange={handleChangeInput} value={searchWord} />
          <div>
            <NewProduct>
              <button type="button" onClick={handleClickAdd}>
                <FiPlus size={32} />
                <span>Adicionar novo produto</span>
              </button>
            </NewProduct>
            {pagination.products.map((p) => (
              <ProductCard key={p.id}>
                <img src={p.image_url} alt={`Foto do produto ${p.name}`} />
                <span>{p.name}</span>
                <span>{formatter.format(p.price)}</span>
                <span>Estoque: {p.stock}</span>
                <ProductButtons>
                  <button type="button" onClick={() => handleChangeStock(p)}>
                    Adicionar estoque
                  </button>
                  <button type="button" onClick={() => handleClickEdit(p)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => handleClickHidden(p.id)}>
                    {p.hidden ? (
                      <span>Deixar visível</span>
                    ) : (
                      <span>Ocultar</span>
                    )}
                  </button>
                </ProductButtons>
              </ProductCard>
            ))}
          </div>
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
      ) : null}
      {actionType === 'edit' ? (
        <EditProduct
          product={selectedProduct}
          setActionType={setActionType}
          setProducts={setPagination}
        />
      ) : null}
      {actionType === 'add' ? (
        <AddProduct setActionType={setActionType} setProducts={setPagination} />
      ) : null}
    </>
  );
};

export default Products;
