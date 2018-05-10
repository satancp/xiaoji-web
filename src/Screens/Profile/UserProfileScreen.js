import React, { Component } from 'react';
import styles from './UserProfileScreen.css';
import { Image } from '~/Components/UIKit';
import QueueAnim from 'rc-queue-anim';
import Cookies from 'universal-cookie';
import moment from 'moment';

const cookies = new Cookies();

export default class UserProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginData: cookies.get('loginInfo'),
            welcomeText: '',
            bgName: '',
            currentStyle: {
                textAlign: 'right',
                marginTop: '25%',
                marginRight: '-100%'
            }
        };
    }

    componentDidMount() {
        const cache = cookies.get('loginInfo');
        if (!cache) {
            window.location = '/';
        }
        const current = moment();
        if (current.hour() < 9) {
            const temp = {
                textAlign: 'right',
                marginTop: '20%',
                marginRight: '-50%'
            };
            this.setState({ welcomeText: 'Good morning', bgName: 'ProfileMorningBG', currentStyle: temp });
        } else if (current.hour() < 11 && current.minute() < 30) {
            const temp = {
                textAlign: 'right',
                marginTop: '20%',
                marginRight: '-50%'
            };
            this.setState({ welcomeText: 'Good morning', bgName: 'ProfileMorningBG', currentStyle: temp });
        } else if (current.hour() < 13 && current.minute() < 30) {
            const temp = {
                textAlign: 'right',
                marginTop: '10%',
                marginRight: '-100%'
            };
            this.setState({ welcomeText: 'Good noon', bgName: 'ProfileNoonBG', currentStyle: temp });
        } else if (current.hour() < 18) {
            const temp = {
                textAlign: 'right',
                marginTop: '30%',
                marginRight: '-105%'
            };
            this.setState({ welcomeText: 'Good afternoon', bgName: 'ProfileAfternoonBG', currentStyle: temp });
        } else if (current.hour() < 20 && current.minute() < 30) {
            const temp = {
                textAlign: 'right',
                marginTop: '40%',
                marginRight: '0%'
            };
            this.setState({ welcomeText: 'Good evening', bgName: 'ProfileEveningBG', currentStyle: temp });
        } else {
            const temp = {
                textAlign: 'right',
                marginTop: '25%',
                marginRight: '-100%'
            };
            this.setState({ welcomeText: 'Good night', bgName: 'ProfileNightBG', currentStyle: temp });
        }
    }

    render() {
        return (
            <div id="home" className={styles.container} style={{ backgroundImage: `url(${Image[this.state.bgName]})` }}>
                <QueueAnim className={styles.wrapper} type="scaleBig" delay={200} duration={600}>
                    <h2 className={styles.title} key="title" style={this.state.currentStyle}>
                        {this.state.welcomeText} {this.state.loginData.nickname}
                    </h2>
                </QueueAnim>
            </div>
        );
    }
}
