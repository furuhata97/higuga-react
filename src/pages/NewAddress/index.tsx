import React, { useCallback, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Formik, FormikProps, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { useHistory } from 'react-router-dom';
import Header from '../../components/GenericHeader';

import api from '../../services/api';
import cep from '../../services/cep';

import { Container, FormContainer } from './styles';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

interface INewAddressFrom {
  zip_code: string;
  city: string;
  address: string;
}

const NewAddress: React.FC = () => {
  const history = useHistory();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [backScape, setBackspace] = useState(false);
  const [deleteKey, setDeleteKey] = useState(false);
  const [allowSearchCep, setAllowSearchCep] = useState(true);

  const addNewAddress = useCallback(
    async (
      data: INewAddressFrom,
      { resetForm }: FormikHelpers<INewAddressFrom>,
    ) => {
      try {
        const response = await api.post('/users/new-address', {
          zip_code: data.zip_code,
          city: data.city,
          address: data.address,
        });
        const updatedUser = user;
        if (updatedUser) {
          updatedUser.addresses.push(response.data);
          updateUser(updatedUser);
          resetForm({});
          addToast({
            type: 'success',
            title: 'Novo endereço cadastrado',
          });
          history.push('/addresses');
        }
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Ocorreu um erro ao cadastrar o endereço',
          description: error.data,
        });
      }
    },
    [history, addToast, updateUser, user],
  );

  const handleChangeCep = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined,
      ) => void,
    ) => {
      if (!deleteKey) {
        const { value } = event.currentTarget;
        let regexp = /[^\w\W]/;
        switch (value.length) {
          case 1:
            regexp = /^\d{1}$/;
            break;
          case 2:
            regexp = /^\d{2}$/;
            break;
          case 3:
            regexp = /^\d{3}$/;
            break;
          case 4:
            regexp = /^\d{4}$/;
            break;
          case 5:
            regexp = /^\d{5}$/;
            break;
          case 6:
            regexp = /^\d{5}-$/;
            break;
          case 7:
            regexp = /^\d{5}-\d{1}$/;
            break;
          case 8:
            regexp = /^\d{5}-\d{2}$/;
            break;
          case 9:
            regexp = /^\d{5}-\d{3}$/;
            break;
          default:
            regexp = /[^\w\W]/;
            break;
        }

        const result = value.match(regexp);
        if (value.length === 0) {
          setFieldValue('zip_code', value);
          setAllowSearchCep(true);
          return;
        }
        if (value.length === 5 && result) {
          if (backScape) {
            setFieldValue('zip_code', value.substring(0, 4));
            setAllowSearchCep(true);
            return;
          }

          setFieldValue('zip_code', `${value}-`);
          setAllowSearchCep(true);
          return;
        }
        if (value.length === 6 && result) {
          if (backScape) {
            setFieldValue('zip_code', value.substring(0, 4));
            setAllowSearchCep(true);
          }
          return;
        }
        if (value.length <= 9 && result) {
          setFieldValue('zip_code', value);
          setAllowSearchCep(true);
        }
        if (value.length === 9 && allowSearchCep) {
          const pureNumbers = value.replace('-', '');
          cep
            .get(`${pureNumbers}/json/`)
            .then((response) => {
              if (!response.data?.erro) {
                setFieldValue('city', response.data.localidade);
                setFieldValue('address', response.data.logradouro);
              }
            })
            .catch((error) => {
              addToast({
                type: 'error',
                title: 'Erro ao carregar informações do CEP',
              });
            });

          setFieldValue('zip_code', value);
          setAllowSearchCep(false);
        }
      }
    },
    [backScape, deleteKey, allowSearchCep, addToast],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode === 8) {
        setBackspace(true);
      } else {
        setBackspace(false);
      }
      if (event.keyCode === 46) {
        setDeleteKey(true);
      } else {
        setDeleteKey(false);
      }
    },
    [],
  );

  return (
    <>
      <Container>
        <Header back="/addresses" text="Voltar" />
        <FormContainer>
          <h2>Novo Endereço</h2>
          <Formik
            initialValues={{
              zip_code: '',
              city: '',
              address: '',
            }}
            onSubmit={(values: INewAddressFrom, actions) => {
              addNewAddress(values, actions);
            }}
            validationSchema={Yup.object().shape({
              zip_code: Yup.string()
                .length(9, 'CEP incompleto')
                .required('É nencessário digitar um cep'),
              city: Yup.string().required('É necessário digitar uma cidade'),
              address: Yup.string().required(
                'É necessário digitar um endereço',
              ),
            })}
          >
            {(props: FormikProps<INewAddressFrom>) => {
              const {
                values,
                touched,
                errors,
                handleBlur,
                handleChange,
                isSubmitting,
                setFieldValue,
              } = props;

              return (
                <Form>
                  <Card>
                    <CardContent>
                      <TextField
                        id="zip_code"
                        label="CEP"
                        value={values.zip_code}
                        onChange={
                          (event) => handleChangeCep(event, setFieldValue)
                          // eslint-disable-next-line react/jsx-curly-newline
                        }
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        helperText={touched.zip_code ? errors.zip_code : ''}
                        error={touched.zip_code && Boolean(errors.zip_code)}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        required
                      />
                      <TextField
                        id="city"
                        label="Cidade"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={touched.city ? errors.city : ''}
                        error={touched.city && Boolean(errors.city)}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        required
                      />
                      <TextField
                        id="address"
                        label="Endereço"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={touched.address ? errors.address : ''}
                        error={touched.address && Boolean(errors.address)}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        required
                      />
                    </CardContent>
                    <CardActions style={{ float: 'right' }}>
                      <Button
                        type="submit"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        CADASTRAR ENDEREÇO
                      </Button>
                    </CardActions>
                  </Card>
                </Form>
              );
            }}
          </Formik>
        </FormContainer>
      </Container>
    </>
  );
};

export default NewAddress;
