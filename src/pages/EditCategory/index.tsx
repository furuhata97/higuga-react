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

interface IEditCategoryForm {
  name: string;
}

interface Pagination {
  categories: ICategory[];
  size: number;
  skip: number;
  take: number;
}

const ELEMENTS_PER_PAGE = 15;
const INITIAL_SKIP = 0;

interface IEditCategoryProps {
  category: ICategory;
  setActionType(action: string): void;
  setCategories(pagination: Pagination): void;
}

const EditCateogry: React.FC<IEditCategoryProps> = ({
  category,
  setActionType,
  setCategories,
}) => {
  const { addToast } = useToast();

  const updateCategory = useCallback(
    async (
      data: IEditCategoryForm,
      { resetForm }: FormikHelpers<IEditCategoryForm>,
    ) => {
      try {
        await api.put('/categories', {
          id: category.id,
          name: data.name,
        });
        const response = await api.get('/categories/search', {
          params: {
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
          },
        });
        setCategories({
          categories: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
        });
        resetForm({});
        addToast({
          type: 'success',
          title: 'Categoria atualizada',
        });
        setActionType('');
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Ocorreu um erro ao atualizar a categoria',
          description: `${err}`,
        });
      }
    },
    [addToast, category.id, setActionType, setCategories],
  );

  return (
    <EditContainer>
      <FormContainer>
        <h2>Editar Categoria</h2>
        <Formik
          enableReinitialize
          initialValues={{
            name: category.name,
          }}
          onSubmit={(values: IEditCategoryForm, actions) => {
            updateCategory(values, actions);
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('É nencessário digitar um nome'),
          })}
        >
          {(props: FormikProps<IEditCategoryForm>) => {
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
                      ATUALIZAR CATEGORIA
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

export default EditCateogry;
