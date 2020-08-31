import React, { useRef, useCallback } from 'react';
import * as Yup from 'yup';

import { FiCheckSquare, FiLock, FiXSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import { Form, ButtonContainer, SaveButton, CancelButton } from './styles';

import Modal from '../Modal';
import Input from '../Input';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

interface IUser {
  name: string;
  phone_number: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

interface IChangePassword {
  old_password: string;
  password: string;
  password_confirmation: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleChangePassword: (data: IUser) => void;
}

const ModalChangePassword: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleChangePassword,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { user } = useAuth();
  const { addToast } = useToast();

  const toggleModal = useCallback(() => {
    setIsOpen();
  }, [setIsOpen]);

  const handleSubmit = useCallback(
    async (data: IChangePassword) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          old_password: Yup.string().required('Senha atual obrigatória'),
          password: Yup.string().required('Nova senha obrigatória'),
          password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta')
            .required('Confirmação de senha obirigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { old_password, password, password_confirmation } = data;

        if (!user) {
          addToast({
            type: 'error',
            title: 'Usuário não logado',
            description:
              'No momento não há nenhum usuário logado para alterar a senha',
          });

          return;
        }

        const formData = {
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
          old_password,
          password,
          password_confirmation,
        };

        handleChangePassword(formData);
        setIsOpen();
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
    [handleChangePassword, setIsOpen, addToast, user],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Alterar senha</h1>
        <Input
          icon={FiLock}
          name="old_password"
          placeholder="Digite sua senha atual"
          type="password"
        />

        <Input
          icon={FiLock}
          name="password"
          placeholder="Digite sua nova senha"
          type="password"
        />

        <Input
          icon={FiLock}
          name="password_confirmation"
          placeholder="Confirme sua nova senha"
          type="password"
        />
        <ButtonContainer>
          <SaveButton type="submit">
            <p className="text">Alterar senha</p>
            <div className="icon">
              <FiCheckSquare size={24} />
            </div>
          </SaveButton>

          <CancelButton type="button" onClick={toggleModal}>
            <p className="text">Cancelar</p>
            <div className="icon">
              <FiXSquare size={24} />
            </div>
          </CancelButton>
        </ButtonContainer>
      </Form>
    </Modal>
  );
};

export default ModalChangePassword;
