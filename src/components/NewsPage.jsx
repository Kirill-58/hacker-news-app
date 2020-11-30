import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import {Avatar, Card, Rate} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
    clearCommentsList,
    getCommentsListAsync,
    getCurrentNewsAsync,
    selectCommentsList,
    selectIsFetching,
    selectNewsList
} from "../features/redux/newsSlice";
import {CommentElem} from "./Comment";
import {Preloader} from "./Preloader";


const {Meta} = Card;

export const NewsPage = (props) => {
    const dispatch = useDispatch();
    const isFetching = useSelector(selectIsFetching)
    //функция выбирает из массива текущую новость по ID
    const getCurrentNews = (id, news) => news.find(news => news.id === id)
    // получаем ID из адресной строки
    let {newsId} = useParams();
    // приводим к числу для корректного сравнения
    let newIdNum = Number(newsId)
    // читаем список новостей из хранилища
    const newsList = useSelector(selectNewsList);
    // // выбираем из списка новость с текущим ID
    let currentNews = null;
    if (newsList.length) {
        currentNews = getCurrentNews(newIdNum, newsList)
    }
    else {
        currentNews = dispatch(getCurrentNewsAsync(newIdNum))
    }

    const Data = new Date(currentNews.time * 1000).toLocaleDateString();


    useEffect(() => {
        dispatch(clearCommentsList())
        currentNews.kids && dispatch(getCommentsListAsync(currentNews.kids))
    },[])

    let comments = useSelector(selectCommentsList)

    return isFetching ? <Preloader/>: (
        <>
            {console.log(currentNews)}
            <Card
                title={currentNews.title}
                style={{width: 300}}
                cover={
                    <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }
                actions={[
                    <SettingOutlined key="setting"/>,
                    <EditOutlined key="edit"/>,
                    <EllipsisOutlined key="ellipsis"/>,
                ]}
            >
                <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                    title={currentNews.by}
                    description={currentNews.descendants}
                />

                <div className="rate">
                    <Rate value={currentNews.score}/>
                </div>
                <div className="time">{Data}</div>
            </Card>

            {comments.length ? isFetching ? <Preloader/> : <CommentElem comments={comments}/> : <p>Комментариев нет</p>}


        </>
    )
}