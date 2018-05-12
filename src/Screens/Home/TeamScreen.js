import React, { Component } from 'react';
import styles from './TeamScreen.css';
import { Title } from '~/Components/Title';
import { Footer } from '~/Components/Footer';
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

export default class TeamScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SERVICE_ITEMS: []
        };
        this.linkToCategory = item => {
            console.log(item);
            window.location = '/category/' + item.id + '/';
        };
    }

    componentWillMount() {
        axios.get(`${configs.server_url}category/list`).then(response => {
            if (response.data.code === 0) response = response.data;
            let temp = [];
            for (let i = 0; i < response.data.length; i++) {
                temp.push({
                    id: response.data[i].id,
                    name: response.data[i].display_name,
                    image: response.data[i].icon
                });
            }
            this.setState({ SERVICE_ITEMS: temp });
        });
    }

    render() {
        return (
            <div id="category" className={styles.container}>
                <Title key="teamTitle" name="Category" />
                <OverPack playScale={0} className={styles.wrapper2}>
                    <QueueAnim leaveReverse key="featureWrapper">
                        <QueueAnim leaveReverse type="scale" key="category" className={styles.brandWrapper}>
                            {this.state.SERVICE_ITEMS.map((item, index) => (
                                <a
                                    onClick={this.linkToCategory.bind(this, item)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'transparent',
                                        color: 'black'
                                    }}
                                    key={index}
                                >
                                    <ServiceItem item={item} key={index} />
                                </a>
                            ))}
                        </QueueAnim>
                    </QueueAnim>
                </OverPack>
                <Footer />
            </div>
        );
    }
}
