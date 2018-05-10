import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Loadable from 'react-loadable';
import { Load } from './Components/Load';
import './App.css';
import HomePage from './Pages/HomePage';
import CategorySearchPage from './Pages/CategorySearchPage';
import ResourceContentPage from './Pages/ResourceContentPage';
import ResourceAddPage from './Pages/ResourceAddPage';
import ProfilePage from './Pages/ProfilePage';

export const history = createBrowserHistory();

const AsyncService = Loadable({
    loader: () => import('./Pages/ServicePage'),
    loading: Load
});
const AsyncPinjian = Loadable({
    loader: () => import('./Pages/PinjianPage'),
    loading: Load
});

export default class App extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/category/:category_id/" component={CategorySearchPage} />
                    <Route path="/resource/:resource_id/:category_id/" component={ResourceContentPage} />
                    <Route path="/resource/add/" component={ResourceAddPage} />
                    <Route path="/user/:user_id/" component={ProfilePage} />
                    <Route path="/service" exact component={AsyncService} />
                    <Route path="/pinjian" exact component={AsyncPinjian} />
                </Switch>
            </Router>
        );
    }
}
