import React, { useCallback } from 'react';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import { Formik, FormikProps, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { EditContainer, FormContainer } from './styles';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface ICategory {
  id: string;
  name: string;
}

interface IAddCategoryForm {
  name: string;
}

interface Pagination {
  data: ICategory[];
  offset: number;
  numberPerPage: number;
  pageCount: number;
  currentData: ICategory[];
}

interface IAddCategoryProps {
  setActionType(action: string): void;
  setCategories(pagination: Pagination): void;
  pagination: Pagination;
}

const AddCategory: React.FC<IAddCategoryProps> = ({
  setActionType,
  setCategories,
  pagination,
}) => {
  const { addToast } = useToast();

  const addCategory = useCallback(
    async (
      data: IAddCategoryForm,
      { resetForm }: FormikHelpers<IAddCategoryForm>,
    ) => {
      try {
        await api.post('/categories', {
          name: data.name,
        });
        const response = await api.get('/categories');
        setCategories({
          ...pagination,
          data: response.data,
        });
        resetForm({});
        addToast({
          type: 'success',
          title: 'Categoria criada',
        });
        setActionType('');
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Ocorreu um erro ao criar categoria',
          description: `${err}`,
        });
      }
    },
    [addToast, setActionType, setCategories, pagination],
  );

  return (
    <EditContainer>
      <FormContainer>
        <h2>Criar Categoria</h2>
        <Formik
          enableReinitialize
          initialValues={{
            name: '',
          }}
          onSubmit={(values: IAddCategoryForm, actions) => {
            addCategory(values, actions);
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('É nencessário digitar um nome'),
          })}
        >
          {(props: FormikProps<IAddCategoryForm>) => {
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
                      id="name"
                      label="Nome"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.name ? errors.name : ''}
                      error={touched.name && Boolean(errors.name)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </CardContent>
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      type="button"
                      color="secondary"
                      disabled={isSubmitting}
                      onClick={() => setActionType('')}
                    >
                      CANCELAR
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      CRIAR CATEGORIA
                    </Button>
                  </CardActions>
                </Card>
              </Form>
            );
          }}
        </Formik>
      </FormContainer>
    </EditContainer>
  );
};

export default AddCategory;
