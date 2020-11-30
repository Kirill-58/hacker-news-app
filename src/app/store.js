import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import newsReducer from '../features/redux/newsSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    newsReducer
  },
});
