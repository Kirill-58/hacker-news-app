import React, {useEffect} from "react";
import {Col, Row, Skeleton} from "antd";
import {NewsCard} from "./NewsCard";
import {useDispatch, useSelector} from "react-redux";
import {getNewsListAsync, selectAppInit, selectNewsList} from "../features/redux/newsSlice";
import {Preloader} from "./Preloader";

export const NewsCards = () => {
    const appInitialized = useSelector(selectAppInit)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getNewsListAsync())
    }, [])
    const NewsList = useSelector(selectNewsList)
    let NewsElements = NewsList.map(news => <Col key={news.id} span={6}><NewsCard data={news}/></Col>)
    if (!appInitialized) return <Skeleton title={'Loading'} active avatar paragraph={{ rows: 12 }} />
    return (
        <Row>
            {NewsElements}
        </Row>
    )
}