import React, { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  FiArrowLeft,
  FiLogOut,
  FiUser,
  FiTerminal,
  FiMap,
  FiMapPin,
  FiPhone,
  FiMail,
} from 'react-icons/fi';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
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
  ButtonContent,
  SaveButton,
  AdminArea,
  ButtonPassword,
} from './styles';
import { useToast } from '../../hooks/toast';
import { useCart } from '../../hooks/cart';

interface ProfileFormValidation {
  name: string;
  zip: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

interface ChangePasswordFormValidation {
  name: string;
  zip_code: string;
  city: string;
  address: string;
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

  const handleSubmitNoPassword = useCallback(
    async (data: ProfileFormValidation) => {
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
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, zip, city, address, phone } = data;

        const formData = {
          name,
          email,
          zip_code: zip,
          city,
          address,
          phone_number: phone,
        };

        const response = await api.put('/users/profile', formData);
        updateUser(response.data);

        // history.push('/');

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
    [addToast, updateUser],
  );

  return (
    <Background>
      <Container>
        <Header>
          <ReturnButton onClick={history.goBack}>
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
          <h2>Perfil</h2>
          <Form
            initialData={{
              name: user?.name,
              email: user?.email,
              zip: user?.zip_code,
              city: user?.city,
              address: user?.address,
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
            <ButtonContent>
              <SaveButton type="submit">Salvar</SaveButton>
            </ButtonContent>
          </Form>
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
