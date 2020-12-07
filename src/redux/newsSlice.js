import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {newsAPI} from "../api/api";

// получаем 100 последних новостей
export const getNewsListAsync = createAsyncThunk(
    'news/getNews',
    async () => {
        let arrNews = [];
        let response = await newsAPI.getLast100NewsID();
        for (const id of response) {
            let result = await newsAPI.getElementById(id);
            arrNews.push(result);
        }
        return arrNews;

    }
)

// получаем конкретную новость по id
export const getCurrentNewsAsync = createAsyncThunk(
    'news/getCurrentNews',
    async (id) => {
        let result = await newsAPI.getElementById(id);
        return result;

    }
)

// получаем комментарии 1 уровня
export const getCommentsListAsync = createAsyncThunk(
    'news/getComments',
    async (kids) => {
        let arrComments = [];
        for (const id of kids) {
            let result = await newsAPI.getElementById(id);
            arrComments.push(result);
        }
        return arrComments;
    }
)

// получаем ответы на комментарии
export const getCommentKidsAsync = createAsyncThunk(
    'news/getCommentKids',
    async (kids) => {
        let arrComments = [];
        for (const id of kids) {
            let result = await newsAPI.getElementById(id);
            arrComments.push(result);
        }
        return arrComments;
    }
)

// обновляем список и количество комментариев
export const refreshCommentsList = createAsyncThunk(
    'news/refreshCommentsList',
    async (id) => {
        let data = {result:null, arrComments:[]}
        data.result = await newsAPI.getElementById(id);
        if (data.result.kids) {
            for (const id of data.result.kids) {
                let comment = await newsAPI.getElementById(id);
                data.arrComments.push(comment);
            }
            return data;
        }

    }
)

export const newsSlice = createSlice({
    name: 'newsReducer',
    initialState: {
        arrayIdNews: [],
        newsList: [],
        commentsList: [],
        appInit: false,
        isFetching: false,
        newsListIsFetching: false,
        isFetchingCommentsList: false

    },
    reducers: {
        clearCommentsList: (state, action) => {
            state.commentsList = []
        },
    },
    extraReducers: {
        [getNewsListAsync.pending]: (state, action) => {
            state.newsListIsFetching = true
        },
        [getNewsListAsync.fulfilled]: (state, action) => {
            state.newsList = action.payload;
            state.appInit = true;
            state.newsListIsFetching = false
        },
        [getCommentsListAsync.pending]: (state, action) => {
            state.isFetching = true
        },
        [getCommentsListAsync.fulfilled]: (state, action) => {
            state.isFetching = false
            state.commentsList = action.payload
        },
        [getCommentKidsAsync.fulfilled]: (state, action) => {
            state.commentsList = state.commentsList.map((comment) => {
                if (comment.id === action.payload[0].parent) {
                    comment.kids = action.payload;
                }

                if (comment.kids) {
                    comment.kids.map((kid) => {
                        if (kid.id === action.payload[0].parent) {
                            kid.kids = action.payload;
                        }
                        if (kid.kids) {
                            kid.kids.map((kid) => {
                                if (kid.id === action.payload[0].parent) {
                                    kid.kids = action.payload;
                                }
                            })
                            return kid
                        }
                        return kid
                    })

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
            debugger
            state.isFetchingCommentsList = false;
            // если комментариев нет, выходим из функции
            if (!action.payload) return
            // присваиваем актуальное значение количества комментариев
            state.newsList.map((elem)=> {
                if (elem.id === action.payload.result.id) {
                    elem.descendants = action.payload.result.descendants
                }
            })
                // обновляем список
            state.commentsList = action.payload.arrComments
        },

    }

});
export const {clearCommentsList} = newsSlice.actions;

// селекторы
export const selectNewsList = state => state.newsReducer.newsList;
export const selectAppInit = state => state.newsReducer.appInit;
export const selectCommentsList = state => state.newsReducer.commentsList;
export const selectIsFetching = state => state.newsReducer.isFetching;
export const selectNewsListIsFetching = state => state.newsReducer.newsListIsFetching;
export const selectCommentsListIsFetching = state => state.newsReducer.isFetchingCommentsList;

export default newsSlice.reducer