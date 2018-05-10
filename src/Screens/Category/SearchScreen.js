import React, { Component } from 'react';
import styles from './SearchScreen.css';
import { Title } from '~/Components/Title';
import ScrollAnim from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';
import axios from 'axios';
import configs from '../../config';

const OverPack = ScrollAnim.OverPack;

const ServiceItem = props => {
    const { image, name } = props.item;
    return (
        <div className={styles.serviceItem} style={{ alignItems: 'center' }}>
            <img src={image} alt="service" />
            <div className={styles.divider} />
            <p>{name}</p>
        </div>
    );
};

const BrandItem = props => {
    const { name, creator, image } = props.item;
    return (
        <div className={styles.brandItem}>
            <img src={image} alt="brand" />
            <p className={styles.english}>{name}</p>
            <p className={styles.name}>{creator}</p>
        </div>
    );
};

export default class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SERVICE_ITEMS: [],
            BRAND_ITEMS: [],
            category_id: parseInt(props.category_id, 10),
            currentCategory: ''
        };
        this.linkToCategory = item => {
            window.location = '/category/' + item.id + '/';
        };
        this.linkToResource = item => {
            window.location = '/resource/' + item.id + '/' + this.state.category_id;
        };
    }

    componentWillMount() {
        axios.get(`${configs.server_url}category/list`).then(response => {
            if (response.data.code === 0) response = response.data;
            let temp = [];
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].id === this.state.category_id) {
                    this.setState({ currentCategory: response.data[i].display_name });
                }
                temp.push({
                    id: response.data[i].id,
                    name: response.data[i].display_name,
                    image: response.data[i].icon
                });
            }
            this.setState({ SERVICE_ITEMS: temp });
        });
        axios.get(`${configs.server_url}resource/get_resources?category_id=${this.state.category_id}`).then(response => {
            if (response.data.code === 0) response = response.data;
            let temp = [];
            for (let i = 0; i < response.data.length; i++) {
                temp.push({
                    id: response.data[i].id,
                    name: response.data[i].name,
                    creator: response.data[i].creator,
                    image: response.data[i].preview_image
                });
            }
            this.setState({ BRAND_ITEMS: temp });
        });
    }

    render() {
        return (
            <div className={styles.container}>
                <OverPack id="categories" playScale={0} className={styles.wrapper2}>
                    <QueueAnim leaveReverse key="featureWrapper">
                        <Title key="title" name="Categories" />
                        <QueueAnim leaveReverse type="scale" key="category" className={styles.serviceWrapper}>
                            {this.state.SERVICE_ITEMS.map((item, index) => (
                                <button
                                    onClick={this.linkToCategory.bind(this, item)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'transparent'
                                    }}
                                    key={index}
                                >
                                    <ServiceItem item={item} key={index} />
                                </button>
                            ))}
                        </QueueAnim>
                    </QueueAnim>
                </OverPack>
                <OverPack id="resources" playScale={0} className={styles.wrapper2}>
                    <QueueAnim leaveReverse key="featureWrapper">
                        <Title key="title" name={`${this.state.currentCategory} Items`} />
                        <QueueAnim leaveReverse type="scale" key="category" className={styles.brandWrapper}>
                            {this.state.BRAND_ITEMS.map((item, index) => (
                                <button
                                    onClick={this.linkToResource.bind(this, item)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'transparent'
                                    }}
                                    key={index}
                                >
                                    <BrandItem item={item} key={index} />
                                </button>
                            ))}
                        </QueueAnim>
                    </QueueAnim>
                </OverPack>
            </div>
        );
    }
}
