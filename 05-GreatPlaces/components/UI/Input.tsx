import React, { RefObject, useCallback } from 'react';
import { StyleSheet, TextInputProps, TextInput } from 'react-native';
import validator from 'validator';

import Colors from '../../constants/Colors';
import { RegularText, SemiBoldText } from './StyledText';
import Card from './Card';
import useColorScheme from '../../hooks/useColorScheme';
import useInputReducer, { InputActionType } from '../../hooks/useInputReducer';

interface InputProps extends TextInputProps {
  ownRef?: RefObject<TextInput>
  nextRef?: RefObject<TextInput>
  label: string
  initialValue: string
  onChangeValue: (value: string, validity: boolean) => void
  isRequired?: boolean
  isURL?: boolean
  isEmail?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

export default function Input({
  ownRef,
  nextRef,
  label,
  initialValue,
  onChangeValue,
  isRequired,
  isURL,
  isEmail,
  minLength,
  maxLength,
  min,
  max,
  ...otherProps
}: InputProps) {
  const colorScheme = useColorScheme();
  const [{
    value,
    warning,
    wasTouched,
  }, inputDispatch] = useInputReducer({
    value: initialValue,
    warning: '',
    wasTouched: false,
  });

  const onInputUpdate = useCallback((newValue: string) => {
    const payload = {
      value: newValue,
      warning: '',
    };
    if (isRequired && !newValue.trim().length) {
      payload.warning = 'The field is required!';
    } else if (isURL && !validator.isURL(newValue)) {
      payload.warning = 'The field is not a valid URL!';
    } else if (isEmail && !validator.isEmail(newValue)) {
      payload.warning = 'The field is not a valid email!';
    } else if (minLength && newValue.length < minLength) {
      payload.warning = `The field cannot be less than ${minLength} characters!`;
    } else if (maxLength && newValue.length > maxLength) {
      payload.warning = `The field cannot be longer than ${maxLength} characters!`;
    } else if (min && +newValue < min) {
      payload.warning = `The field cannot be less than ${min}!`;
    } else if (max && +newValue > max) {
      payload.warning = `The field cannot be greater than ${max}!`;
    }
    inputDispatch({
      type: InputActionType.InputUpdate,
      payload,
    });
    onChangeValue(newValue, !payload.warning);
  }, [inputDispatch, onChangeValue, isRequired, isURL, isEmail, minLength, maxLength, min, max]);

  return (
    <Card style={[styles.container, { borderColor: Colors[colorScheme].primary }]}>
      <SemiBoldText style={[styles.label, { borderColor: Colors[colorScheme].secondary }]}>
        {label}
      </SemiBoldText>
      <TextInput
        ref={ownRef}
        placeholder={label}
        value={value}
        onChangeText={onInputUpdate}
        onSubmitEditing={nextRef && (() => nextRef.current?.focus())}
        returnKeyType={nextRef && 'next'}
        blurOnSubmit={!nextRef}
        onBlur={() => inputDispatch({ type: InputActionType.InputTouched })}
        style={[styles.input, {
          borderColor: Colors[colorScheme].info,
          backgroundColor: `${Colors[colorScheme].info}11`,
        }]}
        {...otherProps}
      />
      {wasTouched && !!warning && (
        <RegularText style={[styles.warning, { color: Colors[colorScheme].error }]}>
          {warning}
        </RegularText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  input: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    minWidth: '100%',
    borderWidth: 1,
    marginTop: 10,
    padding: 5,
  },
  warning: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});
