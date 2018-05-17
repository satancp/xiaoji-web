import React, {Component} from 'react'
import styles from './ContentScreen.css'
import {Title} from '~/Components/Title'
import ScrollAnim from 'rc-scroll-anim'
import QueueAnim from 'rc-queue-anim'
import axios from 'axios'
import configs from '../../config'
import {notification, Modal, Tooltip, Button, Divider} from 'antd'

const OverPack = ScrollAnim.OverPack

const BrandItem = props => {
    const {name, creator, image} = props.item
    return (
        <div className={styles.brandItem}>
            <img src={image} alt="resource" />
            <p className={styles.english}>{name}</p>
            <p className={styles.name}>{creator}</p>
        </div>
    )
}

export default class ContentScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            BRAND_ITEMS: [],
            board_id: parseInt(props.board_id, 10),
            currentBoard: '',
            width: 150,
            top: '45%',
            visibleModal: false
        }
        this.openNotification = (msg, desc) => {
            notification.open({
                message: msg,
                description: desc,
                placement: 'topLeft'
            })
        }
    }

    componentWillMount() {
        axios.get(`${configs.server_url}board/list_resource?board_id=${this.state.board_id}`).then(response => {
            if (response.data.code === 0) response = response.data
            let temp = []
            for (let i = 0; i < response.data.resources.length; i++) {
                response.data.resources[i] = response.data.resources[i].resource
                temp.push({
                    id: response.data.resources[i].id,
                    name: response.data.resources[i].name,
                    creator: response.data.resources[i].creator,
                    image: response.data.resources[i].preview_image,
                    category_id: response.data.resources[i].category_id
                })
            }
            this.setState({BRAND_ITEMS: temp, currentBoard: response.data.name})
        })
    }

    render() {
        return (
            <div className={styles.container}>
                <OverPack id="resources" playScale={0} className={styles.wrapper2}>
                    <QueueAnim leaveReverse key="featureWrapper">
                        <Title key="title" name={`${this.state.currentBoard} Items`} />
                        <QueueAnim leaveReverse type="scale" key="category" className={styles.brandWrapper}>
                            {this.state.BRAND_ITEMS.map((item, index) => {
                                const resource_id = item.id
                                const category_id = item.category_id
                                return (
                                    <a
                                        onClick={() => {
                                            this.setState({
                                                visibleModal: true,
                                                currentData: {
                                                    resource_id,
                                                    category_id
                                                }
                                            })
                                        }}
                                        style={{
                                            backgroundColor: 'transparent',
                                            borderColor: 'transparent',
                                            color: 'black'
                                        }}
                                        key={index}>
                                        <BrandItem item={item} key={index} />
                                    </a>
                                )
                            })}
                        </QueueAnim>
                    </QueueAnim>
                </OverPack>
                <Modal
                    maskClosable={true}
                    closable={false}
                    width={this.state.width}
                    style={{top: this.state.top}}
                    visible={this.state.visibleModal}
                    onCancel={() => {
                        this.setState({visibleModal: false})
                    }}
                    footer={null}>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Tooltip title="View">
                            <Button
                                type="primary"
                                shape="circle"
                                icon="search"
                                onClick={() => {
                                    window.location.href = `/resource/${this.state.currentData.resource_id}/${
                                        this.state.currentData.category_id
                                    }`
                                }}
                            />
                        </Tooltip>
                        <Divider type="vertical" />
                        <Tooltip title="Unpin">
                            <Button
                                type="danger"
                                shape="circle"
                                icon="pushpin"
                                onClick={() => {
                                    axios
                                        .post(`${configs.server_url}board/delete_board_info`, {
                                            board_id: this.state.board_id,
                                            resource_id: this.state.currentData.resource_id
                                        })
                                        .then(response => {
                                            if (response.data.code === 0) {
                                                this.openNotification('Success', 'You succeed to unpin this board')
                                                axios
                                                    .get(
                                                        `${configs.server_url}board/list_resource?board_id=${
                                                            this.state.board_id
                                                        }`
                                                    )
                                                    .then(response => {
                                                        if (response.data.code === 0) response = response.data
                                                        let temp = []
                                                        for (let i = 0; i < response.data.resources.length; i++) {
                                                            response.data.resources[i] =
                                                                response.data.resources[i].resource
                                                            temp.push({
                                                                id: response.data.resources[i].id,
                                                                name: response.data.resources[i].name,
                                                                creator: response.data.resources[i].creator,
                                                                image: response.data.resources[i].preview_image,
                                                                category_id: response.data.resources[i].category_id
                                                            })
                                                        }
                                                        this.setState({
                                                            BRAND_ITEMS: temp,
                                                            currentBoard: response.data.name,
                                                            visibleModal: false
                                                        })
                                                    })
                                            } else {
                                                this.openNotification('Error', response.data.msg)
                                            }
                                        })
                                        .catch(err => {
                                            this.openNotification('Error', 'You fail to unpin it')
                                        })
                                }}
                            />
                        </Tooltip>
                    </div>
                </Modal>
            </div>
        )
    }
}
