import React, { useRef, useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  FiLogIn,
  FiMail,
  FiLock,
  FiUser,
  FiTerminal,
  FiPhone,
  FiMapPin,
  FiMap,
  FiLoader,
} from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import logoHiguga from '../../assets/higugaLogo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import api from '../../services/api';
import cep from '../../services/cep';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
  LoadingDiv,
  Content,
  AnimationContainer,
  Background,
  ButtonContent,
} from './styles';
import { useToast } from '../../hooks/toast';

interface SignInFormValidation {
  name: string;
  zip: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
}

const Register: React.FC = () => {
  const [loadingCep, setLoadingCep] = useState(false);
  const [cityFromCep, setCityFromCep] = useState('');
  const [addressFromCep, setAddressFromCep] = useState('');
  const [allowCEPApi, setAllowCEPApi] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormValidation) => {
      try {
        formRef.current?.setErrors({});
        const real_zip = data.zip.replace(/_/g, '');
        const real_phone = data.phone.replace(/_/g, '');
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          zip: Yup.string()
            .length(9, 'CEP incompleto')
            .oneOf([real_zip, undefined], 'CEP inválido')
            .required('CEP obrigatório'),
          city: Yup.string().required('Cidade obrigatória'),
          address: Yup.string().required('Endereço obrigatório'),
          phone: Yup.string()
            .length(15, 'Telefone incompleto')
            .oneOf([real_phone, undefined], 'Telefone inválido')
            .required('Telefone obrigatório'),
          password: Yup.string().min(
            6,
            'A senha deve ter no mínimo 6 caracteres',
          ),
          confirm_password: Yup.string()
            .required('Campo obrigatório')
            .oneOf([Yup.ref('password')], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          zip,
          city,
          address,
          phone,
          password,
          confirm_password,
        } = data;

        const formData = {
          name,
          email,
          zip_code: zip,
          city,
          address,
          phone_number: phone,
          password,
          password_confirmation: confirm_password,
        };

        await api.post('/users', formData);

        history.push('/login');

        addToast({
          type: 'success',
          title: 'Perfil criado com sucesso!',
          description: 'Você já pode fazer login na aplicação',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao atualizar perfil',
          description: 'Ocorreu um erro ao atualizar as informações do perfil',
        });
      }
    },
    [addToast, history],
  );

  const handleCepChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      const remove_underline = value.replace(/_/g, '');
      if (remove_underline.length === 9 && !allowCEPApi) {
        setLoadingCep(true);
        const pureNumbers = remove_underline.replace('-', '');
        try {
          const response = await cep.get(`${pureNumbers}/json/`);
          setCityFromCep(response.data.localidade);
          setAddressFromCep(response.data.logradouro);
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Erro ao carregar informações do CEP',
          });
        }
        setAllowCEPApi(true);
      } else if (remove_underline.length < 9) {
        setAllowCEPApi(false);
      }
      setLoadingCep(false);
    },
    [allowCEPApi, addToast],
  );

  const handleCityChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCityFromCep(event.currentTarget.value);
    },
    [],
  );

  const handleAddressChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAddressFromCep(event.currentTarget.value);
    },
    [],
  );

  return (
    <Container>
      <Background />
      {loadingCep ? (
        <LoadingDiv>
          <FiLoader size={48} />
          <span>Carregando</span>
        </LoadingDiv>
      ) : null}

      <Content>
        <AnimationContainer>
          <img src={logoHiguga} alt="Logo do Depósito de Bebidas Higuga" />
          <Form
            initialData={{
              city: cityFromCep,
            }}
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <Input
              icon={FiUser}
              name="name"
              type="text"
              placeholder="Nome completo"
              disabled={loadingCep}
              mask=""
            />

            <Input
              icon={FiTerminal}
              name="zip"
              type="text"
              placeholder="CEP"
              mask="99999-999"
              disabled={loadingCep}
              onChange={handleCepChange}
            />

            <Input
              icon={FiMap}
              name="city"
              type="text"
              placeholder="Cidade"
              disabled={loadingCep}
              value={cityFromCep}
              onChange={handleCityChange}
              loadCep
              mask=""
            />

            <Input
              icon={FiMapPin}
              name="address"
              type="text"
              disabled={loadingCep}
              value={addressFromCep}
              onChange={handleAddressChange}
              placeholder="Endereço"
              loadCep
              mask=""
            />

            <Input
              icon={FiPhone}
              name="phone"
              type="text"
              placeholder="Telefone"
              disabled={loadingCep}
              mask="(99) 99999-9999"
            />

            <Input
              icon={FiMail}
              name="email"
              type="email"
              placeholder="Email"
              disabled={loadingCep}
              mask=""
            />

            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
              disabled={loadingCep}
              mask=""
            />

            <Input
              icon={FiLock}
              name="confirm_password"
              type="password"
              placeholder="Confirme sua senha"
              disabled={loadingCep}
              mask=""
            />
            <ButtonContent>
              <Button type="submit">Registrar</Button>
            </ButtonContent>
          </Form>
          <Link to="/login">
            <FiLogIn />
            Voltar para o login
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Register;
