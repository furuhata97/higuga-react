import React, { useState, useCallback, useEffect } from 'react';

import { FiPlus } from 'react-icons/fi';
import ReactPaginate from 'react-paginate';

import {
  CategoryContainer,
  NewCategory,
  CategoryCard,
  CategoryButtons,
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
  data: ICategory[];
  offset: number;
  numberPerPage: number;
  pageCount: number;
  currentData: ICategory[];
}

const Categories: React.FC = () => {
  const [actionType, setActionType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ICategory>(
    {} as ICategory,
  );
  const [pagination, setPagination] = useState<Pagination>({
    data: [],
    offset: 0,
    numberPerPage: 20,
    pageCount: 0,
    currentData: [],
  });
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    api
      .get('/categories')
      .then((response) => {
        setPagination((prevState) => ({
          ...prevState,
          data: response.data,
        }));
      })
      .catch((err) => {
        addToast({
          title: 'Erro ao carregar categorias',
          description: err,
          type: 'error',
        });
      });
  }, [addToast]);

  useEffect(() => {
    setPagination((prevState) => ({
      ...prevState,
      pageCount: prevState.data.length / prevState.numberPerPage,
      currentData: prevState.data.slice(
        pagination.offset,
        pagination.offset + pagination.numberPerPage,
      ),
    }));
  }, [pagination.data, pagination.numberPerPage, pagination.offset]);

  const handleClickEdit = useCallback((category: ICategory) => {
    setActionType('edit');
    setSelectedCategory(category);
  }, []);

  const handleClickAdd = useCallback(() => {
    setActionType('add');
  }, []);

  const handlePageClick = useCallback(
    (e) => {
      const { selected } = e;
      const offset = selected * pagination.numberPerPage;
      setPagination({ ...pagination, offset });
    },
    [pagination],
  );

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.value) {
        if (!allCategories.length) {
          setAllCategories(pagination.data);
          const filteredCategories = pagination.data.filter((suggestion) => {
            let searchName = suggestion.name.toUpperCase();
            searchName = searchName.replace(/[ÀÁÂÃÄÅ]/, 'A');
            searchName = searchName.replace(/[ÈÉÊË]/, 'E');
            searchName = searchName.replace(/[ÚÙÛ]/, 'U');
            searchName = searchName.replace(/[ÕÓÒÔ]/, 'O');
            searchName = searchName.replace(/['Ç']/, 'C');
            return searchName
              .toLowerCase()
              .includes(event.currentTarget.value.toLowerCase());
          });

          setPagination({
            data: filteredCategories,
            offset: 0,
            numberPerPage: 20,
            pageCount: 0,
            currentData: [],
          });
        } else {
          const filteredCategories = allCategories.filter((suggestion) => {
            let searchName = suggestion.name.toUpperCase();
            searchName = searchName.replace(/[ÀÁÂÃÄÅ]/, 'A');
            searchName = searchName.replace(/[ÈÉÊË]/, 'E');
            searchName = searchName.replace(/[ÚÙÛ]/, 'U');
            searchName = searchName.replace(/[ÕÓÒÔ]/, 'O');
            searchName = searchName.replace(/['Ç']/, 'C');
            return searchName
              .toLowerCase()
              .includes(event.currentTarget.value.toLowerCase());
          });

          setPagination({
            data: filteredCategories,
            offset: 0,
            numberPerPage: 20,
            pageCount: 0,
            currentData: [],
          });
        }
      } else {
        setPagination({
          data: allCategories,
          offset: 0,
          numberPerPage: 20,
          pageCount: 0,
          currentData: [],
        });
        setAllCategories([]);
      }
    },
    [allCategories, pagination.data],
  );

  return (
    <>
      {actionType === '' ? (
        <CategoryContainer>
          <p>Categorias</p>
          <input type="text" onChange={handleChangeInput} />
          <div>
            <NewCategory>
              <button type="button" onClick={handleClickAdd}>
                <FiPlus size={32} />
                <span>Adicionar nova categoria</span>
              </button>
            </NewCategory>
            {pagination.currentData.map((p) => (
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
          {pagination.currentData.length && pagination.pageCount > 0.5 ? (
            <ReactPaginate
              previousLabel="<"
              nextLabel=">"
              breakLabel="..."
              pageCount={pagination.pageCount}
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
          pagination={pagination}
        />
      ) : null}
      {actionType === 'add' ? (
        <AddCategory
          setActionType={setActionType}
          setCategories={setPagination}
          pagination={pagination}
        />
      ) : null}
    </>
  );
};

export default Categories;
