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
        const currentHour = current
            .hour()
            .toString()
            .padStart(2, '0');
        const currentMinute = current
            .minute()
            .toString()
            .padStart(2, '0');
        const currentTime = moment(`${currentHour}:${currentMinute}`, 'hh:mm');
        if (currentTime.isBefore(moment('09:00', 'hh:mm'))) {
            const temp = {
                textAlign: 'right',
                marginTop: '20%',
                marginRight: '-50%'
            };
            this.setState({ welcomeText: 'Good morning', bgName: 'ProfileMorningBG', currentStyle: temp });
        } else if (currentTime.isBefore(moment('11:30', 'hh:mm'))) {
            const temp = {
                textAlign: 'right',
                marginTop: '20%',
                marginRight: '-50%'
            };
            this.setState({ welcomeText: 'Good morning', bgName: 'ProfileMorningBG', currentStyle: temp });
        } else if (currentTime.isBefore(moment('13:30', 'hh:mm'))) {
            const temp = {
                textAlign: 'right',
                marginTop: '10%',
                marginRight: '-100%'
            };
            this.setState({ welcomeText: 'Good noon', bgName: 'ProfileNoonBG', currentStyle: temp });
        } else if (currentTime.isBefore(moment('18:00', 'hh:mm'))) {
            const temp = {
                textAlign: 'right',
                marginTop: '30%',
                marginRight: '-105%'
            };
            this.setState({ welcomeText: 'Good afternoon', bgName: 'ProfileAfternoonBG', currentStyle: temp });
        } else if (currentTime.isBefore(moment('20:30', 'hh:mm'))) {
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
