import React, {useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {RetweetOutlined} from "@ant-design/icons";
import {Avatar, Button, Card, Rate} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
    clearCommentsList,
    getCommentsListAsync,
    getCurrentNewsAsync,
    refreshCommentsList,
    selectCommentsList, selectCommentsListIsFetching,
    selectIsFetching,
    selectNewsList
} from "../redux/newsSlice";
import {Preloader} from "./Preloader";
import {Comments} from "./Comments";


const {Meta} = Card;

export const NewsPage = (props) => {
    const dispatch = useDispatch();
    let history = useHistory()
    const isFetching = useSelector(selectIsFetching)
    const isFetchingComments = useSelector(selectCommentsListIsFetching)
    //функция выбирает из массива текущую новость по ID
    const getCurrentNews = (id, news) => news.find(news => news.id === id)
    // получаем ID из адресной строки
    let {newsId} = useParams();
    // приводим к числу для корректного сравнения
    let newIdNum = Number(newsId)
    // читаем список новостей из хранилища
    const newsList = useSelector(selectNewsList);
    const [currentNews, setCurrentNews] = React.useState(null);
    useEffect(() => {
        if (newsList.length) {
            setCurrentNews(getCurrentNews(newIdNum, newsList));
        } else {
            setCurrentNews(dispatch(getCurrentNewsAsync(newIdNum)));
        }
    }, [newsList.length]);

    useEffect(() => {
        currentNews?.kids && dispatch(getCommentsListAsync(currentNews.kids))
    }, [currentNews?.kids])
    useEffect(() => {
        const refresh = setInterval(
            () => dispatch(refreshCommentsList(newIdNum)),
            60000
        );
        return () => {
            dispatch(clearCommentsList())
            clearInterval(refresh)
        };
    }, [])
    const Data = new Date(currentNews?.time * 1000).toLocaleDateString();
    let comments = useSelector(selectCommentsList)
    return isFetching ? <Preloader/> : (
        <>
            <Button onClick={() => dispatch(refreshCommentsList(newIdNum))} icon={<RetweetOutlined/>}
                    loading={isFetching} type="primary">
                Обновить список
            </Button>
            <Button type="primary" onClick={() => history.goBack()}>
                Вернуться к списку
            </Button>
            {currentNews && <Card
                title={currentNews.title}
                className={"news_body"}
                actions={[<a href={currentNews.url} target="_blank" rel="noreferrer">{currentNews.url}</a>]}
            >
                <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                    title={currentNews.by}
                    description={'Количество комментариев: ' + currentNews.descendants}
                />

                <div className="time">
                    <Rate value={currentNews.score}/>
                    <p>
                        {Data}
                    </p>


                </div>
            </Card>}
            <div className="comment_body">
                {comments.length ? isFetchingComments ? <Preloader/> : <Comments comments={comments}/> :
                    <p>Комментариев нет</p>}
            </div>


        </>
    )
}