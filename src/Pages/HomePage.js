import React, { Component } from 'react';
import FirstScreen from '~/Screens/Home/FirstScreen';
import IntroScreen from '~/Screens/Home/IntroScreen';
import FeatureScreen from '~/Screens/Home/FeatureScreen';
import TeamScreen from '~/Screens/Home/TeamScreen';
import Header from '~/Components/Header';
import Particle from '~/Components/Particle';

export default class HomePage extends Component {
    render() {
        return (
            <div>
                <Header />
                <Particle />
                <FirstScreen />
                <IntroScreen />
                <FeatureScreen />
                <TeamScreen />
            </div>
        );
    }
}
