import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Formik, FormikProps, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { useHistory, useParams } from 'react-router-dom';
import Header from '../../components/GenericHeader';

import api from '../../services/api';

import { Container, FormContainer } from './styles';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

interface IEditAddressForm {
  zip_code: string;
  city: string;
  address: string;
}

interface IParams {
  id: string;
}

interface Address {
  id: string;
  zip_code: string;
  city: string;
  address: string;
}

const EditAddress: React.FC = () => {
  const history = useHistory();
  const params = useParams<IParams>();
  const [editAddress, setEditAddress] = useState<Address>({} as Address);
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) {
      history.push('/addresses');
      return;
    }

    const address = user.addresses.find((add) => add.id === params.id);

    if (!address) {
      history.push('/addresses');
      return;
    }

    setEditAddress(address);
  }, [user, history, params]);

  const addEditAddress = useCallback(
    async (
      data: IEditAddressForm,
      { resetForm }: FormikHelpers<IEditAddressForm>,
    ) => {
      try {
        const response = await api.put('/users/update-address', {
          address_id: editAddress.id,
          zip_code: data.zip_code,
          city: data.city,
          address: data.address,
        });
        const updatedUser = user;
        if (updatedUser) {
          const add = updatedUser.addresses.map((a) => {
            if (a.id === editAddress.id) {
              return response.data;
            }
            return a;
          });
          updatedUser.addresses = add;
          updateUser(updatedUser);
          resetForm({});
          addToast({
            type: 'success',
            title: 'Endereço atualizado',
          });
          history.push('/addresses');
        }
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Ocorreu um erro ao atualizar o endereço',
          description: error.data,
        });
      }
    },
    [editAddress, history, addToast, updateUser, user],
  );

  return (
    <>
      <Container>
        <Header back="/addresses" text="Voltar" />
        <FormContainer>
          <h2>Editar endereço</h2>
          <Formik
            enableReinitialize
            initialValues={{
              zip_code: editAddress.zip_code,
              city: editAddress.city,
              address: editAddress.address,
            }}
            onSubmit={(values: IEditAddressForm, actions) => {
              addEditAddress(values, actions);
            }}
            validationSchema={Yup.object().shape({
              zip_code: Yup.string().required('É nencessário digitar um cep'),
              city: Yup.string().required('É necessário digitar uma cidade'),
              address: Yup.string().required(
                'É necessário digitar um endereço',
              ),
            })}
          >
            {(props: FormikProps<IEditAddressForm>) => {
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
                        ATUALIZAR ENDEREÇO
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

export default EditAddress;
