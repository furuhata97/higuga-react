import React, { useCallback, useMemo } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useHistory, Link } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useCart } from '../../hooks/cart';
import api from '../../services/api';

import FooterNav from '../../components/footer';

import { formatter } from '../../utils/moneyFormatter';
import logo from '../../assets/higugaLogo.svg';

import {
  Container,
  Header,
  BackButton,
  Content,
  CartItems,
  ItemsHeader,
  ItemsContent,
  ItemsFooter,
  ProductTitle,
  Address,
} from './styles';
import { useToast } from '../../hooks/toast';

const OrderResume: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { cart, paymentMethod, cleanCart } = useCart();

  const history = useHistory();

  if (cart.length === 0 || paymentMethod === '') {
    history.push('/');
  }

  const handleBackClick = useCallback(() => {
    history.push('/cart');
  }, [history]);

  const cartTotal = useMemo(() => {
    const { amount } = cart.reduce(
      (accumulator, product) => {
        accumulator.amount += product.quantity * product.price;
        return accumulator;
      },
      {
        amount: 0,
      },
    );

    return formatter.format(amount);
  }, [cart]);

  const handleCreateOrder = useCallback(async () => {
    const products = cart.map((product) => {
      return {
        product_id: product.id,
        quantity: product.quantity,
        price: product.price,
      };
    });

    try {
      await api.post('/orders', {
        products,
        payment_method: paymentMethod,
        discount: 0,
      });

      cleanCart();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao realizar pedido',
      });
    }
  }, [cart, paymentMethod, addToast, cleanCart]);

  return (
    <>
      <Container>
        <Header>
          <BackButton type="button" onClick={handleBackClick}>
            <FiArrowLeft size={24} />
            Voltar
          </BackButton>
          <img src={logo} alt="Logo do Higuga" />
        </Header>
        <Content>
          <h2>Resumo do pedido</h2>
          <small>
            Confira os dados do seu pedido. Se estiver tudo certo, confirme seu
            pedido clicando no botão ao final da página
          </small>
          <CartItems>
            <ItemsHeader>
              <div>Produto</div>
              <div>Preço</div>
              <div>Quantidade</div>
              <div>Total</div>
            </ItemsHeader>
            <div>
              {cart.map((product) => (
                <ItemsContent key={product.id}>
                  <div>
                    <ProductTitle>
                      <img
                        src={product.image_url}
                        alt={`Imagem do produto ${product.name}`}
                      />{' '}
                      {product.name}
                    </ProductTitle>{' '}
                  </div>
                  <div className="price-field">
                    {formatter.format(product.price)}
                  </div>
                  <div>{product.quantity}</div>
                  <div className="total-field">
                    {formatter.format(product.quantity * product.price)}
                  </div>
                </ItemsContent>
              ))}
            </div>
            <Address>
              <h4>Endereço de entrega:</h4>
              <p>{user?.address}</p>
              <p>
                {user?.city} - {user?.zip_code}
              </p>
              <Link to="/profile">Alterar endereço</Link>
              <h4>Forma de pagamento:</h4>
              <p>{paymentMethod === 'CARTAO' ? 'Cartão' : 'Dinheiro'}</p>
              <small>Realizar o pagamento no momento da entrega</small>
            </Address>
            {cart.length > 0 ? (
              <ItemsFooter>
                <div>
                  <div>
                    <strong>Total</strong> {cartTotal}
                  </div>
                  <div className="right-item">
                    <strong>Desconto</strong>&nbsp;R$ 0,00
                  </div>
                </div>
                <div>
                  <div className="right-item">
                    <button type="button" onClick={handleCreateOrder}>
                      Realizar pedido
                    </button>
                  </div>
                </div>
              </ItemsFooter>
            ) : null}
          </CartItems>
        </Content>
      </Container>
      <FooterNav />
    </>
  );
};

export default OrderResume;