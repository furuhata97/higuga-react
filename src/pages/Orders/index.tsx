import React, { useEffect, useState, useCallback } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { format, parseISO, subHours } from 'date-fns';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

import { formatter } from '../../utils/moneyFormatter';

import logo from '../../assets/higugaLogo.svg';
import FooterNav from '../../components/footer';
import Header from '../../components/GenericHeader';
import {
  Container,
  OrdersContainer,
  OrderContent,
  OrderTitle,
  ProductDetail,
  OrderFooter,
} from './styles';

interface IProduct {
  name: string;
  image_url: string;
}

interface OrderProducts {
  id: string;
  product_id: string;
  price: string;
  quantity: number;
  product: IProduct;
}

interface IOrder {
  id: string;
  total: string;
  status: string;
  payment_method: string;
  discount: string;
  order_products: OrderProducts[];
  created_at: string;
  zip_code: string;
  address: string;
  city: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const history = useHistory();

  useEffect(() => {
    api.get('/orders/my-orders').then((response) => setOrders(response.data));
  }, []);

  function formatDate(date: string): string {
    const parsedDate = parseISO(date);
    const realDate = subHours(parsedDate, 3);
    const formattedDate = format(realDate, 'dd/MM/yyyy HH:mm');

    return formattedDate;
  }

  return (
    <>
      <Container>
        <Header back="/profile" text="Voltar" />
        {orders.length > 0 ? (
          <OrdersContainer>
            <h2>Seus pedidos</h2>
            {orders.map((o) => (
              <OrderContent key={o.id}>
                <OrderTitle>
                  <span>Pedido {o.id}</span>
                  <span>{formatDate(o.created_at)}</span>
                </OrderTitle>
                {o.order_products.map((op) => (
                  <ProductDetail key={op.id}>
                    <div>
                      <img
                        src={op.product.image_url}
                        alt={`Imagem do produto ${op.product.name}`}
                      />
                      <p>{op.product.name}</p>
                    </div>

                    <div>{op.price} un.</div>
                    <div>{op.quantity} un.</div>
                    <div>
                      Total: {formatter.format(Number(op.price) * op.quantity)}
                    </div>
                  </ProductDetail>
                ))}
                <OrderFooter>
                  <em>
                    {o.address} - {o.city} CEP: {o.zip_code}
                  </em>
                  <br />
                  <strong>
                    Desconto {formatter.format(Number(o.discount))}
                  </strong>
                  <strong>Total {formatter.format(Number(o.total))}</strong>
                  <strong>
                    Método de pagamento:{' '}
                    {o.payment_method === 'CARTAO' ? 'Cartão' : 'Dinheiro'}
                  </strong>
                  <strong>Status: {o.status}</strong>
                </OrderFooter>
              </OrderContent>
            ))}
          </OrdersContainer>
        ) : (
          <div>Nennhum pedido encontrado</div>
        )}
      </Container>
      <FooterNav />
    </>
  );
};

export default Orders;
