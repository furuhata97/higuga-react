import React, { useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import logoHiguga from '../../assets/higugaLogo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Content,
  AnimationContainer,
  Background,
  ButtonContent,
} from './styles';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignInFormValidation {
  email: string;
  password: string;
}

const LogIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const history = useHistory();

  const handleStockClick = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleSubmit = useCallback(
    async (data: SignInFormValidation) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro de autenticação',
          description: 'Ocorreu um erro ao fazer login. Cheque as credenciais',
        });
      }
    },
    [addToast, history, signIn],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoHiguga} alt="Logo do Depósito de Bebidas Higuga" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input
              icon={FiMail}
              name="email"
              type="email"
              placeholder="Email"
              mask=""
            />

            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder="Senha"
              mask=""
            />
            <ButtonContent>
              <Button type="submit">Entrar</Button>
              <Button onClick={handleStockClick}>Ver estoque</Button>
            </ButtonContent>
            <a href="forgot">Esqueci minha senha</a>
          </Form>
          <Link to="/register">
            <FiLogIn />
            Criar Conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default LogIn;
