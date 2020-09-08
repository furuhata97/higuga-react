import React, { useState, useCallback, useEffect } from 'react';

import { FiPlus, FiLoader } from 'react-icons/fi';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';

import { formatter } from '../../utils/moneyFormatter';

import {
  ProductContainer,
  NewProduct,
  ProductCard,
  ProductButtons,
  Loading,
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
  data: IProduct[];
  offset: number;
  numberPerPage: number;
  pageCount: number;
  currentData: IProduct[];
}

const Products: React.FC = () => {
  // const [products, setProducts] = useState<IProduct[]>([]);
  const [actionType, setActionType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<IProduct>(
    {} as IProduct,
  );
  const [pagination, setPagination] = useState<Pagination>({
    data: [],
    offset: 0,
    numberPerPage: 20,
    pageCount: 0,
    currentData: [],
  });
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
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
              const updatedProducs = pagination.data.map((p) => {
                if (p.id === response.data.id) {
                  return response.data;
                }
                return p;
              });
              setPagination((prevState) => ({
                ...prevState,
                data: updatedProducs,
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
    [pagination.data],
  );

  useEffect(() => {
    api
      .get('/products')
      .then((response) => {
        setPagination((prevState) => ({
          ...prevState,
          data: response.data,
        }));
      })
      .catch((err) => {
        addToast({
          title: 'Erro ao carregar produtos',
          description: err,
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

  const handleClickEdit = useCallback((product: IProduct) => {
    setActionType('edit');
    setSelectedProduct(product);
  }, []);

  const handleClickAdd = useCallback(() => {
    setActionType('add');
  }, []);

  const handleClickHidden = useCallback(
    (id: string) => {
      api
        .patch('/products/hidden', {
          id,
        })
        .then((response) => {
          if (allProducts.length) {
            setAllProducts(
              allProducts.map((p) => {
                if (p.id === id) {
                  return response.data;
                }
                return p;
              }),
            );
          }
          setPagination((prevState) => ({
            ...prevState,
            data: prevState.data.map((p) => {
              if (p.id === id) {
                return response.data;
              }
              return p;
            }),
          }));
        });
    },
    [allProducts],
  );

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
        if (!allProducts.length) {
          setAllProducts(pagination.data);
          const filteredProducts = pagination.data.filter((suggestion) => {
            let searchName = suggestion.name.toUpperCase();
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
            data: filteredProducts,
            offset: 0,
            numberPerPage: 20,
            pageCount: 0,
            currentData: [],
          });
        } else {
          const filteredProducts = allProducts.filter((suggestion) => {
            let searchName = suggestion.name.toUpperCase();
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
            data: filteredProducts,
            offset: 0,
            numberPerPage: 20,
            pageCount: 0,
            currentData: [],
          });
        }
      } else {
        setPagination({
          data: allProducts,
          offset: 0,
          numberPerPage: 20,
          pageCount: 0,
          currentData: [],
        });
        setAllProducts([]);
      }
    },
    [allProducts, pagination.data],
  );

  return (
    <>
      {actionType === '' ? (
        <ProductContainer>
          <p>Produtos</p>
          <input type="text" onChange={handleChangeInput} />
          {!pagination.data.length && !allProducts.length ? (
            <div>
              <Loading>
                <FiLoader size={24} />

                <p>Carregando</p>
              </Loading>
            </div>
          ) : (
            <div>
              <NewProduct>
                <button type="button" onClick={handleClickAdd}>
                  <FiPlus size={32} />
                  <span>Adicionar novo produto</span>
                </button>
              </NewProduct>
              {pagination.currentData.map((p) => (
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
                    <button
                      type="button"
                      onClick={() => handleClickHidden(p.id)}
                    >
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
        </ProductContainer>
      ) : null}
      {actionType === 'edit' ? (
        <EditProduct
          product={selectedProduct}
          setActionType={setActionType}
          setProducts={setPagination}
          pagination={pagination}
        />
      ) : null}
      {actionType === 'add' ? (
        <AddProduct
          setActionType={setActionType}
          setProducts={setPagination}
          pagination={pagination}
        />
      ) : null}
    </>
  );
};

export default Products;
