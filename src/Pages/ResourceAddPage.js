import React, { Component } from 'react';
import PublishScreen from '~/Screens/Resource/PublishScreen';
import SimpleHeader from '~/Components/SimpleHeader';
import Particle from '~/Components/Particle';
import { Footer } from '../Components/Footer';

export default class ResourceContentPage extends Component {
    render() {
        return (
            <div>
                <SimpleHeader />
                <Particle />
                <PublishScreen />
                <Footer />
            </div>
        );
    }
}
