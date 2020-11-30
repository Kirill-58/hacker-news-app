import React from "react";
import  {Card, Avatar, DatePicker} from 'antd';
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import { Rate } from 'antd';
import {NavLink} from "react-router-dom";
const {Meta} = Card;

export const NewsCard = (props) => {
    const Data = new Date(props.data.time*1000).toLocaleDateString();
    return (
        <NavLink to={'/news/' + props.data.id} >
        <Card
            title={props.data.title}
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
                title={props.data.by}
                description={props.descendants}
            />

            <div className="rate">
                <Rate value={props.data.score} />
            </div>
            <div className="time">{Data}</div>
        </Card>
        </NavLink>
    )
}