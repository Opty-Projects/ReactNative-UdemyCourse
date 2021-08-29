import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { documentDirectory, moveAsync } from 'expo-file-system';
import axios from 'axios';

import { GOOGLE_API_KEY } from '@env';
import Place, { PlacePayload } from '../../models/Place';
import insertPlace from '../../db/insertPlace';
import selectAllPlaces from '../../db/selectAllPlaces';
import {
  onPending, onFulfilled, onUpdate, onError,
} from '../../utils/ThunkActions';

interface AddPlacePayload {
  title: string
  thumbnailUri: string
  latitude: number
  longitude: number
}

interface State {
  places: Place[]
  isLoading: boolean
}

const initialState: State = {
  places: [],
  isLoading: false,
};

export const loadPlaces = createAsyncThunk<Partial<State>>(
  'places/loadPlaces',
  async () => {
    const { rows } = await selectAllPlaces();
    const places: Place[] = [];
    for (let i = 0; i < rows.length; i += 1) {
      places.push({
        ...rows.item(i),
        id: rows.item(i).id.toString(),
      });
    }
    return { places };
  },
);

export const addPlace = createAsyncThunk<Place, AddPlacePayload>(
  'places/newPlace',
  async (payload) => {
    const { thumbnailUri, latitude, longitude } = payload;

    if (!documentDirectory) {
      throw new Error('It is currently not possible to save the thumbnail.');
    }
    const newThumbnailUri = documentDirectory + thumbnailUri.split('/').pop();
    await moveAsync({ from: thumbnailUri, to: newThumbnailUri });

    const response = await axios.get<{ results: [{ formatted_address: string }] }>(
      'https://maps.googleapis.com/maps/api/geocode/json'
            + `?latlng=${latitude},${longitude}`
            + `&key=${GOOGLE_API_KEY}`,
    );
    if (response.status !== 200) throw new Error('Error translating coordinates to address!');

    const newPlace: PlacePayload = {
      ...payload,
      thumbnailUri: newThumbnailUri,
      address: response.data.results[0].formatted_address,
    };
    const { insertId } = await insertPlace(newPlace);
    return { id: insertId.toString(), ...newPlace };
  },
);

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadPlaces.pending, onPending);
    builder.addCase(addPlace.pending, onPending);
    builder.addCase(loadPlaces.fulfilled, onUpdate);
    builder.addCase(addPlace.fulfilled, (state, action) => {
      state.places.push(action.payload);
      onFulfilled(state, 'Place successfully added!', 'It will now be available on your list of places.');
    });
    builder.addCase(loadPlaces.rejected, (state, action) => onError(state, action, 'Error fetching places from DB!'));
    builder.addCase(addPlace.rejected, (state, action) => onError(state, action, 'Error creating the place!'));
  },
});

export default placesSlice.reducer;
