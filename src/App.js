import React from 'react';
import './App.css';
import {NewsCards} from "./components/NewsCards";
import {Button, Layout, Result} from "antd";
import {Content} from "antd/es/layout/layout";
import {NavLink, Route, Switch} from "react-router-dom";
import {NewsPage} from "./components/NewsPage";

function App() {


    return (
        <Layout>
            <Content style={{padding: '0 50px'}}>
                <Switch>
                <Route path='/' exact render={() => <NewsCards/>}/>
                <Route path='/news/:newsId' render={() => <NewsPage/>}/>
                <Route path='*' render={() => <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<NavLink to='/'><Button type="primary">Back Home</Button></NavLink>}
                />}/>
                </Switch>
            </Content>
        </Layout>
    );
}

export default App;
