import React, { useRef, useCallback } from 'react';
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
} from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import logoHiguga from '../../assets/higugaLogo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import {
  Container,
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
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormValidation) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          zip: Yup.string().required('CEP obrigatório'),
          city: Yup.string().required('Cidade obrigatória'),
          address: Yup.string().required('Endereço obrigatório'),
          phone: Yup.string().required('Telefone obrigatório'),
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

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoHiguga} alt="Logo do Depósito de Bebidas Higuga" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input
              icon={FiUser}
              name="name"
              type="text"
              placeholder="Nome completo"
            />

            <Input icon={FiTerminal} name="zip" type="text" placeholder="CEP" />

            <Input icon={FiMap} name="city" type="text" placeholder="Cidade" />

            <Input
              icon={FiMapPin}
              name="address"
              type="text"
              placeholder="Endereço"
            />

            <Input
              icon={FiPhone}
              name="phone"
              type="text"
              placeholder="Telefone"
            />

            <Input
              icon={FiMail}
              name="email"
              type="email"
              placeholder="Email"
            />

            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
            />

            <Input
              icon={FiLock}
              name="confirm_password"
              type="password"
              placeholder="Confirme sua senha"
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
