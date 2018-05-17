import React, {Component} from 'react'
import {Router, Switch, Route} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import './App.css'
import HomePage from './Pages/HomePage'
import CategorySearchPage from './Pages/CategorySearchPage'
import ResourceContentPage from './Pages/ResourceContentPage'
import ResourceAddPage from './Pages/ResourceAddPage'
import ProfilePage from './Pages/ProfilePage'
import BoardPage from './Pages/BoardPage'

export const history = createBrowserHistory()

export default class App extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/category/:category_id/" component={CategorySearchPage} />
                    <Route path="/resource/:resource_id/:category_id/" component={ResourceContentPage} />
                    <Route path="/resource/add/" component={ResourceAddPage} />
                    <Route path="/user/:user_id/board/:board_id" component={BoardPage} />
                    <Route path="/user/:user_id/" component={ProfilePage} />
                </Switch>
            </Router>
        )
    }
}
