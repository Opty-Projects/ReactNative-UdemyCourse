import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from '../store';

export default <TypedUseSelectorHook<RootState>>useSelector;
