import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

import { FiLoader, FiPlus } from 'react-icons/fi';
import ReactPaginate from 'react-paginate';

import {
  CategoryContainer,
  NewCategory,
  CategoryCard,
  CategoryButtons,
  Loading,
} from './styles';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import EditCategory from '../EditCategory';
import AddCategory from '../AddCategory';

interface ICategory {
  id: string;
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

const Categories: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchWord, setSearchWord] = useState('');
  const [actionType, setActionType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ICategory>(
    {} as ICategory,
  );
  const [pagination, setPagination] = useState<Pagination>({
    categories: [],
    take: 0,
    skip: 0,
    size: 0,
  });

  const { addToast } = useToast();

  useEffect(() => {
    api
      .get('/categories/search', {
        params: {
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
        },
      })
      .then((response) => {
        setPagination({
          categories: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
        });
      })
      .catch((err) => {
        addToast({
          title: 'Erro ao carregar categorias',
          description: err,
          type: 'error',
        });
      });
    setLoading(false);
  }, [addToast]);

  const updateSearch = (): void => {
    setLoading(true);
    if (searchWord) {
      api
        .get('/categories/search', {
          params: {
            search: searchWord,
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
          },
        })
        .then((response) => {
          setPagination({
            categories: response.data[0],
            take: ELEMENTS_PER_PAGE,
            skip: INITIAL_SKIP,
            size: response.data[1],
          });
        });
      setLoading(false);
      return;
    }

    api
      .get('/categories/search', {
        params: {
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
        },
      })
      .then((response) => {
        setPagination({
          categories: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip: INITIAL_SKIP,
          size: response.data[1],
        });
      });
    setLoading(false);
  };

  const delayedSearch = useCallback(debounce(updateSearch, 500), [searchWord]);

  useEffect(() => {
    delayedSearch();

    return delayedSearch.cancel;
  }, [searchWord, delayedSearch]);

  const handleClickEdit = useCallback((category: ICategory) => {
    setActionType('edit');
    setSelectedCategory(category);
  }, []);

  const handleClickAdd = useCallback(() => {
    setActionType('add');
  }, []);

  const handlePageClick = useCallback(
    async (e) => {
      const { selected } = e;
      const skip = selected * ELEMENTS_PER_PAGE;
      if (searchWord) {
        const response = await api.get('/categories/search', {
          params: {
            search: searchWord,
            take: ELEMENTS_PER_PAGE,
            skip,
          },
        });
        setPagination({
          categories: response.data[0],
          take: ELEMENTS_PER_PAGE,
          skip,
          size: response.data[1],
        });
        return;
      }
      const response = await api.get('/categories/search', {
        params: {
          take: ELEMENTS_PER_PAGE,
          skip,
        },
      });
      setPagination({
        categories: response.data[0],
        take: ELEMENTS_PER_PAGE,
        skip,
        size: response.data[1],
      });
    },
    [searchWord],
  );

  const handleChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchWord(event.currentTarget.value);
  };

  return (
    <>
      {actionType === '' ? (
        <CategoryContainer>
          <p>Categorias</p>
          <input type="text" onChange={handleChangeInput} value={searchWord} />
          {loading ? (
            <Loading>
              <FiLoader size={24} />

              <p>Carregando</p>
            </Loading>
          ) : null}
          {!loading && !pagination.categories.length ? (
            <div>
              <NewCategory>
                <button type="button" onClick={handleClickAdd}>
                  <FiPlus size={32} />
                  <span>Adicionar nova categoria</span>
                </button>
              </NewCategory>
            </div>
          ) : null}
          {!loading && pagination.categories.length ? (
            <div>
              <NewCategory>
                <button type="button" onClick={handleClickAdd}>
                  <FiPlus size={32} />
                  <span>Adicionar nova categoria</span>
                </button>
              </NewCategory>
              {pagination.categories.map((p) => (
                <CategoryCard key={p.id}>
                  <span>{p.name}</span>
                  <CategoryButtons>
                    <button type="button" onClick={() => handleClickEdit(p)}>
                      Editar
                    </button>
                  </CategoryButtons>
                </CategoryCard>
              ))}
            </div>
          ) : null}
          {pagination.size / pagination.take > 1 ? (
            <ReactPaginate
              previousLabel="<"
              nextLabel=">"
              breakLabel="..."
              pageCount={pagination.size / pagination.take}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              activeClassName="active"
            />
          ) : null}
        </CategoryContainer>
      ) : null}
      {actionType === 'edit' ? (
        <EditCategory
          category={selectedCategory}
          setActionType={setActionType}
          setCategories={setPagination}
        />
      ) : null}
      {actionType === 'add' ? (
        <AddCategory
          setActionType={setActionType}
          setCategories={setPagination}
        />
      ) : null}
    </>
  );
};

export default Categories;
