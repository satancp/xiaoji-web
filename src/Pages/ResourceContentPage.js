import React, { Component } from 'react';
import ContentScreen from '~/Screens/Resource/ContentScreen';
import VirtualHomeScreen from '~/Screens/Resource/VirtualHomeScreen';
import ResourceHeader from '~/Components/ResourceHeader';
import Particle from '~/Components/Particle';
import { Footer } from '../Components/Footer';

export default class ResourceContentPage extends Component {
    constructor(props) {
        super(props);
        this.category_id = props.match.params.category_id;
        this.resource_id = props.match.params.resource_id;
        this.getData = data => {
            this.resourceHeader.setCategoryName(data);
        };
    }

    render() {
        return (
            <div>
                <ResourceHeader onRef={ref => (this.resourceHeader = ref)} category_id={this.category_id} />
                <Particle />
                <VirtualHomeScreen />
                <ContentScreen onGetData={this.getData} resource_id={this.resource_id} category_id={this.category_id} />
                <Footer />
            </div>
        );
    }
}
