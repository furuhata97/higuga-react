import React, { useCallback, useState, InputHTMLAttributes } from 'react';
import { toCurrency } from './services';

import { Container } from './styles';

interface CurrencyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  currencySymbol?: string;
  separator?: '.' | ',';
  setValue?: (value: string) => void;
  name?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  currencySymbol,
  separator,
  setValue,
  name,
  ...props
}) => {
  const { value, disabled } = props;
  const [inputValue, setInputValue] = useState(
    !value || value === '0,00' ? '0,00' : value,
  );
  const [selected, setSelected] = useState(false);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.currentTarget.value.length < 2) return;
      const valueAsCurrency = toCurrency(event.target.value, separator);
      setInputValue(valueAsCurrency);
      if (setValue) {
        setValue(valueAsCurrency);
      }
    },
    [separator, setValue],
  );

  return (
    <Container
      onFocus={() => setSelected(true)}
      onBlur={() => setSelected(false)}
      disabled={disabled || false}
      selected={selected}
    >
      {name ? <legend className="name">{name}</legend> : null}

      <div>
        <span>{currencySymbol || 'R$'}&nbsp;</span>
        <input
          type="text"
          {...props}
          value={inputValue}
          onChange={handleChange}
        />
      </div>
    </Container>
  );
};

export default CurrencyInput;
