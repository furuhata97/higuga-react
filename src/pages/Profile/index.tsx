import React, { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft, FiLogOut } from 'react-icons/fi';
import * as Yup from 'yup';

import { FormHandles } from '@unform/core';

import Footer from '../../components/footer';
import ModalChangePassword from '../../components/ModalChangePassword';

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
  AdminArea,
  ButtonPassword,
  ButtonEditAddresses,
  ButtonEditProfile,
  ButtonMyOrders,
} from './styles';
import { useToast } from '../../hooks/toast';
import { useCart } from '../../hooks/cart';

interface ChangePasswordFormValidation {
  name: string;
  phone_number: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { signOut, user, updateUser } = useAuth();
  const { cleanCart } = useCart();
  const history = useHistory();
  const { addToast } = useToast();

  const handleSignOut = useCallback(() => {
    cleanCart();
    signOut();
  }, [signOut, cleanCart]);

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const handleChangePassword = useCallback(
    async (data: ChangePasswordFormValidation) => {
      try {
        const response = await api.put('/users/profile', data);
        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Senha atualizada!',
          description:
            'Sua senha foi atualizada. Utilize esta senha nas próximas vezes que fizer login',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao atualizar senha',
          description: 'Ocorreu um erro ao atualizar a senha',
        });
      }
    },
    [addToast, updateUser],
  );

  const handleEditProfile = useCallback(() => {
    history.push('/edit-profile');
  }, [history]);

  const handleEditAddresses = useCallback(() => {
    history.push('/addresses');
  }, [history]);

  const handleMyOrders = useCallback(() => {
    history.push('/my-orders');
  }, [history]);

  const handleBackClick = useCallback(() => {
    history.push('/');
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
          {user?.is_admin ? (
            <AdminArea type="button">Área administrativa</AdminArea>
          ) : null}
          <ButtonEditProfile type="button" onClick={handleEditProfile}>
            Editar perfil
          </ButtonEditProfile>
          <ButtonMyOrders type="button" onClick={handleMyOrders}>
            Meus pedidos
          </ButtonMyOrders>
          <ButtonEditAddresses type="button" onClick={handleEditAddresses}>
            Meus endereços
          </ButtonEditAddresses>
          <ButtonPassword type="button" onClick={toggleModal}>
            Alterar senha
          </ButtonPassword>
          <ModalChangePassword
            isOpen={modalOpen}
            setIsOpen={toggleModal}
            handleChangePassword={handleChangePassword}
          />
        </Body>
      </Container>
      <Footer />
    </Background>
  );
};

export default Profile;
