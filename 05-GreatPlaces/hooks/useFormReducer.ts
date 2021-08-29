import { useReducer } from 'react';

export enum FormActionType { InputUpdate}

interface Value {
  value: string
  validity: boolean
}

interface State<L extends keyof any> {
  values: Record<L, Value>
  isValid: boolean
}

type Action<L extends keyof any> = {
  type: FormActionType.InputUpdate
  payload: {
    label: L
    value: Value
  }
};

export default function useFormReducer<L extends keyof any>(initialState: State<L>) {
  return useReducer((state: State<L>, action: Action<L>): State<L> => {
    switch (action.type) {
      case FormActionType.InputUpdate:
        const { values } = state;
        const {
          label,
          value,
        } = action.payload;
        values[label] = value;
        return {
          ...state,
          values,
          isValid: Object.values<Value>(values)
            .every((v) => v.validity),
        };
      default:
        return state;
    }
  }, initialState);
}
