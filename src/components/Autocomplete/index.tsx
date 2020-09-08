/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useCallback } from 'react';

import { Container } from './styles';

interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category_id: string;
  barcode: string;
  image_url?: string;
  product_image?: FormData;
}

interface IAutocompleteProps {
  suggestions: IProduct[];
}

const Autocomplete: React.FC<IAutocompleteProps> = ({ suggestions }) => {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState<IProduct[]>(
    [],
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState('');

  const onChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setUserInput(e.currentTarget.value);

      setFilteredSuggestions(
        suggestions.filter((suggestion) =>
          suggestion.name
            .toLowerCase()
            .includes(e.currentTarget.value.toLowerCase()),
        ),
      );
      setActiveSuggestion(0);
      setShowSuggestions(true);
    },
    [suggestions],
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      setActiveSuggestion(0);
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setUserInput(e.currentTarget.innerText);
    },
    [],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13) {
        setActiveSuggestion(0);
        setShowSuggestions(false);
        setUserInput(filteredSuggestions[activeSuggestion].name);
      } else if (e.keyCode === 38) {
        if (activeSuggestion === 0) {
          return;
        }

        setActiveSuggestion(activeSuggestion - 1);
      } else if (e.keyCode === 40) {
        if (activeSuggestion - 1 === filteredSuggestions.length) {
          return;
        }

        setActiveSuggestion(activeSuggestion + 1);
      }
    },
    [activeSuggestion, filteredSuggestions],
  );

  return (
    <Container>
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
      />
      {showSuggestions && userInput ? (
        <>
          {filteredSuggestions.length ? (
            <ul className="suggestions">
              {filteredSuggestions.map((suggestion, index) => {
                let className;

                if (index === activeSuggestion) {
                  className = 'suggestion-active';
                }

                return (
                  <li
                    className={className}
                    key={suggestion.name}
                    onClick={onClick}
                  >
                    {suggestion.name}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="no-suggestions">
              <em>No suggestions, you're on your own!</em>
            </div>
          )}
        </>
      ) : null}
    </Container>
  );
};

export default Autocomplete;
