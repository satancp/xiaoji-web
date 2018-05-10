import React, { Component } from 'react';
import UserProfileScreen from '~/Screens/Profile/UserProfileScreen';
import UserResourceScreen from '~/Screens/Profile/UserResourceScreen';
import SimpleHeader from '~/Components/SimpleHeader';
import Particle from '~/Components/Particle';
import Cookies from 'universal-cookie';
import { Footer } from '../Components/Footer';

const cookies = new Cookies();

export default class ProfilePage extends Component {
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
                <SimpleHeader />
                <Particle />
                <UserProfileScreen />
                <UserResourceScreen />
                <Footer />
            </div>
        );
    }
}
