import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {newsAPI} from '../api/api';

// получаем 100 последних новостей
export const getNewsListAsync = createAsyncThunk(
    'news/getNews',
    async () => {
      const response = await newsAPI.getLast100NewsID();
      const requests = response.map((id) => newsAPI.getElementById(id));
      const arrNews = await newsAPI.getElementsByPromises(requests);
      return arrNews;
    },
);

// получаем конкретную новость по id
export const getCurrentNewsAsync = createAsyncThunk(
    'news/getCurrentNews',
    async (id) => {
      const result = await newsAPI.getElementById(id);
      return result;
    },
);

// получаем комментарии 1 уровня
export const getCommentsListAsync = createAsyncThunk(
    'news/getComments',
    async (kids) => {
      const requests = kids.map((id) => newsAPI.getElementById(id));
      const arrComments = await newsAPI.getElementsByPromises(requests);
      return arrComments;
    },
);

// получаем ответы на комментарии
export const getCommentKidsAsync = createAsyncThunk(
    'news/getCommentKids',
    async (kids) => {
      const requests = kids.map((id) => newsAPI.getElementById(id));
      const arrComments = await newsAPI.getElementsByPromises(requests);
      return arrComments;
    },
);

// обновляем список и количество комментариев
export const refreshCommentsList = createAsyncThunk(
    'news/refreshCommentsList',
    async (id) => {
      const data = {result: null, arrComments: []};
      data.result = await newsAPI.getElementById(id);
      if (data.result.kids) {
        for (const id of data.result.kids) {
          const comment = await newsAPI.getElementById(id);
          data.arrComments.push(comment);
        }
        return data;
      }
    },
);

export const newsSlice = createSlice({
  name: 'newsReducer',
  initialState: {
    arrayIdNews: [],
    newsList: [],
    commentsList: [],
    appInit: false,
    isFetching: false,
    newsListIsFetching: false,
    isFetchingCommentsList: false,

  },
  reducers: {
    clearCommentsList: (state, action) => {
      state.commentsList = [];
    },
  },
  extraReducers: {
    [getNewsListAsync.pending]: (state, action) => {
      state.newsListIsFetching = true;
    },
    [getNewsListAsync.fulfilled]: (state, action) => {
      state.newsList = action.payload;
      state.appInit = true;
      state.newsListIsFetching = false;
    },
    [getCommentsListAsync.pending]: (state) => {
      state.isFetching = true;
    },
    [getCommentsListAsync.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.commentsList = action.payload;
    },
    [getCommentKidsAsync.fulfilled]: (state, action) => {
      state.commentsList = state.commentsList.map((comment) => {
        if (comment.id === action.payload[0].parent) {
          comment.kids = action.payload;
        }
        // рекурсивная функция для поиска всех ответов
        if (comment.kids) {
          readChildrenComments(comment.kids, action);
        }
        return comment;
      });
    },
    [getCurrentNewsAsync.pending]: (state, action) => {
      state.isFetching = true;
    },
    [getCurrentNewsAsync.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.newsList.push(action.payload);
    },
    [refreshCommentsList.pending]: (state, action) => {
      state.isFetchingCommentsList = true;
    },
    [refreshCommentsList.fulfilled]: (state, action) => {
      state.isFetchingCommentsList = false;
      // если комментариев нет, выходим из функции
      if (!action.payload) return;
      // присваиваем актуальное значение количества комментариев
      state.newsList.map((elem) => {
        if (elem.id === action.payload.result.id) {
          elem.descendants = action.payload.result.descendants;
        }
        return elem.descendants;
      });
      // обновляем список
      state.commentsList = action.payload.arrComments;
    },

  },

});
export const {clearCommentsList} = newsSlice.actions;

const readChildrenComments = (commentKids, action) => {
  commentKids.map((kid) => {
    if (kid.id === action.payload[0].parent) {
      kid.kids = action.payload;
    }
    if (kid.kids) {
      readChildrenComments(kid.kids, action);
    }
    return kid.kids;
  });
};

// селекторы
export const selectNewsList = (state) => state.newsReducer.newsList;
export const selectAppInit = (state) => state.newsReducer.appInit;
export const selectCommentsList = (state) => state.newsReducer.commentsList;
export const selectIsFetching = (state) => state.newsReducer.isFetching;
export const selectNewsListIsFetching = (state) =>
  state.newsReducer.newsListIsFetching;
export const selectCommentsListIsFetching = (state) =>
  state.newsReducer.isFetchingCommentsList;

export default newsSlice.reducer;
