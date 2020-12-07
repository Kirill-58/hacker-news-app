import React, {useEffect} from "react";
import {Col, Row, Skeleton, message, Button} from "antd";
import {RetweetOutlined} from '@ant-design/icons';
import {NewsCard} from "./NewsCard";
import {useDispatch, useSelector} from "react-redux";
import {getNewsListAsync, selectAppInit, selectNewsList, selectNewsListIsFetching} from "../redux/newsSlice";

export const NewsCards = () => {
    const appInitialized = useSelector(selectAppInit)
    const isFetching = useSelector(selectNewsListIsFetching)
    const dispatch = useDispatch();
    const NewsList = useSelector(selectNewsList)
    useEffect(() => {
        if (!NewsList.length || NewsList.length === 1) {
            dispatch(getNewsListAsync())
        }
        let refreshNews = setInterval(() => {
            dispatch(getNewsListAsync())
            message.info('Обновление последних новостей');
        }, 60000);
        return () => {
            clearInterval(refreshNews)
        }
    }, [])

    let NewsElements = NewsList.map(news => <Col xs={24} sm={12} md={12} lg={6} key={news.id} span={6}><NewsCard
        data={news}/></Col>)

    if (!appInitialized && NewsElements) return <Skeleton title={'Loading'} active avatar paragraph={{rows: 12}}/>
    return (
        <>
            <Button onClick={() => dispatch(getNewsListAsync())} icon={<RetweetOutlined/>} loading={isFetching}
                    type="primary">
                Обновить список
            </Button>
            <Row>
                {NewsElements}
            </Row>
        </>
    )
}