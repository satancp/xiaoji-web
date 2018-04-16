import React, { Component } from 'react';
import SearchScreen from '~/Screens/Category/SearchScreen';
import VirtualHomeScreen from '~/Screens/Category/VirtualHomeScreen';
import CategoryHeader from '~/Components/CategoryHeader';
import Particle from '~/Components/Particle';
import { Footer } from '../Components/Footer';

export default class CategorySearchPage extends Component {
    constructor(props) {
        super(props);
        this.category_id = props.match.params.category_id;
    }
    render() {
        return (
            <div>
                <CategoryHeader />
                <Particle />
                <VirtualHomeScreen />
                <SearchScreen category_id={this.category_id} />
                <Footer />
            </div>
        );
    }
}
