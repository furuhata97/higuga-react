import React, { useRef, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/higugaLogo.svg';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface ResetPasswordValidation {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordValidation) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'As senhas não batem',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/login');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao redefinir senha',
          description:
            'Ocorreu um erro ao redefinir sua senha. Tente novamente',
        });
      }
    },
    [addToast, history, location.search],
  );
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Higuga Logo" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Redefinir senha</h1>
            <Input
              icon={FiLock}
              name="password"
              placeholder="Nova senha"
              type="password"
              mask=""
            />

            <Input
              icon={FiLock}
              name="password_confirmation"
              placeholder="Confirmação da senha"
              type="password"
              mask=""
            />
            <Button type="submit">Redefinir senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
