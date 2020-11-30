import axios from 'axios';

export const instance = axios.create({
    baseURL: 'https://hacker-news.firebaseio.com/v0/',
});
export const newsAPI = {
    getLast100NewsID ()  {
        return instance.get(`/newstories.json`).then(response => response.data.slice(0,100))
    },
    getCurrentNews (id)  {
        return instance.get(`/item/${id}.json`).then(response => response.data)
    },
    getCommentsOnNews (id)  {
        return instance.get(`/item/${id}.json`).then(response => response.data)
    }
}

