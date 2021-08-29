import { useReducer } from 'react';

export enum InputActionType { InputUpdate, InputTouched }

interface State {
  value: string
  warning: string
  wasTouched: boolean
}

type Action = {
  type: InputActionType.InputUpdate
  payload: {
    value: string
    warning: string
  }
} | {
  type: InputActionType.InputTouched
};

export default function useInputReducer(initialState: State) {
  return useReducer((state: State, action: Action): State => {
    switch (action.type) {
      case InputActionType.InputUpdate:
        const {
          value,
          warning,
        } = action.payload;
        return {
          ...state,
          value,
          warning,
        };
      case InputActionType.InputTouched:
        return {
          ...state,
          wasTouched: true,
        };
      default:
        return state;
    }
  }, initialState);
}
