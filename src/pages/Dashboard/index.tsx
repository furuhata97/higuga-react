import React, { useState, useEffect, useCallback } from 'react';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
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
}

interface Category {
  id: string;
  name: string;
}

const Dashboard: React.FC = () => {
  const { searchWord } = useSearch();
  const { addToCart, cart } = useCart();
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 'null',
    name: 'null',
  });

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const response = await api.get('/products');
      response.data.map((product: Product) => {
        const setQuantity = product;
        setQuantity.quantity = 0;
        return setQuantity;
      });
      setProducts(response.data);
    }

    loadProducts();
    api.get('/categories').then((response) => setCategories(response.data));
  }, []);

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

        setProducts(response.data);
        return;
      }

      if (selectedCategory.name === 'null' && searchWord === '') {
        const response = await api.get('/products');
        response.data.map((product: Product) => {
          const setQuantity = product;
          setQuantity.quantity = 0;
          return setQuantity;
        });
        setProducts(response.data);
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

        setProducts(response.data);
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

        setProducts(response.data);
      }
    }

    searchProducts();
  }, [searchWord, selectedCategory]);

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
      setProducts(
        products.map((product) => {
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
        }),
      );
      console.log(cart);
    },
    [products, addToast, cart],
  );

  const handleRemoveProductClick = useCallback(
    (id: string) => {
      setProducts(
        products.map((product) => {
          if (product.id !== id) {
            return product;
          }
          if (product.quantity - 1 < 0) {
            return product;
          }
          const changeQuantity = product;
          changeQuantity.quantity -= 1;
          return changeQuantity;
        }),
      );
    },
    [products],
  );

  const handleAddToCartClick = useCallback(
    (product: Product) => {
      console.log('ADD To CART');
      console.log(cart);
      addToCart(product);
    },
    [addToCart, cart],
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
            {products.length === 0 ? <h3>Nenhum produto encontrado</h3> : null}
            {products.map((product) => (
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
                  <button
                    type="button"
                    onClick={() => handleAddToCartClick(product)}
                  >
                    ADICIONAR AO CARRINHO
                  </button>
                </HandleCardAmount>
              </ProductCard>
            ))}
          </FoundProductsContainer>
        </ProductsContainer>
      </Container>
      <FooterNav />
    </>
  );
};

export default Dashboard;
