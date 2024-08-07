/**
 * Wrapper for debouncing search inputs.
 */
import React from 'react';
import useConstant from 'use-constant';
import { debounce } from 'lodash';

interface BasicInputProps {
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export function withDebounce<P extends BasicInputProps>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P> {
  return function WrappedWithDebounce({ onChange, value, ...props }) {
    const [inputText, setInputText] = React.useState('');
    const handleInputTextChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setInputText(event.target.value);
    };
    const handleChange = (s: string) => {
      if (onChange) {
        onChange({
          target: { value: s },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    const debouncedHandleChange = useConstant(() =>
      debounce(handleChange, 250, { leading: false, trailing: true }),
    );
    React.useEffect(() => {
      debouncedHandleChange(inputText);
    }, [debouncedHandleChange, inputText]);
    React.useEffect(() => {
      setInputText((value as string) || '');
    }, [value]);
    return (
      <WrappedComponent
        {...(props as P)}
        onChange={handleInputTextChange}
        value={inputText}
      />
    );
  };
}
