import React, { useState, useCallback, useEffect, ChangeEvent } from 'react';

import { FiCamera } from 'react-icons/fi';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import { Formik, FormikProps, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { EditContainer, FormContainer, ImageInput } from './styles';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface ICategory {
  id: string;
  name: string;
}

interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category_id: string;
  barcode: string;
  image_url?: string;
  product_image?: FormData;
  hidden: boolean;
}

interface IEditProductForm {
  name: string;
  price: number;
  stock: number;
  barcode: string;
  category_id: string;
  image_url?: string;
}

interface Pagination {
  data: IProduct[];
  offset: number;
  numberPerPage: number;
  pageCount: number;
  currentData: IProduct[];
}

interface IEditProductProps {
  product: IProduct;
  setActionType(action: string): void;
  setProducts(pagination: Pagination): void;
  pagination: Pagination;
}

const EditProduct: React.FC<IEditProductProps> = ({
  product,
  setActionType,
  setProducts,
  pagination,
}) => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(product.category_id);
  const [uploadedFile, setUploadedFile] = useState(product.image_url);
  const [fileFormData, setFileFormData] = useState(new FormData());

  useEffect(() => {
    api
      .get('/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        addToast({
          type: 'error',
          title: 'Erro ao carregar categorias',
        });
      });
  }, [addToast]);

  const handleChangeSelect = useCallback((e) => {
    const { value } = e.target;
    setSelectedCategory(value);
  }, []);

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = new FormData();

      data.append('product_image', e.target.files[0]);
      const file = URL.createObjectURL(e.target.files[0]);
      setUploadedFile(file);
      setFileFormData(data);
    }
  }, []);

  const updateProduct = useCallback(
    async (
      data: IEditProductForm,
      { resetForm }: FormikHelpers<IEditProductForm>,
    ) => {
      try {
        fileFormData.append('id', product.id);
        fileFormData.append('name', data.name);
        fileFormData.append('price', String(data.price));
        fileFormData.append('category_id', selectedCategory);
        fileFormData.append('barcode', data.barcode);
        fileFormData.append('stock', String(data.stock));

        await api.put('/products', fileFormData);
        const response = await api.get('/products');
        setProducts({
          ...pagination,
          data: response.data,
        });
        resetForm({});
        addToast({
          type: 'success',
          title: 'Produto atualizado',
        });
        setActionType('');
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Ocorreu um erro ao atualizar o produto',
          description: `${err}`,
        });
      }
    },
    [
      addToast,
      selectedCategory,
      fileFormData,
      product.id,
      setActionType,
      setProducts,
      pagination,
    ],
  );

  return (
    <EditContainer>
      <FormContainer>
        <h2>Editar produto</h2>
        <Formik
          enableReinitialize
          initialValues={{
            image_url: product.image_url,
            name: product.name,
            price: product.price,
            category_id: product.category_id,
            barcode: product.barcode,
            stock: product.stock,
          }}
          onSubmit={(values: IEditProductForm, actions) => {
            updateProduct(values, actions);
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('É nencessário digitar um nome'),
            barcode: Yup.string().required(
              'É necessário digitar um código de barras',
            ),
            price: Yup.number().required('É necessário digitar um preço'),
            stock: Yup.number().required(
              'É necessário digitar a quantidade do estoque',
            ),
          })}
        >
          {(props: FormikProps<IEditProductForm>) => {
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
                    <ImageInput>
                      <img src={uploadedFile} alt={product.name} />
                      <label htmlFor="avatar">
                        <FiCamera />
                        <input
                          type="file"
                          id="avatar"
                          onChange={handleImageChange}
                        />
                      </label>
                    </ImageInput>
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
                    <TextField
                      id="barcode"
                      label="Código de barras"
                      value={values.barcode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.barcode ? errors.barcode : ''}
                      error={touched.barcode && Boolean(errors.barcode)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      required
                    />
                    <TextField
                      id="price"
                      label="Preço"
                      value={values.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.price ? errors.price : ''}
                      error={touched.price && Boolean(errors.price)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      required
                    />
                    <TextField
                      id="stock"
                      label="Estoque"
                      value={values.stock}
                      type="number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.stock ? errors.stock : ''}
                      error={touched.stock && Boolean(errors.stock)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      required
                    />
                    <InputLabel htmlFor="select-categoria">
                      Categoria
                    </InputLabel>
                    <Select
                      id="cateogry_id"
                      label="Categoria"
                      native
                      value={selectedCategory}
                      onChange={handleChangeSelect}
                      onBlur={handleBlur}
                      error={touched.category_id && Boolean(errors.category_id)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      required
                      inputProps={{
                        name: 'categoria',
                        id: 'select_categoria',
                      }}
                    >
                      <option disabled aria-label="None" value="" />
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
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
                      ATUALIZAR PRODUTO
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

export default EditProduct;
