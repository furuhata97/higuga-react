import React, { useCallback, useMemo } from 'react';
import { FiTrash, FiMinusCircle, FiPlusCircle } from 'react-icons/fi';

import Select from '@material-ui/core/Select';

import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { useCart } from '../../hooks/cart';

import FooterNav from '../../components/footer';
import Header from '../../components/GenericHeader';

import { formatter } from '../../utils/moneyFormatter';

import {
  Container,
  Content,
  CartItems,
  ItemsHeader,
  ItemsContent,
  ProductTitle,
  SetQuantityButton,
  Quantity,
  HandleCardAmount,
  ItemsFooter,
} from './styles';
import { useToast } from '../../hooks/toast';

const Cart: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const {
    cart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    choosePayment,
    paymentMethod,
  } = useCart();
  const history = useHistory();

  const handleRemoveClick = useCallback(
    (id: string, quantity: number) => {
      removeFromCart(id, quantity);
    },
    [removeFromCart],
  );

  const handleIncrementClick = useCallback(
    (id: string) => {
      incrementQuantity(id);
    },
    [incrementQuantity],
  );

  const handleDecrementClick = useCallback(
    (id: string) => {
      decrementQuantity(id);
    },
    [decrementQuantity],
  );

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

  const handleChange = useCallback(
    (e) => {
      const { value } = e.target;
      choosePayment(value);
    },
    [choosePayment],
  );

  const handleCreateOrder = useCallback(() => {
    if (paymentMethod === '') {
      addToast({
        type: 'error',
        title: 'Nenhuma forma de pagamento selecionada',
        description:
          'Para finalizar o pedido, selecione uma forma de pagamento',
      });
      return;
    }
    if (!user) {
      history.push('/login');
      return;
    }

    history.push('/order-resume');
  }, [addToast, history, paymentMethod, user]);

  return (
    <>
      <Container>
        <Header back="/" text="Voltar para a loja" />
        <Content>
          <h2>Meu carrinho</h2>
          <CartItems>
            <ItemsHeader>
              <div>Produto</div>
              <div>Preço</div>
              <div>Quantidade</div>
              <div>Total</div>
              <div />
            </ItemsHeader>
            {cart.length > 0 ? (
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
                    <div>
                      <HandleCardAmount>
                        <SetQuantityButton
                          type="button"
                          onClick={() => handleDecrementClick(product.id)}
                        >
                          <FiMinusCircle />
                        </SetQuantityButton>
                        <Quantity>
                          <span>{product.quantity}</span>
                        </Quantity>
                        <SetQuantityButton
                          type="button"
                          onClick={() => handleIncrementClick(product.id)}
                        >
                          <FiPlusCircle />
                        </SetQuantityButton>
                      </HandleCardAmount>
                    </div>
                    <div className="total-field">
                      {formatter.format(product.quantity * product.price)}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={
                          () => handleRemoveClick(product.id, product.quantity)
                          // eslint-disable-next-line react/jsx-curly-newline
                        }
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </ItemsContent>
                ))}
              </div>
            ) : (
              <span style={{ color: '#333', margin: '8px' }}>
                Carrinho vazio
              </span>
            )}
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
                  <div>
                    <Select
                      style={{ fontSize: '12px' }}
                      placeholder="Forma de pagamento"
                      native
                      value={paymentMethod}
                      onChange={handleChange}
                    >
                      <option disabled aria-label="None" value="">
                        Forma de pagamento
                      </option>
                      <option value="CARTAO">Cartão</option>
                      <option value="DINHEIRO">Dinheiro</option>
                    </Select>
                  </div>
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

export default Cart;
