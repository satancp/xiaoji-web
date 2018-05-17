import React, {Component} from 'react'
import styles from './UserProfileScreen.css'
import {Image} from '~/Components/UIKit'
import QueueAnim from 'rc-queue-anim'
import Cookies from 'universal-cookie'
import axios from 'axios'
import configs from '../../config'
import moment from 'moment'
import {Title} from '~/Components/Title'
import {Table, Timeline, Badge, Tooltip, Button, Icon, Divider, notification} from 'antd'
import {Footer} from '../../Components/Footer'

const cookies = new Cookies()

export default class UserProfileScreen extends Component {
    constructor(props) {
        super(props)
        this.columns = [
            {title: 'Name', dataIndex: 'name', key: 'name'},
            {title: 'Category', dataIndex: 'category', key: 'category', width: 120},
            {title: 'Description', dataIndex: 'desc', key: 'desc'},
            {
                title: 'Preview Image',
                dataIndex: 'preview_image',
                key: 'preview_image',
                width: 50,
                render: text => <img alt={text} src={text} style={{width: 100, height: 100}} />
            },
            {
                title: 'Published Time',
                dataIndex: 'created_at',
                key: 'created_at',
                render: text => {
                    const year = moment(text, moment.ISO_8601).year()
                    const month = moment(text, moment.ISO_8601)
                        .month()
                        .toString()
                        .padStart(2, '0')
                    const day = moment(text, moment.ISO_8601)
                        .date()
                        .toString()
                        .padStart(2, '0')
                    const hour = moment(text, moment.ISO_8601).hour()
                    const minute = moment(text, moment.ISO_8601)
                        .minute()
                        .toString()
                        .padStart(2, '0')
                    return <p>{year + '-' + month + '-' + day + ' ' + hour + ':' + minute}</p>
                }
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                filters: [
                    {
                        text: 'Approved',
                        value: 2
                    },
                    {
                        text: 'Abandoned',
                        value: 1
                    },
                    {
                        text: 'Pending',
                        value: 0
                    }
                ],
                onFilter: (value, record) => {
                    return record.status === value
                },
                render: (text, record) => {
                    if (record.status === 0) {
                        return (
                            <span>
                                <Badge status="processing" />Pending
                            </span>
                        )
                    } else if (record.status === 1) {
                        return (
                            <span>
                                <Badge status="error" />Abandoned
                            </span>
                        )
                    } else if (record.status === 2) {
                        return (
                            <span>
                                <Badge status="success" />Approved
                            </span>
                        )
                    } else {
                        return (
                            <span>
                                <Badge status="warning" />Warning
                            </span>
                        )
                    }
                }
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => {
                    if (record.status === 1) {
                        return (
                            <span>
                                <Tooltip title="Apply to delete">
                                    <Button
                                        type="danger"
                                        shape="circle"
                                        icon="delete"
                                        onClick={() => {
                                            this.applyToDelete(record)
                                        }}
                                    />
                                </Tooltip>
                            </span>
                        )
                    } else {
                        return (
                            <span>
                                <Tooltip title="View">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon="search"
                                        onClick={() => {
                                            window.location.href = `/resource/${record.id}/${record.category_id}`
                                        }}
                                    />
                                </Tooltip>
                                <Divider type="vertical" />
                                <Tooltip title="Apply to delete">
                                    <Button
                                        type="danger"
                                        shape="circle"
                                        icon="delete"
                                        onClick={() => {
                                            this.applyToDelete(record)
                                        }}
                                    />
                                </Tooltip>
                            </span>
                        )
                    }
                }
            }
        ]
        this.state = {
            loginData: cookies.get('loginInfo'),
            welcomeText: '',
            bgName: '',
            currentStyle: {
                textAlign: 'right',
                marginTop: '25%',
                marginRight: '-100%'
            },
            allResources: []
        }
        this.applyToDelete = data => {
            const cache = cookies.get('loginInfo')
            axios
                .post(`${configs.server_url}resource/apply_to_delete`, {
                    user_id: cache.id,
                    resource_id: data.id
                })
                .then(response => {
                    if (response.data.code === 0) {
                        this.openNotification('Success', 'You apply to delete it successfully')
                    } else {
                        this.openNotification('Error', response.data.msg)
                    }
                })
                .catch(error => {
                    this.openNotification('Error', 'You fail to apply')
                })
        }
        this.openNotification = (msg, desc) => {
            notification.open({
                message: msg,
                description: desc,
                placement: 'topLeft'
            })
        }
    }

    componentDidMount() {
        const cache = cookies.get('loginInfo')
        if (!cache) {
            window.location = '/'
        }
        axios
            .get(
                `${configs.server_url}resource/get_resources_by_user?user_id=
                    ${this.state.loginData.id}`
            )
            .then(response => {
                if (response.data.code === 0) response = response.data
                this.setState({
                    allResources: response.data
                })
            })
    }

    convertStyle(text) {
        const year = moment(text, moment.ISO_8601).year()
        const month = moment(text, moment.ISO_8601)
            .month()
            .toString()
            .padStart(2, '0')
        const day = moment(text, moment.ISO_8601)
            .date()
            .toString()
            .padStart(2, '0')
        const hour = moment(text, moment.ISO_8601).hour()
        const minute = moment(text, moment.ISO_8601)
            .minute()
            .toString()
            .padStart(2, '0')
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    }

    render() {
        return (
            <div id="user_resource" className={styles.resourceContainer} style={{marginTop: '10%'}}>
                <QueueAnim className={styles.wrapper} type="scaleBig" delay={200} duration={600}>
                    <Title key="user_resource_title" name="Resources You Published" />
                    <Table
                        columns={this.columns}
                        style={{marginTop: '1%', width: 'auto', marginLeft: '5%', marginRight: '5%'}}
                        rowKey={(record, index) => {
                            return record.id
                        }}
                        expandedRowRender={record => {
                            const temp = [
                                <Timeline.Item>
                                    Publish this resource at {this.convertStyle(record.created_at)}
                                </Timeline.Item>
                            ]
                            if (record.status === 0) {
                                temp.push(
                                    <Timeline.Item
                                        dot={<Icon type="clock-circle-o" style={{fontSize: '16px'}} />}
                                        color="green">
                                        Still waiting for being approved
                                    </Timeline.Item>
                                )
                            } else if (record.status === 1) {
                                temp.push(<Timeline.Item>Waiting for being approved</Timeline.Item>)
                                temp.push(
                                    <Timeline.Item
                                        dot={<Icon type="close-circle-o" style={{fontSize: '16px'}} />}
                                        color="red">
                                        Be abandoned at {this.convertStyle(record.updated_at)}
                                    </Timeline.Item>
                                )
                            } else if (record.status === 2) {
                                temp.push(<Timeline.Item>Waiting for being approved</Timeline.Item>)
                                temp.push(
                                    <Timeline.Item dot={<Icon type="check-circle-o" style={{fontSize: '16px'}} />}>
                                        Be approved at {this.convertStyle(record.updated_at)}
                                    </Timeline.Item>
                                )
                            }
                            return <Timeline>{temp}</Timeline>
                        }}
                        dataSource={this.state.allResources}
                    />
                    <Footer />
                </QueueAnim>
            </div>
        )
    }
}
