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

import { AddContainer, FormContainer, ImageInput } from './styles';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import noPic from '../../assets/no-pic.png';

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

interface IAddProductForm {
  name: string;
  price: number;
  stock: number;
  barcode: string;
  category_id: string;
  image?: string;
}

interface Pagination {
  products: IProduct[];
  size: number;
  skip: number;
  take: number;
  type: string;
}

const ELEMENTS_PER_PAGE = 15;
const INITIAL_SKIP = 0;
const REQUEST_TYPE = 'private';

interface IAddProductProps {
  setActionType(action: string): void;
  setProducts(pagination: Pagination): void;
}

const AddProduct: React.FC<IAddProductProps> = ({
  setActionType,
  setProducts,
}) => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadedFile, setUploadedFile] = useState(noPic);
  const [fileFormData, setFileFormData] = useState(new FormData());
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const addProduct = useCallback(
    async (
      data: IAddProductForm,
      { resetForm }: FormikHelpers<IAddProductForm>,
    ) => {
      setIsSubmitting(true);
      try {
        fileFormData.append('name', data.name);
        fileFormData.append('price', String(data.price));
        fileFormData.append('category_id', selectedCategory);
        fileFormData.append('barcode', data.barcode);
        fileFormData.append('stock', String(data.stock));

        await api.post('/products', fileFormData);
        const response = await api.get('/products', {
          params: {
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
            type: REQUEST_TYPE,
          },
        });
        setProducts({
          products: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
          type: REQUEST_TYPE,
        });
        resetForm({});
        addToast({
          type: 'success',
          title: 'Produto atualizado',
        });
        setIsSubmitting(false);
        setActionType('');
      } catch (err) {
        setIsSubmitting(false);
        const f = fileFormData;
        f.delete('name');
        f.delete('price');
        f.delete('category_id');
        f.delete('barcode');
        f.delete('stock');
        setFileFormData(f);
        addToast({
          type: 'error',
          title: 'Ocorreu um erro ao adicionar o produto',
          description: `${err.message}`,
        });
      }
    },
    [addToast, selectedCategory, fileFormData, setActionType, setProducts],
  );

  return (
    <AddContainer>
      <FormContainer>
        <h2>Adicionar produto</h2>
        <Formik
          enableReinitialize
          initialValues={{
            image: noPic,
            name: '',
            price: 0,
            category_id: '',
            barcode: '',
            stock: 0,
          }}
          onSubmit={(values: IAddProductForm, actions) => {
            if (uploadedFile !== noPic) {
              addProduct(values, actions);
            } else {
              addToast({
                type: 'error',
                title: 'É necessário adicionar uma imagem',
              });
            }
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('É nencessário digitar um nome'),
            barcode: Yup.string().required(
              'É necessário digitar um código de barras',
            ),
            price: Yup.number().required('É necessário digitar um preço'),
            stock: Yup.number().required(
              'É necessário digitar a quantidade em estoque',
            ),
          })}
        >
          {(props: FormikProps<IAddProductForm>) => {
            const { values, touched, errors, handleBlur, handleChange } = props;

            return (
              <Form>
                <Card>
                  <CardContent>
                    <ImageInput>
                      <img
                        src={uploadedFile}
                        alt="Imagem do produto a ser cadastrado"
                      />
                      <label htmlFor="image">
                        <FiCamera />
                        <input
                          type="file"
                          id="image"
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
                      inputProps={{ maxLength: 13 }}
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
                      <option disabled aria-label="none" value="" />
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
                      ADICIONAR PRODUTO
                    </Button>
                  </CardActions>
                </Card>
              </Form>
            );
          }}
        </Formik>
      </FormContainer>
    </AddContainer>
  );
};

export default AddProduct;
