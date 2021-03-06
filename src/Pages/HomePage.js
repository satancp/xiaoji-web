import React, { Component } from 'react';
import FirstScreen from '~/Screens/Home/FirstScreen';
import IntroScreen from '~/Screens/Home/IntroScreen';
import FeatureScreen from '~/Screens/Home/FeatureScreen';
import TeamScreen from '~/Screens/Home/TeamScreen';
import Header from '~/Components/Header';
import Particle from '~/Components/Particle';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canDisplay: false
        };
    }

    componentDidMount() {
        const cache = cookies.get('loginInfo');
        if (!cache) {
            this.setState({ canDisplay: false });
        } else {
            this.setState({ canDisplay: true });
        }
    }

    checkCache() {
        const cache = cookies.get('loginInfo');
        if (!cache) {
            this.setState({ canDisplay: false });
        } else {
            this.setState({ canDisplay: true });
        }
    }

    render() {
        return (
            <div>
                <Header homepage={this} />
                <Particle />
                <FirstScreen />
                <IntroScreen />
                {this.state.canDisplay ? <FeatureScreen /> : null}
                <TeamScreen />
            </div>
        );
    }
}
