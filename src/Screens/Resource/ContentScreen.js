import React, { Component } from 'react';
import styles from './ContentScreen.css';
import { Title } from '~/Components/Title';
import ScrollAnim from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';
import axios from 'axios';
import { Spin, Tag, List, Button, Avatar, Icon } from 'antd';
import HtmlToReact from 'html-to-react';
import configs from '../../config';

const HtmlToReactParser = HtmlToReact.Parser;
const OverPack = ScrollAnim.OverPack;

const BrandItem = props => {
    const { name, creator, preview_image } = props.item;
    return (
        <div className={styles.brandItem}>
            <img src={preview_image} alt="preview" />
            <p className={styles.english}>{name}</p>
            <p className={styles.name}>{creator}</p>
        </div>
    );
};

export default class ContentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resource_id: parseInt(props.resource_id, 10),
            category_id: parseInt(props.category_id, 10),
            currentResource: undefined,
            currentComments: [],
            currentRelevants: [],
            loading: true,
            commentLoading: false,
            commentLoadingMore: false,
            showLoadingMoreComments: false
        };
        this.htmlToReactParser = new HtmlToReactParser();
        this.convertStyle = time => {};
        this.linkToResource = item => {
            window.location = '/resource/' + item.id + '/' + this.state.category_id;
        };
        this.onLoadMore = () => {
            this.setState({
                commentLoadingMore: true
            });
            this.setState(
                {
                    commentLoadingMore: false
                },
                () => {
                    // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
                    // In real scene, you can using public method of react-virtualized:
                    // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                    window.dispatchEvent(new Event('resize'));
                }
            );
        };
    }

    componentWillMount() {
        axios.get(`${configs.server_url}resource/get_resource?resource_id=${this.state.resource_id}`).then(response => {
            console.log(response.data);
            if (response.data.code === 0) response = response.data;
            this.props.onGetData(response.data.category);
            let temp = [];
            for (let i = 0; i < response.data.tags.length; i++) {
                temp.push(
                    <Tag
                        style={{
                            marginLeft: '10px',
                            width: 'auto',
                            borderStyle: 'solid',
                            borderWidth: 'thin',
                            borderRadius: '10px',
                            borderColor: 'transparent'
                        }}
                        color={response.data.tags[i].color}
                        key={response.data.tags[i].tag_id}
                    >
                        &nbsp;{response.data.tags[i].tag}&nbsp;
                    </Tag>
                );
            }
            response.data.adjustedTags = temp;
            axios
                .get(
                    `${configs.server_url}resource/get_resources?category_id=
                    ${this.state.category_id}
                    &resource_id=
                    ${this.state.resource_id}`
                )
                .then(response1 => {
                    if (response1.data.code === 0) response1 = response1.data;
                    this.setState({
                        currentResource: response.data,
                        loading: false,
                        currentComments: response.data.comments,
                        currentRelevants: response1.data
                    });
                });
        });
    }

    render() {
        const loadMore = this.state.showLoadingMoreComments ? (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
                {this.state.commentLoadingMore && <Spin />}
                {!this.state.commentLoadingMore && <Button onClick={this.onLoadMore}>Loading more</Button>}
            </div>
        ) : null;
        const IconText = ({ type, text }) => (
            <span>
                <Icon type={type} style={{ marginRight: 8 }} />
                {text}
            </span>
        );
        return (
            <div className={styles.container}>
                {this.state.currentResource !== undefined ? (
                    <Spin spinning={this.state.loading} delay={500} tip="Loading...">
                        <OverPack id="title" playScale={0} className={styles.wrapper2}>
                            <QueueAnim leaveReverse key="featureWrapper">
                                <Title key="title" name={this.state.currentResource.name} style={{ width: 500 }} />
                                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                    {this.state.currentResource.creator} wrote at&nbsp;
                                    {this.state.currentResource.created_at.substring(
                                        0,
                                        this.state.currentResource.created_at.indexOf('T')
                                    )}
                                </div>
                                <div
                                    style={{
                                        textAlign: 'center',
                                        margin: 'auto',
                                        display: 'table',
                                        alignItems: 'center',
                                        fontSize: '14px'
                                    }}
                                >
                                    <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                        <div style={{ display: 'flex' }}>
                                            Tags: {this.state.currentResource.adjustedTags}
                                        </div>
                                    </div>
                                </div>
                            </QueueAnim>
                        </OverPack>
                        <OverPack id="content" playScale={0} className={styles.wrapper2}>
                            <QueueAnim
                                leaveReverse
                                key="featureWrapper"
                                style={{ marginLeft: '10%', marginRight: '10%' }}
                            >
                                {this.htmlToReactParser.parse(this.state.currentResource.content)}
                                <div
                                    style={{
                                        width: 'auto',
                                        height: '1px',
                                        marginTop: '10px',
                                        flexShrink: 0,
                                        backgroundColor: 'lightgray'
                                    }}
                                />
                            </QueueAnim>
                        </OverPack>
                        <OverPack id="relevant" playScale={0} className={styles.wrapper2}>
                            <QueueAnim
                                leaveReverse
                                key="featureWrapper"
                                style={{ marginLeft: '10%', marginRight: '10%' }}
                            >
                                Relevant
                                <QueueAnim leaveReverse type="scale" key="category" className={styles.brandWrapper}>
                                    {this.state.currentRelevants.map((item, index) => (
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
                        <OverPack id="discussion" playScale={0} className={styles.wrapper2}>
                            <QueueAnim
                                leaveReverse
                                key="featureWrapper"
                                style={{ marginLeft: '10%', marginRight: '10%' }}
                            >
                                Discussion
                                <List
                                    loading={this.state.commentLoading}
                                    itemLayout="horizontal"
                                    loadMore={loadMore}
                                    bordered={true}
                                    style={{ marginTop: '10px' }}
                                    dataSource={this.state.currentComments}
                                    renderItem={item => (
                                        <List.Item
                                            actions={[
                                                <IconText type="like-o" text="156" />,
                                                <IconText type="dislike-o" text="156" />
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar src={item.creator_avatar} />}
                                                title={item.creator}
                                                description={item.content}
                                            />
                                            <div>{item.created_at.substring(0, item.created_at.indexOf('T'))}</div>
                                        </List.Item>
                                    )}
                                />
                            </QueueAnim>
                        </OverPack>
                    </Spin>
                ) : (
                    <div>
                        <OverPack id="title" playScale={0} className={styles.wrapper2} />
                        <OverPack id="content" playScale={0} className={styles.wrapper2} />
                        <OverPack id="relevant" playScale={0} className={styles.wrapper2} />
                        <OverPack id="discussion" playScale={0} className={styles.wrapper2} />
                    </div>
                )}
            </div>
        );
    }
}
