import React, { useState, useEffect, useCallback } from 'react';
import { FiMinusCircle, FiPlusCircle, FiLoader } from 'react-icons/fi';
import ReactPaginate from 'react-paginate';
import HeaderNav from '../../components/header';
import FooterNav from '../../components/footer';

import {
  Container,
  CategoriesContainer,
  CategoryContent,
  CategoryTitle,
  CategoryButton,
  CategoryContainerTitle,
  ProductsContainer,
  SearchTyped,
  CategorySelected,
  FoundProductsContainer,
  Loading,
  ProductCard,
  ProductImage,
  ProductInfo,
  HandleCardAmount,
  Quantity,
  SetQuantityButton,
} from './styles';

import api from '../../services/api';
import { useSearch } from '../../hooks/search';
import { useToast } from '../../hooks/toast';
import { useCart } from '../../hooks/cart';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  quantity: number;
  hidden: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Pagination {
  data: Product[];
  offset: number;
  numberPerPage: number;
  pageCount: number;
  currentData: Product[];
}

const Dashboard: React.FC = () => {
  const { searchWord } = useSearch();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 'null',
    name: 'null',
  });
  const [pagination, setPagination] = useState<Pagination>({
    data: [],
    offset: 0,
    numberPerPage: 20,
    pageCount: 0,
    currentData: [],
  });

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const response = await api.get('/products');
      response.data.map((product: Product) => {
        const setQuantity = product;
        setQuantity.quantity = 0;
        return setQuantity;
      });
      const visibleProducts = response.data.filter((p: Product) => !p.hidden);
      setPagination((prevState) => ({
        ...prevState,
        data: visibleProducts,
      }));
    }

    loadProducts();
    api.get('/categories').then((response) => setCategories(response.data));
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

  useEffect(() => {
    async function searchProducts(): Promise<void> {
      if (selectedCategory.name !== 'null' && searchWord !== '') {
        const response = await api.get('/products/search', {
          params: {
            search_word: searchWord,
            category_id: selectedCategory.id,
          },
        });

        response.data.map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });

        const visibleProducts = response.data.filter((p: Product) => !p.hidden);

        setPagination({
          data: visibleProducts,
          offset: 0,
          numberPerPage: 20,
          pageCount: 0,
          currentData: [],
        });
        return;
      }

      if (selectedCategory.name === 'null' && searchWord === '') {
        const response = await api.get('/products');

        response.data.map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });

        const visibleProducts = response.data.filter((p: Product) => !p.hidden);

        setPagination({
          data: visibleProducts,
          offset: 0,
          numberPerPage: 20,
          pageCount: 0,
          currentData: [],
        });
        return;
      }

      if (selectedCategory.name !== 'null') {
        const response = await api.get('/products/search', {
          params: {
            category_id: selectedCategory.id,
          },
        });

        response.data.map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });

        const visibleProducts = response.data.filter((p: Product) => !p.hidden);

        setPagination({
          data: visibleProducts,
          offset: 0,
          numberPerPage: 20,
          pageCount: 0,
          currentData: [],
        });
        return;
      }

      if (searchWord !== '') {
        const response = await api.get('/products/search', {
          params: {
            search_word: searchWord,
          },
        });

        response.data.map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });

        const visibleProducts = response.data.filter((p: Product) => !p.hidden);

        setPagination({
          data: visibleProducts,
          offset: 0,
          numberPerPage: 20,
          pageCount: 0,
          currentData: [],
        });
      }
    }

    searchProducts();
  }, [searchWord, selectedCategory]);

  const handlePageClick = useCallback(
    (e) => {
      const { selected } = e;
      const offset = selected * pagination.numberPerPage;
      setPagination({ ...pagination, offset });
    },
    [pagination],
  );

  const handleCategoryButtonClick = useCallback(
    (cateogry: Category) => {
      if (selectedCategory.name === cateogry.name) {
        setSelectedCategory({ id: 'null', name: 'null' });
      } else {
        setSelectedCategory(cateogry);
      }
    },
    [selectedCategory],
  );

  const handleAddProductClick = useCallback(
    (id: string) => {
      const newData = pagination.data.map((product) => {
        if (product.id !== id) {
          return product;
        }
        if (product.stock < product.quantity + 1) {
          addToast({
            type: 'error',
            title: 'Estoque insuficiente',
            description:
              'A quantidade solicitada é maior que o disponível em estoque',
          });
          return product;
        }

        const changeQuantity = product;
        changeQuantity.quantity += 1;
        return changeQuantity;
      });

      setPagination((oldState) => ({
        ...oldState,
        data: newData,
      }));
    },
    [pagination.data, addToast],
  );

  const handleRemoveProductClick = useCallback(
    (id: string) => {
      const newData = pagination.data.map((product) => {
        if (product.id !== id) {
          return product;
        }
        if (product.quantity - 1 < 0) {
          return product;
        }
        const changeQuantity = product;
        changeQuantity.quantity -= 1;
        return changeQuantity;
      });

      setPagination((oldState) => ({
        ...oldState,
        data: newData,
      }));
    },
    [pagination.data],
  );

  const handleAddToCartClick = useCallback(
    (product: Product) => {
      addToCart(product);
    },
    [addToCart],
  );

  return (
    <>
      <HeaderNav />
      <Container>
        <CategoriesContainer>
          <CategoryContainerTitle>Categorias</CategoryContainerTitle>
          {categories.map((category) => (
            <CategoryContent key={category.id}>
              <CategoryButton
                selected={selectedCategory.name === category.name}
                type="button"
                onClick={() => handleCategoryButtonClick(category)}
              >
                <CategoryTitle>{category.name}</CategoryTitle>
              </CategoryButton>
            </CategoryContent>
          ))}
        </CategoriesContainer>

        <ProductsContainer>
          <SearchTyped>
            {searchWord !== '' ? (
              <p>
                Você buscou por <span>&quot;{searchWord}&quot;</span>
              </p>
            ) : null}
          </SearchTyped>
          {selectedCategory.name !== 'null' ? (
            <CategorySelected>
              <p>
                Você selecionou a categoria{' '}
                <span>&quot;{selectedCategory.name}&quot;</span>
              </p>
            </CategorySelected>
          ) : null}

          <FoundProductsContainer>
            {!pagination.currentData.length && pagination.data.length ? (
              <Loading>
                <FiLoader size={24} />

                <p>Carregando</p>
              </Loading>
            ) : null}
            {!pagination.currentData.length && !pagination.data.length ? (
              <Loading>
                <p>Nenhum Produto Encontrado</p>
              </Loading>
            ) : null}
            {pagination.currentData.map((product) => (
              <ProductCard key={product.id}>
                <div className="top-product">
                  <ProductImage>
                    <img src={product.image_url} alt="" />
                  </ProductImage>
                  <ProductInfo>
                    <p>R$ {product.price}</p>
                    <p>{product.name}</p>
                  </ProductInfo>
                </div>
                <HandleCardAmount>
                  <div>
                    <SetQuantityButton
                      type="button"
                      onClick={() => handleRemoveProductClick(product.id)}
                    >
                      <FiMinusCircle />
                    </SetQuantityButton>
                    <Quantity>
                      <span>{product.quantity}</span>
                    </Quantity>
                    <SetQuantityButton
                      type="button"
                      onClick={() => handleAddProductClick(product.id)}
                    >
                      <FiPlusCircle />
                    </SetQuantityButton>
                  </div>
                  {product.stock === 0 ? (
                    <button type="button" disabled>
                      ESGOTADO
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddToCartClick(product)}
                    >
                      ADICIONAR AO CARRINHO
                    </button>
                  )}
                </HandleCardAmount>
              </ProductCard>
            ))}
          </FoundProductsContainer>
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
        </ProductsContainer>
      </Container>
      <FooterNav />
    </>
  );
};

export default Dashboard;
