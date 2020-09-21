import React, { useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft, FiLogOut, FiUser, FiPhone, FiMail } from 'react-icons/fi';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import Footer from '../../components/footer';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import { useAuth } from '../../hooks/auth';

import {
  Background,
  Container,
  Header,
  ReturnButton,
  LeaveButton,
  Body,
  ButtonContent,
  SaveButton,
} from './styles';
import { useToast } from '../../hooks/toast';
import { useCart } from '../../hooks/cart';

interface ProfileFormValidation {
  name: string;
  phone: string;
  email: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signOut, user, updateUser } = useAuth();
  const { cleanCart } = useCart();
  const history = useHistory();
  const { addToast } = useToast();

  const handleSignOut = useCallback(() => {
    cleanCart();
    signOut();
  }, [signOut, cleanCart]);

  const handleSubmitNoPassword = useCallback(
    async (data: ProfileFormValidation) => {
      try {
        formRef.current?.setErrors({});
        const real_phone = data.phone.replace(/_/g, '');
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
          phone: Yup.string()
            .length(15, 'Telefone incompleto')
            .oneOf([real_phone, undefined], 'Telefone inválido')
            .required('Telefone obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, phone } = data;

        const formData = {
          name,
          email,
          phone_number: phone,
        };

        const response = await api.put('/users/profile', formData);
        updateUser(response.data);

        history.push('/profile');

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
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
    [addToast, updateUser, history],
  );

  const handleBackClick = useCallback(() => {
    history.push('/profile');
  }, [history]);

  return (
    <Background>
      <Container>
        <Header>
          <ReturnButton onClick={handleBackClick}>
            <FiArrowLeft />
          </ReturnButton>
          <LeaveButton type="button" onClick={handleSignOut}>
            <FiLogOut />
            Sair
          </LeaveButton>
        </Header>

        <Body>
          <h2>Editar Perfil</h2>
          <Form
            initialData={{
              name: user?.name,
              email: user?.email,
              phone: user?.phone_number,
            }}
            ref={formRef}
            onSubmit={handleSubmitNoPassword}
          >
            <Input
              icon={FiUser}
              name="name"
              type="text"
              placeholder="Nome completo"
              mask=""
            />

            <Input
              icon={FiPhone}
              name="phone"
              type="text"
              placeholder="Telefone"
              mask="(99) 99999-9999"
            />

            <Input
              icon={FiMail}
              name="email"
              type="email"
              placeholder="Email"
              mask=""
            />
            <ButtonContent>
              <SaveButton type="submit">Salvar</SaveButton>
            </ButtonContent>
          </Form>
        </Body>
      </Container>
      <Footer />
    </Background>
  );
};

export default Profile;
