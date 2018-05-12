import React, { Component } from 'react';
import styles from './UserProfileScreen.css';
import QueueAnim from 'rc-queue-anim';
import Cookies from 'universal-cookie';
import axios from 'axios';
import configs from '../../config';
import moment from 'moment';
import { Title } from '~/Components/Title';
import { notification, Button, Tooltip, Menu, Dropdown, Icon, Input, Form, Modal } from 'antd';
import Gallery from 'react-grid-gallery';

const cookies = new Cookies();
const confirmModal = Modal.confirm;
const FormItem = Form.Item;
const captionStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    maxHeight: '240px',
    overflow: 'hidden',
    position: 'absolute',
    bottom: '0',
    width: '100%',
    color: 'white',
    padding: '2px',
    fontSize: '90%'
};

const customTagStyle = {
    wordWrap: 'break-word',
    display: 'inline-block',
    backgroundColor: 'white',
    height: 'auto',
    fontSize: '75%',
    fontWeight: '600',
    lineHeight: '1',
    padding: '.2em .6em .3em',
    borderRadius: '.25em',
    color: 'black',
    verticalAlign: 'baseline',
    margin: '2px'
};

class UserBoardScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingAdd: false,
            showAddInput: false,
            sizeStore: [
                {
                    thumbnailWidth: 130,
                    thumbnailHeight: 160
                },
                {
                    thumbnailWidth: 160,
                    thumbnailHeight: 95
                },
                {
                    thumbnailWidth: 160,
                    thumbnailHeight: 74
                },
                {
                    thumbnailWidth: 160,
                    thumbnailHeight: 105
                },
                {
                    thumbnailWidth: 124,
                    thumbnailHeight: 160
                },
                {
                    thumbnailWidth: 160,
                    thumbnailHeight: 56
                },
                {
                    thumbnailWidth: 152,
                    thumbnailHeight: 160
                },
                {
                    thumbnailWidth: 160,
                    thumbnailHeight: 102
                }
            ],
            allBoards: []
        };
        this.existRandoms = {};
        this.setCustomTags = i => {
            return i.tags.map(t => {
                return (
                    <div key={t.value} style={{ ...customTagStyle, color: t.tag.color }}>
                        {t.title}
                    </div>
                );
            });
        };
        this.openNotification = (msg, desc) => {
            notification.open({
                message: msg,
                description: desc,
                placement: 'topLeft'
            });
        };
        this.viewBoard = () => {};
        this.editBoard = () => {};
        this.deleteBoard = () => {
            confirmModal({
                okText: 'Confirm',
                cancelText: 'Cancel',
                title: 'Delete',
                content: 'Do you want to delete this board?',
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        axios
                            .post(`${configs.server_url}board/delete`, {
                                id: this.currentBoardId
                            })
                            .then(response => {
                                if (response.data.code === 0) {
                                    this.openNotification('Success', 'You succeed to delete a board');
                                    resolve();
                                    const cache = cookies.get('loginInfo');
                                    axios
                                        .get(
                                            `${configs.server_url}board/list?user_id=
                        ${cache.id}`
                                        )
                                        .then(response => {
                                            if (response.data.code === 0) response = response.data;
                                            this.setState({
                                                allBoards: response.data
                                            });
                                        });
                                } else {
                                    this.openNotification('Error', response.data.msg);
                                    reject();
                                }
                            })
                            .catch(err => {
                                this.openNotification('Error', 'You fail to delete it');
                                reject();
                            });
                    }).catch(() => this.openNotification('Error', 'You fail to delete it'));
                },
                onCancel: () => {
                    this.currentBoardId = 0;
                }
            });
        };
        this.currentBoardId = 0;
    }

    componentDidMount() {
        const cache = cookies.get('loginInfo');
        if (!cache) {
            window.location = '/';
        }
        axios
            .get(
                `${configs.server_url}board/list?user_id=
                    ${cache.id}`
            )
            .then(response => {
                if (response.data.code === 0) response = response.data;
                this.setState({
                    allBoards: response.data
                });
            });
    }

    convertStyle(text) {
        const year = moment(text, moment.ISO_8601).year();
        const month = moment(text, moment.ISO_8601)
            .month()
            .toString()
            .padStart(2, '0');
        const day = moment(text, moment.ISO_8601)
            .date()
            .toString()
            .padStart(2, '0');
        const hour = moment(text, moment.ISO_8601).hour();
        const minute = moment(text, moment.ISO_8601)
            .minute()
            .toString()
            .padStart(2, '0');
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const menuForNoInfo = (
            <Menu>
                <Menu.Item key="0">
                    <Tooltip placement="top" title="View">
                        <Button
                            type="primary"
                            shape="circle"
                            icon="search"
                            size="default"
                            style={{ marginTop: '0%', marginLeft: '5%' }}
                            onClick={this.viewBoard}
                        />
                    </Tooltip>
                </Menu.Item>
                <Menu.Item key="1">
                    <Tooltip placement="top" title="Edit">
                        <Button
                            type="primary"
                            shape="circle"
                            icon="edit"
                            size="default"
                            style={{
                                marginTop: '0%',
                                marginLeft: '5%',
                                backgroundColor: '#65cc43',
                                borderColor: '#65cc43'
                            }}
                            onClick={this.editBoard}
                        />
                    </Tooltip>
                </Menu.Item>
                <Menu.Item key="2">
                    <Tooltip placement="top" title="Delete">
                        <Button
                            type="danger"
                            shape="circle"
                            icon="delete"
                            size="default"
                            style={{
                                marginTop: '0%',
                                marginLeft: '5%'
                            }}
                            onClick={this.deleteBoard}
                        />
                    </Tooltip>
                </Menu.Item>
            </Menu>
        );
        const menuForHasInfo = (
            <Menu>
                <Menu.Item key="0">
                    <Tooltip placement="top" title="View">
                        <Button
                            type="primary"
                            shape="circle"
                            icon="search"
                            size="default"
                            style={{ marginTop: '0%', marginLeft: '5%' }}
                            onClick={this.viewBoard}
                        />
                    </Tooltip>
                </Menu.Item>
                <Menu.Item key="1">
                    <Tooltip placement="top" title="Edit">
                        <Button
                            type="primary"
                            shape="circle"
                            icon="edit"
                            size="default"
                            style={{
                                marginTop: '0%',
                                marginLeft: '5%',
                                backgroundColor: '#65cc43',
                                borderColor: '#65cc43'
                            }}
                            onClick={this.editBoard}
                        />
                    </Tooltip>
                </Menu.Item>
            </Menu>
        );
        return (
            <div id="user_board" className={styles.container}>
                <QueueAnim className={styles.wrapper} type="scaleBig" delay={200} duration={600}>
                    <Title key="user_resource_title" name="Your Board" />
                    <div
                        style={{
                            display: 'grid',
                            marginTop: '5%',
                            gridTemplateColumns: 'repeat(4, 15rem)',
                            gridGap: '60px',
                            justifyContent: 'center'
                        }}
                    >
                        <Button
                            disabled={this.state.loadingAdd}
                            onMouseEnter={() => {
                                document.getElementById('add-new-board-btn').style.backgroundColor = '#ddd';
                            }}
                            onMouseLeave={() => {
                                this.setState({ showAddInput: false });
                                document.getElementById('add-new-board-btn').style.backgroundColor = 'transparent';
                            }}
                            onClick={() => {
                                this.setState({ showAddInput: true });
                            }}
                            id="add-new-board-btn"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '15rem',
                                height: '20rem',
                                border: '1px solid #ddd',
                                borderRadius: '2%',
                                backgroundColor: 'transparent'
                            }}
                        >
                            {!this.state.showAddInput ? (
                                this.state.loadingAdd ? (
                                    <Icon
                                        type="loading"
                                        style={{
                                            width: '8rem',
                                            height: '8rem',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: 50
                                        }}
                                    />
                                ) : (
                                    <Icon
                                        type="plus"
                                        style={{
                                            borderStyle: 'solid',
                                            borderRadius: '4rem',
                                            width: '8rem',
                                            height: '8rem',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: 50
                                        }}
                                    />
                                )
                            ) : (
                                <FormItem style={{ marginBottom: 0 }}>
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: 'You should input a name' }]
                                    })(
                                        <Input
                                            placeholder="Input Name"
                                            onPressEnter={() => {
                                                this.setState({ loadingAdd: true });
                                                const cache = cookies.get('loginInfo');
                                                this.props.form.validateFields(['name'], (errors, values) => {
                                                    if (errors) return;
                                                    const value = values['name'];
                                                    axios
                                                        .post(`${configs.server_url}board/add`, {
                                                            name: value,
                                                            user_id: cache.id
                                                        })
                                                        .then(response => {
                                                            this.setState({ loadingAdd: false }, () => {
                                                                if (response.data.code === 0) {
                                                                    this.openNotification(
                                                                        'Success',
                                                                        'You succeed to add a new board'
                                                                    );
                                                                    axios
                                                                        .get(
                                                                            `${configs.server_url}board/list?user_id=
                        ${cache.id}`
                                                                        )
                                                                        .then(response => {
                                                                            if (response.data.code === 0)
                                                                                response = response.data;
                                                                            this.setState({
                                                                                allBoards: response.data
                                                                            });
                                                                        });
                                                                } else {
                                                                    this.openNotification('Error', response.data.msg);
                                                                }
                                                            });
                                                        })
                                                        .catch(error => {
                                                            this.setState({ loadingAdd: false }, () => {
                                                                this.openNotification(
                                                                    'Error',
                                                                    'You fail to add a new board'
                                                                );
                                                            });
                                                        });
                                                });
                                            }}
                                        />
                                    )}
                                </FormItem>
                            )}
                        </Button>
                        {this.state.allBoards.map((value1, index1) => {
                            const images = value1.resources.map((value2, index2) => {
                                value2 = value2.resource;
                                value2.src = value2.preview_image;
                                value2.thumbnail = value2.preview_image;
                                value2.tags.map((value3, index) => {
                                    value3.value = value3.tag.name;
                                    value3.title = value3.tag.name;
                                    return value3;
                                });
                                let randomNumber = 0;
                                if (this.existRandoms[index2]) {
                                    randomNumber = this.existRandoms[index2];
                                } else {
                                    randomNumber = Math.floor(Math.random() * 7);
                                    this.existRandoms[index2] = randomNumber;
                                }
                                value2.thumbnailWidth = this.state.sizeStore[randomNumber].thumbnailWidth;
                                value2.thumbnailHeight = this.state.sizeStore[randomNumber].thumbnailHeight;
                                value2.caption = value2.name;
                                value2.customOverlay = (
                                    <div style={captionStyle}>
                                        <div>{value2.caption}</div>
                                        {value2.hasOwnProperty('tags') && this.setCustomTags(value2)}
                                    </div>
                                );
                                return value2;
                            });
                            return (
                                <div key={value1.id}>
                                    {images.length !== 0 ? (
                                        <div
                                            style={{
                                                display: 'block',
                                                minHeight: '1px',
                                                width: '15rem',
                                                height: '20rem',
                                                border: '1px solid #ddd',
                                                overflow: 'auto',
                                                borderRadius: '2%'
                                            }}
                                        >
                                            <Gallery
                                                images={images}
                                                enableImageSelection={false}
                                                backdropClosesModal={true}
                                                showLightboxThumbnails={true}
                                                onClickImage={e => {
                                                    console.log(e.target);
                                                }}
                                                onClickThumbnail={index => {
                                                    window.location.href = `/resource/${images[index].id}/${
                                                        images[index].category_id
                                                    }/`;
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '15rem',
                                                height: '20rem',
                                                border: '1px solid #ddd',
                                                borderRadius: '2%'
                                            }}
                                        >
                                            <img
                                                alt="empty_board"
                                                style={{ width: '23rem', marginLeft: '9.5%' }}
                                                src={
                                                    'https://xiaoji-web.oss-cn-hangzhou.aliyuncs.com/web/empty_board_en.png'
                                                }
                                            />
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: '0.5px',
                                            borderColor: '#dedede',
                                            borderBottomStyle: 'solid',
                                            borderLeftStyle: 'solid',
                                            borderBottomLeftRadius: '40%',
                                            borderRightStyle: 'solid',
                                            borderBottomRightRadius: '40%',
                                            marginTop: '-1%'
                                        }}
                                    >
                                        <h2 style={{ marginTop: '2.5%' }}>{value1.name}</h2>
                                        {images.length !== 0 ? (
                                            <Tooltip placement="top" title="Actions">
                                                <Dropdown overlay={menuForHasInfo} trigger={['click']}>
                                                    <Button
                                                        type="primary"
                                                        shape="circle"
                                                        icon="bars"
                                                        size="default"
                                                        style={{ marginTop: '0%', marginLeft: '5%' }}
                                                    />
                                                </Dropdown>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip placement="top" title="Actions">
                                                <Dropdown overlay={menuForNoInfo} trigger={['click']}>
                                                    <Button
                                                        type="primary"
                                                        shape="circle"
                                                        icon="bars"
                                                        size="default"
                                                        onClick={() => {
                                                            this.currentBoardId = value1.id;
                                                        }}
                                                        style={{ marginTop: '0%', marginLeft: '5%' }}
                                                    />
                                                </Dropdown>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </QueueAnim>
            </div>
        );
    }
}

let UserBoardScreenReal;

export default (UserBoardScreenReal = Form.create()(UserBoardScreen));
