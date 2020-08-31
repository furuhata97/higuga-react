import React, { useCallback } from 'react';
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
          title: 'Ocorreu um erro ao cadastra o endereço',
          description: error.data,
        });
      }
    },
    [history, addToast, updateUser, user],
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
              zip_code: Yup.string().required('É nencessário digitar um cep'),
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
              } = props;

              return (
                <Form>
                  <Card>
                    <CardContent>
                      <TextField
                        id="zip_code"
                        label="CEP"
                        value={values.zip_code}
                        onChange={handleChange}
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
