import React, { Component } from 'react';
import styles from './FirstScreen.css';
import { Image } from '~/Components/UIKit';
import QueueAnim from 'rc-queue-anim';

export default class FirstScreen extends Component {
    render() {
        return (
            <div id="home" className={styles.container} style={{ backgroundImage: `url(${Image.BannerBG})` }}>
                <QueueAnim className={styles.wrapper} type="scaleBig" delay={200} duration={600}>
                    <h2 className={styles.title} key="title" style={{ textAlign: 'center', marginTop: 0 }}>
                        The world's most advanced landscape sharing platform
                    </h2>
                </QueueAnim>
            </div>
        );
    }
}
