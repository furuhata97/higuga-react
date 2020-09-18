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
  products: Product[];
  size: number;
  skip: number;
  take: number;
  type: string;
}

const ELEMENTS_PER_PAGE = 15;
const INITIAL_SKIP = 0;
const REQUEST_TYPE = 'public';

const Dashboard: React.FC = () => {
  const { searchWord } = useSearch();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 'null',
    name: 'null',
  });
  const [pagination, setPagination] = useState<Pagination>({
    products: [],
    take: 0,
    skip: 0,
    size: 0,
    type: REQUEST_TYPE,
  });

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const response = await api.get('/products', {
        params: {
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          type: REQUEST_TYPE,
        },
      });
      const getProducts = response.data[0].map((product: Product) => {
        const setQuantity = product;
        setQuantity.quantity = 0;
        return setQuantity;
      });
      setPagination({
        products: getProducts,
        take: ELEMENTS_PER_PAGE,
        skip: INITIAL_SKIP,
        size: response.data[1],
        type: REQUEST_TYPE,
      });
      setIsLoading(false);
    }

    loadProducts();
    api.get('/categories').then((response) => setCategories(response.data));
  }, []);

  useEffect(() => {
    async function searchProducts(): Promise<void> {
      setIsLoading(true);
      if (selectedCategory.name !== 'null' && searchWord !== '') {
        const response = await api.get('/products/search', {
          params: {
            search_word: searchWord,
            category_id: selectedCategory.id,
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
            type: REQUEST_TYPE,
          },
        });
        const getProducts = response.data[0].map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });
        setPagination({
          products: getProducts,
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        setIsLoading(false);
        return;
      }

      if (selectedCategory.name === 'null' && searchWord === '') {
        const response = await api.get('/products', {
          params: {
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
            type: REQUEST_TYPE,
          },
        });
        const getProducts = response.data[0].map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });
        setPagination({
          products: getProducts,
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        setIsLoading(false);
        return;
      }

      if (selectedCategory.name !== 'null') {
        const response = await api.get('/products/search', {
          params: {
            category_id: selectedCategory.id,
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
            type: REQUEST_TYPE,
          },
        });

        const getProducts = response.data[0].map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });
        setPagination({
          products: getProducts,
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        setIsLoading(false);
        return;
      }

      if (searchWord !== '') {
        const response = await api.get('/products/search', {
          params: {
            search_word: searchWord,
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
            type: REQUEST_TYPE,
          },
        });

        const getProducts = response.data[0].map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });
        setPagination({
          products: getProducts,
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        setIsLoading(false);
      }
    }

    searchProducts();
  }, [searchWord, selectedCategory]);

  const handlePageClick = useCallback(
    async (e) => {
      setIsLoading(true);
      const { selected } = e;
      const skip = selected * ELEMENTS_PER_PAGE;
      if (selectedCategory.name === 'null' && searchWord === '') {
        const response = await api.get('/products', {
          params: {
            take: ELEMENTS_PER_PAGE,
            skip,
            type: REQUEST_TYPE,
          },
        });
        const getProducts = response.data[0].map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });
        setPagination({
          products: getProducts,
          take: ELEMENTS_PER_PAGE,
          skip,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        setIsLoading(false);
        return;
      }
      if (selectedCategory.name !== 'null' && searchWord !== '') {
        const response = await api.get('/products/search', {
          params: {
            search_word: searchWord,
            category_id: selectedCategory.id,
            take: ELEMENTS_PER_PAGE,
            skip,
            type: REQUEST_TYPE,
          },
        });
        const getProducts = response.data[0].map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });
        setPagination({
          products: getProducts,
          take: ELEMENTS_PER_PAGE,
          skip,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        setIsLoading(false);
        return;
      }
      if (selectedCategory.name !== 'null') {
        const response = await api.get('/products/search', {
          params: {
            category_id: selectedCategory.id,
            take: ELEMENTS_PER_PAGE,
            skip,
            type: REQUEST_TYPE,
          },
        });

        const getProducts = response.data[0].map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });
        setPagination({
          products: getProducts,
          take: ELEMENTS_PER_PAGE,
          skip,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        setIsLoading(false);
        return;
      }
      if (searchWord !== '') {
        const response = await api.get('/products/search', {
          params: {
            search_word: searchWord,
            take: ELEMENTS_PER_PAGE,
            skip,
            type: REQUEST_TYPE,
          },
        });

        const getProducts = response.data[0].map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });
        setPagination({
          products: getProducts,
          take: ELEMENTS_PER_PAGE,
          skip,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        setIsLoading(false);
      }
    },
    [searchWord, selectedCategory.name, selectedCategory.id],
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
      const newData = pagination.products.map((product) => {
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
        products: newData,
      }));
    },
    [pagination.products, addToast],
  );

  const handleRemoveProductClick = useCallback(
    (id: string) => {
      const newData = pagination.products.map((product) => {
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
        products: newData,
      }));
    },
    [pagination.products],
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
            {isLoading ? (
              <Loading>
                <FiLoader size={24} />

                <p>Carregando</p>
              </Loading>
            ) : null}
            {!pagination.products.length && !isLoading ? (
              <Loading>
                <p>Nenhum Produto Encontrado</p>
              </Loading>
            ) : null}
            {pagination.products.map((product) => (
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
        </ProductsContainer>
      </Container>
      <FooterNav />
    </>
  );
};

export default Dashboard;
