import React, { Component } from 'react';
import styles from './FeatureScreen.css';
import { Title } from '~/Components/Title';
import { Image } from '~/Components/UIKit';
import ScrollAnim from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';
import axios from 'axios';
import configs from '../../config';

const OverPack = ScrollAnim.OverPack;

const CategoryItem = props => {
    const { name, logo } = props.item;
    return (
        <div className={styles.categoryItem}>
            <img src={logo} alt="category" />
            <div className={styles.bottom} />
            <p>{name}</p>
        </div>
    );
};

const BrandItem = props => {
    const { name, category, image } = props.item;
    return (
        <div className={styles.brandItem}>
            <img src={image} alt="brand" />
            <p className={styles.english}>{name}</p>
            <p className={styles.name}>{category}</p>
        </div>
    );
};

export default class FeatureScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CATEGORY_ITEMS: [],
            BRAND_ITEMS: []
        };
    }

    componentWillMount() {
        axios.get(`${configs.server_url}category/list`).then(response => {
            let temp = [];
            for (let i = 0; i < response.data.length; i++) {
                if (i > 3) break;
                temp.push({ name: response.data[i].display_name, logo: response.data[i].icon });
            }
            this.setState({ CATEGORY_ITEMS: temp });
        });
        axios.get(`${configs.server_url}resource/list`).then(response => {
            let temp = [];
            for (let i = 0; i < response.data.length; i++) {
                if (i > 7) break;
                temp.push({
                    name: response.data[i].name,
                    category: response.data[i].category,
                    image: response.data[i].preview_image
                });
            }
            this.setState({ BRAND_ITEMS: temp });
        });
    }

    render() {
        return (
            <div id="favourite" className={styles.container}>
                <OverPack playScale={0} className={styles.wrapper1}>
                    <QueueAnim leaveReverse key="featureMain">
                        <Title key="title" name="Your Favourites" />
                        <p key="desc" className={styles.desc}>
                            I guess maybe you like...
                        </p>
                        <h2 key="subTitle" className={styles.subTitle}>
                            These categories
                        </h2>
                        <QueueAnim key="category" className={styles.categoryWrapper}>
                            {this.state.CATEGORY_ITEMS.map((item, k) => (
                                <CategoryItem item={item} key={`feature-${k}`} />
                            ))}
                        </QueueAnim>
                        <h2 key="brandTitle" className={styles.brandTitle}>
                            These items
                        </h2>
                    </QueueAnim>
                </OverPack>
                <OverPack playScale={0} className={styles.wrapper2}>
                    <QueueAnim leaveReverse key="featureWrapper">
                        <QueueAnim leaveReverse type="scale" key="category" className={styles.brandWrapper}>
                            {this.state.BRAND_ITEMS.map((item, index) => <BrandItem item={item} key={index} />)}
                        </QueueAnim>
                        <div key="more" className={styles.moreWrapper}>
                            <img src={Image.More} alt="More" />
                            <p className={styles.watermark}>More</p>
                            <p className={styles.banner}>Find more things you like</p>
                        </div>
                    </QueueAnim>
                </OverPack>
            </div>
        );
    }
}
