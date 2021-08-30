import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { documentDirectory, moveAsync } from 'expo-file-system';
import axios from 'axios';

import { GOOGLE_API_KEY } from '../../extra';
import Place, { PlacePayload } from '../../models/Place';
import selectAllPlaces from '../../db/selectAllPlaces';
import insertPlace from '../../db/insertPlace';
import deletePlace from '../../db/deletePlace';
import {
  onPending, onFulfilled, onUpdate, onError,
} from '../../utils/ThunkActions';

interface AddPlacePayload {
  title: string
  thumbnailUri: string
  latitude: number
  longitude: number
}

interface RemovePlacePayload {
  placeId: string
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
  'places/addPlace',
  async (payload) => {
    const { thumbnailUri, latitude, longitude } = payload;

    if (!documentDirectory) {
      throw new Error('It is currently not possible to save the thumbnail.');
    }
    const newThumbnailUri = documentDirectory + thumbnailUri.split('/').pop();
    await moveAsync({ from: thumbnailUri, to: newThumbnailUri });

    const response = await axios.get<{ results: [{ formatted_address: string }] }>(
      'https://maps.googleapis.com/maps/api/geocode/json'
            + `?key=${GOOGLE_API_KEY}`
            + `&latlng=${latitude},${longitude}`,
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

export const removePlace = createAsyncThunk<RemovePlacePayload, RemovePlacePayload>(
  'places/removePlace',
  async (payload) => {
    const { placeId } = payload;
    await deletePlace(placeId);
    return payload;
  },
);

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadPlaces.pending, onPending);
    builder.addCase(addPlace.pending, onPending);
    builder.addCase(removePlace.pending, onPending);
    builder.addCase(loadPlaces.fulfilled, onUpdate);
    builder.addCase(addPlace.fulfilled, (state, action) => {
      state.places.push(action.payload);
      onFulfilled(state, 'Place successfully added!', 'It will now be available on your list of places.');
    });
    builder.addCase(removePlace.fulfilled, (state, action) => {
      const { placeId } = action.payload;
      state.places = state.places.filter((p) => p.id !== placeId);
      onFulfilled(state, 'Place successfully removed!', 'It will now disappear from your list of places.');
    });
    builder.addCase(loadPlaces.rejected, (state, action) => onError(state, action, 'Error fetching places from DB!'));
    builder.addCase(addPlace.rejected, (state, action) => onError(state, action, 'Error creating the place!'));
    builder.addCase(removePlace.rejected, (state, action) => onError(state, action, 'Error removing the place!'));
  },
});

export default placesSlice.reducer;
