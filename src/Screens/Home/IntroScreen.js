import React, { Component } from 'react';
import styles from './IntroScreen.css';
import { Title } from '~/Components/Title';
import { Image } from '~/Components/UIKit';
import ScrollAnim from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';
import classNames from 'classnames';
import axios from 'axios';
import configs from '../../config';

const OverPack = ScrollAnim.OverPack;

const IntroItem = props => {
    const { title, subTitle, img, desc, pos } = props.item;
    const className = classNames(styles.introItem, styles[pos]);
    return (
        <div className={className}>
            <div className={styles.watermark}>{props.index}</div>
            <img src={img} className={styles.image} alt="logo" />
            <div className={styles.textWrapper}>
                <h2>{title}</h2>
                <h3>{subTitle}</h3>
                <div className={styles.divider} />
                <p>{desc}</p>
            </div>
        </div>
    );
};

export default class IntroScreen extends Component {
    INTRO_ITEMS = [
        {
            title: '',
            subTitle: '',
            img: Image.Intro1,
            desc: '',
            index: 1,
            pos: 'left'
        },
        {
            title: '',
            subTitle: '',
            img: Image.Intro2,
            desc: '',
            index: 2,
            pos: 'center'
        },
        {
            title: '',
            subTitle: '',
            img: Image.Intro3,
            desc: '',
            index: 3,
            pos: 'right'
        }
    ];

    constructor(props) {
        super(props);
        this.convertStyle = number => {
            if (number < 10) {
                return '0' + number;
            } else return number;
        };
    }

    componentWillMount() {
        axios.get(`${configs.server_url}home/list_star`).then(response => {
            if (response.data.code === 0) response = response.data;
            for (let i = 0; i < response.data.length; i++) {
                if (i <= 2) {
                    this.INTRO_ITEMS[i].title = response.data[i].name;
                    this.INTRO_ITEMS[i].index = response.data[i].index;
                    this.INTRO_ITEMS[i].subTitle = response.data[i].category;
                    this.INTRO_ITEMS[i].img = response.data[i].preview_image;
                    this.INTRO_ITEMS[i].desc = response.data[i].desc;
                } else break;
            }
        });
    }

    render() {
        return (
            <div id="star" className={styles.container}>
                <OverPack playScale={0} className={styles.wrapper1}>
                    <QueueAnim leaveReverse key="main">
                        <Title key="title" name="Star Projects" />
                        <QueueAnim type="scale" className={styles.introItemWrapper}>
                            {this.INTRO_ITEMS.map((item, k) => (
                                <IntroItem key={k} item={item} index={`${this.convertStyle(item.index)}`} />
                            ))}
                        </QueueAnim>
                    </QueueAnim>
                </OverPack>
            </div>
        );
    }
}
