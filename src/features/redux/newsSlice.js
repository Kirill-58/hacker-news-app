import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {newsAPI} from "../../api/api";
export const getNewsListAsync = createAsyncThunk(
    'news/getNews',
    async () => {
        let arrNews = [];
        let response = await newsAPI.getLast100NewsID();
        for (const id of response) {
            let result = await newsAPI.getCurrentNews(id);
            arrNews.push(result);
        }
        return arrNews;

    }
)

export const getCurrentNewsAsync = createAsyncThunk(
    'news/getCurrentNews',
    async (id) => {
        let result = await newsAPI.getCurrentNews(id);
        return result;

    }
)

export const getCommentsListAsync = createAsyncThunk(
    'news/getComments',
    async (kids) => {
        let arrComments = [];
        for (const id of kids) {
            let result = await newsAPI.getCommentsOnNews(id);
            arrComments.push(result);
        }
        console.log(arrComments);
        return arrComments;
    }
)


export const newsSlice = createSlice({
    name: 'newsReducer',
    initialState: {
        arrayIdNews: [],
        newsList: [],
        commentsList: [],
        appInit: false,
        isFetching: false
    },
    reducers: {
        getNewsList: (state, action) => {
            state.arrayIdNews = action.payload

        },
        addNewForList: (state, action) => {
            state.newsList.push(action.payload)
        },
        clearCommentsList: (state, action) => {
            state.commentsList = []
        },


    },
    extraReducers: {
        [getNewsListAsync.fulfilled]: (state, action) => {
            state.newsList = action.payload
            state.appInit = true
        },
        [getCommentsListAsync.pending]: (state, action) => {
            state.isFetching = true
        },
        [getCommentsListAsync.fulfilled]: (state, action) => {
            state.isFetching = false
            state.commentsList = action.payload
        },
        [getCurrentNewsAsync.pending]: (state, action) => {
            state.isFetching = true
        },
        [getCurrentNewsAsync.fulfilled]: (state, action) => {
            state.isFetching = false
            state.newsList.push(action.payload)
        }
    }

});
export const {getNewsList, addNewForList, clearCommentsList} = newsSlice.actions;


export const selectNewsList = state => state.newsReducer.newsList;
export const selectAppInit = state => state.newsReducer.appInit;
export const selectCommentsList = state => state.newsReducer.commentsList;
export const selectIsFetching = state => state.newsReducer.isFetching;
export default newsSlice.reducer