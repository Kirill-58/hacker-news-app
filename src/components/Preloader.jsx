import React from "react";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const Preloader = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
        <Spin indicator={antIcon} />
    )
}


