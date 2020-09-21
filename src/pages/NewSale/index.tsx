/* eslint-disable no-restricted-globals */
import React, { useState, useCallback, useEffect } from 'react';
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import { Result } from '@zxing/library';
import { FiPlus, FiTrash } from 'react-icons/fi';
import swal from 'sweetalert';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import {
  Container,
  AddProduct,
  Camera,
  CameraButtons,
  CancelButton,
  DigitButton,
  ProductCard,
  Total,
  SubmitButton,
} from './styles';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import { formatter } from '../../utils/moneyFormatter';
import CurrencyInput from '../../components/InputCurrency';

interface IProduct {
  name: string;
  product_id: string;
  quantity: number;
  price: number;
  image_url: string;
  stock: number;
}

interface IProductToSend {
  product_id: string;
  quantity: number;
  price: number;
}

interface IData {
  products: IProductToSend[];
  client_name: string;
  payment_method: string;
  discount?: number;
  money_received?: number;
}

const NewSale: React.FC = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [allowRead, setAllowRead] = useState(false);
  const [typeCode, setTypeCode] = useState(false);
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('0,00');
  const [barcode, setBarcode] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [money, setMoney] = useState('0,00');
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  const handleWebcamUpdate = useCallback(
    (err: unknown, result: Result | undefined) => {
      if (result) {
        api
          .get('/products/barcode', {
            params: {
              barcode: result.getText(),
            },
          })
          .then((response) => {
            const prod = products;
            const productExists = prod.find(
              (p) => p.product_id === response.data.id,
            );
            if (productExists) {
              prod.map((p) => {
                if (p.product_id === response.data.id) {
                  const updateProduct = p;
                  updateProduct.quantity += 1;
                  return updateProduct;
                }
                return p;
              });
            } else {
              prod.push({
                name: response.data.name,
                product_id: response.data.id,
                quantity: 1,
                price: response.data.price,
                image_url: response.data.image_url,
                stock: response.data.stock,
              });
            }
            const amount = prod.reduce((acc, product) => {
              let t = acc;
              t += product.quantity * product.price;
              return t;
            }, 0);
            setTotal(amount);
            setSubtotal(amount);
            setProducts(prod);
            setAllowRead(false);
          })
          .catch((error) => {
            addToast({
              type: 'error',
              title: 'Produto não encontrado',
            });
          });
      }
    },
    [products, addToast],
  );

  const handleChangeInputName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.currentTarget.value);
    },
    [],
  );

  useEffect(() => {
    if (discount === '0,00') {
      setSubtotal(total);
      return;
    }
    const parsedDiscount = Number(discount.replace(',', '.'));
    setSubtotal(total - parsedDiscount);
  }, [discount, total]);

  const handleChangeInputBarcode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBarcode(event.currentTarget.value);
      if (event.currentTarget.value) {
        if (event.currentTarget.value.length === 13) {
          api
            .get('/products/barcode', {
              params: {
                barcode: event.currentTarget.value,
              },
            })
            .then((response) => {
              const prod = products;
              const productExists = prod.find(
                (p) => p.product_id === response.data.id,
              );
              if (productExists) {
                prod.map((p) => {
                  if (p.product_id === response.data.id) {
                    const updateProduct = p;
                    updateProduct.quantity += 1;
                    return updateProduct;
                  }
                  return p;
                });
              } else {
                prod.push({
                  name: response.data.name,
                  product_id: response.data.id,
                  quantity: 1,
                  price: response.data.price,
                  image_url: response.data.image_url,
                  stock: response.data.stock,
                });
              }
              const amount = prod.reduce((acc, product) => {
                let t = acc;
                t += product.quantity * product.price;
                return t;
              }, 0);
              setTotal(amount);
              setSubtotal(amount);
              setProducts(prod);
              setAllowRead(false);
              setBarcode('');
            })
            .catch((error) => {
              addToast({
                type: 'error',
                title: 'Produto não encontrado',
              });
            });
        } else if (event.currentTarget.value.length > 13) {
          setBarcode(barcode.substring(0, 13));
        }
      }
    },
    [addToast, products, barcode],
  );

  const handleSubmit = useCallback(() => {
    if (!products.length) {
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Adicione pelo menos um produto para a venda',
      });
      return;
    }

    if (name === '') {
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Preencha o nome do cliente',
      });
      return;
    }

    if (selectedPayment === '') {
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Selecione a forma de pagamento',
      });
      return;
    }

    if (selectedPayment === 'DINHEIRO' && money === '0,00') {
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Preencha a quantidade em dinheiro recebida',
      });
      return;
    }

    if (
      selectedPayment === 'DINHEIRO' &&
      Number(money.replace(',', '.')) < subtotal
    ) {
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Dinheiro recebido menor que o total',
      });
      return;
    }

    if (subtotal < 0) {
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'O desconto excedeu o total da compra',
      });
      return;
    }

    const productsForSale = products.map((p) => {
      return {
        product_id: p.product_id,
        quantity: p.quantity,
        price: p.price,
      };
    });

    const dataToSend: IData = {
      client_name: name,
      payment_method: selectedPayment,
      products: productsForSale,
    };

    if (discount !== '0,00') {
      dataToSend.discount = Number(discount.replace(',', '.'));
    }

    if (selectedPayment === 'DINHEIRO') {
      dataToSend.money_received = Number(money.replace(',', '.'));
    }

    api
      .post('/sales', dataToSend)
      .then((response) => {
        setProducts([]);
        setAllowRead(false);
        setTypeCode(false);
        setName('');
        setDiscount('0');
        setBarcode('');
        setSelectedPayment('');
        setMoney('0');
        setTotal(0);
        setSubtotal(0);

        addToast({
          type: 'success',
          title: 'Venda realizada com sucesso',
        });
      })
      .catch((error) => {
        addToast({
          type: 'error',
          title: 'Erro ao realizar venda',
          description: `${error.message}`,
        });
      });
  }, [products, name, selectedPayment, money, discount, subtotal, addToast]);

  const handleAllowRead = useCallback(() => {
    if (!allowRead === false) {
      setBarcode('');
    }
    setAllowRead(!allowRead);
  }, [allowRead]);

  const handleTypeCode = useCallback(() => {
    if (!typeCode === false) {
      setBarcode('');
    }
    setTypeCode(!typeCode);
  }, [typeCode]);

  const handleQuantity = useCallback(
    (product: IProduct) => {
      swal({
        title: 'Insira a quantidade',
        content: {
          element: 'input',
          attributes: {
            placeholder: 'Digite a quantidade',
            type: 'number',
            min: '0',
          },
        },
        buttons: ['Cancelar', 'Alterar'],
      })
        .then((quantityValue) => {
          if (quantityValue) {
            if (Number(quantityValue) > product.stock) {
              throw new Error();
            }
            const updateQuantity = products.map((p) => {
              if (p.product_id === product.product_id) {
                const updateProduct = p;
                updateProduct.quantity = Number(quantityValue);
                return product;
              }
              return p;
            });
            const amount = updateQuantity.reduce((acc, prod) => {
              let t = acc;
              t += prod.quantity * prod.price;
              return t;
            }, 0);
            setTotal(amount);
            setSubtotal(amount);
            setProducts(updateQuantity);
          }
        })
        .catch(() => {
          swal('Estoque indisponível', {
            icon: 'error',
          });
        });
    },
    [products],
  );

  const handleChangeSelect = useCallback((e) => {
    const { value } = e.target;
    setSelectedPayment(value);
  }, []);

  const handleWidthValue = useCallback(() => {
    const screenWidth = screen.width;
    if (screenWidth <= 500) {
      return screenWidth - 5;
    }
    if (screenWidth > 500 && screenWidth <= 700) {
      return 500 - 150;
    }
    if (screenWidth > 700 && screenWidth <= 900) {
      return 700 - 150;
    }
    return 900 - 155;
  }, []);

  const handleDeleteClick = useCallback(
    (id: string) => {
      const remainingProducts = products.filter((p) => p.product_id !== id);
      setProducts(remainingProducts);
    },
    [products],
  );

  return (
    <Container>
      <h3>Nova venda</h3>
      {!allowRead ? (
        <>
          {products.map((product) => (
            <ProductCard key={product.product_id}>
              <img src={product.image_url} alt={product.name} />
              <div>{product.name}</div>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => handleQuantity(product)}
                onKeyDown={() => handleQuantity(product)}
                role="button"
                tabIndex={0}
              >
                {product.quantity}
              </div>
              <div>{formatter.format(product.quantity * product.price)}</div>
              <button
                type="button"
                onClick={() => handleDeleteClick(product.product_id)}
              >
                <FiTrash size={14} />
              </button>
            </ProductCard>
          ))}
          <AddProduct type="button" onClick={handleAllowRead}>
            <FiPlus />
            Adicionar produto
          </AddProduct>
          {products.length ? (
            <Total>Total {formatter.format(subtotal)}</Total>
          ) : null}
          <br />
          <TextField
            id="name"
            label="Nome do Cliente"
            type="text"
            value={name}
            onChange={handleChangeInputName}
            margin="dense"
            variant="outlined"
            fullWidth
            required
          />
          <br />
          <FormControl variant="outlined">
            <InputLabel htmlFor="select_pagamento_label">
              Forma de pagamento
            </InputLabel>
            <Select
              native
              value={selectedPayment}
              onChange={handleChangeSelect}
              fullWidth
              required
              label="Forma de pagamento"
              inputProps={{
                name: 'payment',
                id: 'select_pagamento_label',
              }}
            >
              <option disabled aria-label="None" value="" />
              <option value="DINHEIRO">Dinheiro</option>
              <option value="CARTAO">Cartão</option>
              <option value="FIADO">Fiado</option>
            </Select>
          </FormControl>
          <br />
          <CurrencyInput
            separator=","
            name="Desconto"
            value={discount}
            setValue={setDiscount}
          />
          <br />
          <CurrencyInput
            disabled={selectedPayment !== 'DINHEIRO'}
            separator=","
            name="Dinheiro recebido"
            value={money}
            setValue={setMoney}
          />
          <br />
          {selectedPayment === 'DINHEIRO' &&
          Number(money.replace(',', '.')) > subtotal ? (
            <>
              <div>
                Troco:{' '}
                {formatter.format(Number(money.replace(',', '.')) - subtotal)}
              </div>
              <br />
            </>
          ) : null}
          <SubmitButton type="button" onClick={handleSubmit}>
            Confirmar venda
          </SubmitButton>
        </>
      ) : (
        <Camera>
          {typeCode ? (
            <TextField
              id="barcode"
              label="Código de barras"
              type="text"
              value={barcode}
              onChange={handleChangeInputBarcode}
              margin="dense"
              variant="outlined"
              fullWidth
              required
            />
          ) : (
            <BarcodeScannerComponent
              width={handleWidthValue()}
              height={handleWidthValue()}
              onUpdate={(err, result) => handleWebcamUpdate(err, result)}
            />
          )}
          <CameraButtons>
            <CancelButton type="button" onClick={handleAllowRead}>
              Cancelar
            </CancelButton>
            <DigitButton type="button" onClick={handleTypeCode}>
              {typeCode ? 'Usar câmera' : 'Digitar código'}
            </DigitButton>
          </CameraButtons>
        </Camera>
      )}
    </Container>
  );
};

export default NewSale;
