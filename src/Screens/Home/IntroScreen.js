import React, {Component} from 'react'
import styles from './IntroScreen.css'
import {Title} from '~/Components/Title'
import {Image} from '~/Components/UIKit'
import ScrollAnim from 'rc-scroll-anim'
import QueueAnim from 'rc-queue-anim'
import classNames from 'classnames'
import {Button, Modal, Divider, Tooltip, notification, Table, Form, Input} from 'antd'
import axios from 'axios'
import configs from '../../config'
import Cookies from 'universal-cookie'
import TweenOne from 'rc-tween-one'

const cookies = new Cookies()
const OverPack = ScrollAnim.OverPack
const FormItem = Form.Item

class IntroScreen extends Component {
    INTRO_ITEMS = [
        {
            title: '',
            subTitle: '',
            img: Image.Intro1,
            desc: '',
            index: 1,
            pos: 'left',
            resource_id: 1,
            category_id: 1
        },
        {
            title: '',
            subTitle: '',
            img: Image.Intro2,
            desc: '',
            index: 2,
            pos: 'center',
            resource_id: 1,
            category_id: 1
        },
        {
            title: '',
            subTitle: '',
            img: Image.Intro3,
            desc: '',
            index: 3,
            pos: 'right',
            resource_id: 1,
            category_id: 1
        }
    ]

    constructor(props) {
        super(props)
        this.convertStyle = number => {
            if (number < 10) {
                return '0' + number
            } else return number
        }
        this.state = {
            visibleModal: false,
            showBoardList: false,
            pinBtnLoading: false,
            showAnim: false,
            showAnim1: false,
            showAnim2: false,
            anim1IsReverse: false,
            anim2IsReverse: false,
            width: 150,
            showAddBoard: true,
            loadingAdd: false,
            top: '45%',
            currentBoards: []
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
        axios.get(`${configs.server_url}home/list_star`).then(response => {
            if (response.data.code === 0) response = response.data
            for (let i = 0; i < response.data.length; i++) {
                if (i <= 2) {
                    this.INTRO_ITEMS[i].title = response.data[i].name
                    this.INTRO_ITEMS[i].index = response.data[i].index
                    this.INTRO_ITEMS[i].subTitle = response.data[i].category
                    this.INTRO_ITEMS[i].img = response.data[i].preview_image
                    this.INTRO_ITEMS[i].desc = response.data[i].desc
                    this.INTRO_ITEMS[i].category_id = response.data[i].category_id
                    this.INTRO_ITEMS[i].resource_id = response.data[i].resource_id
                } else break
            }
        })
    }

    render() {
        const cache = cookies.get('loginInfo')
        const IntroItem = props => {
            const {title, subTitle, img, desc, pos, resource_id, category_id, index} = props.item
            const className = classNames(styles.introItem, styles[pos])
            return (
                <a
                    onClick={() => {
                        this.setState({
                            visibleModal: true,
                            currentData: {
                                resource_id,
                                category_id
                            },
                            showAnim: false,
                            showAnim1: false,
                            showAnim2: true,
                            anim2IsReverse: true,
                            showAddBoard: true,
                            width: 150,
                            top: '45%'
                        })
                    }}>
                    <div className={className}>
                        <div className={styles.watermark}>{index}</div>
                        <img src={img} className={styles.image} alt="logo" />
                        <div className={styles.textWrapper}>
                            <h2>{title}</h2>
                            <h3>{subTitle}</h3>
                            <div className={styles.divider} />
                            <p>{desc}</p>
                        </div>
                    </div>
                </a>
            )
        }
        const animation1 = {scale: 1, yoyo: true, repeat: 0, duration: 1000}
        const animation2 = {scale: 0, yoyo: true, repeat: 0, duration: 1000}
        const columns = [
            {
                title: 'Id',
                dataIndex: 'id'
            },
            {
                title: 'Name',
                dataIndex: 'name'
            },
            {
                title: 'Count of Resources',
                dataIndex: 'resourceCount'
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => {
                    if (record.hasPinned) {
                        return (
                            <span>
                                <Tooltip title="Unpin">
                                    <Button
                                        type="danger"
                                        shape="circle"
                                        icon="pushpin"
                                        onClick={() => {
                                            axios
                                                .post(`${configs.server_url}board/delete_board_info`, {
                                                    board_id: record.id,
                                                    resource_id: this.state.currentData.resource_id
                                                })
                                                .then(response => {
                                                    if (response.data.code === 0) {
                                                        this.openNotification(
                                                            'Success',
                                                            'You succeed to unpin this board'
                                                        )
                                                        axios
                                                            .get(
                                                                `${configs.server_url}board/list_simple?user_id=${
                                                                    cache.id
                                                                }&resource_id=${this.state.currentData.resource_id}`
                                                            )
                                                            .then(response => {
                                                                if (response.data.code === 0) response = response.data
                                                                this.setState({
                                                                    currentBoards: response.data
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
                            </span>
                        )
                    } else {
                        return null
                    }
                }
            }
        ]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                if (selectedRows.length > 0) {
                    this.currentBoardId = selectedRows[0].id
                }
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            },
            type: 'radio'
        }
        const {getFieldDecorator} = this.props.form
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
                <Modal
                    maskClosable={true}
                    closable={false}
                    width={this.state.width}
                    style={{top: this.state.top}}
                    visible={this.state.visibleModal}
                    onCancel={() => {
                        this.setState({visibleModal: false})
                    }}
                    title={this.state.showAnim ? <p>Choose a board</p> : null}
                    footer={
                        this.state.showAnim
                            ? [
                                  <Button
                                      key="backBtn"
                                      onClick={() => {
                                          this.setState({showAnim1: true, anim1IsReverse: true}, () => {
                                              if (this.timer) {
                                                  clearTimeout(this.timer)
                                              }
                                              this.timer = setTimeout(() => {
                                                  this.setState({
                                                      showAnim: false,
                                                      showAnim1: false,
                                                      showAnim2: true,
                                                      anim2IsReverse: true,
                                                      width: 150,
                                                      top: '45%'
                                                  })
                                              }, 1000)
                                          })
                                      }}>
                                      Back
                                  </Button>,
                                  <Button
                                      key="confirmBtn"
                                      type="primary"
                                      onClick={() => {
                                          axios
                                              .post(`${configs.server_url}board/add_board_info`, {
                                                  board_id: this.currentBoardId,
                                                  resource_id: this.state.currentData.resource_id
                                              })
                                              .then(response => {
                                                  if (response.data.code === 0) {
                                                      this.openNotification(
                                                          'Success',
                                                          'You succeed to pin it to the board'
                                                      )
                                                      axios
                                                          .get(
                                                              `${configs.server_url}board/list_simple?user_id=${
                                                                  cache.id
                                                              }&resource_id=${this.state.currentData.resource_id}`
                                                          )
                                                          .then(response => {
                                                              if (response.data.code === 0) response = response.data
                                                              this.setState(
                                                                  {
                                                                      showAnim1: true,
                                                                      anim1IsReverse: true,
                                                                      currentBoards: response.data
                                                                  },
                                                                  () => {
                                                                      if (this.timer) {
                                                                          clearTimeout(this.timer)
                                                                      }
                                                                      this.timer = setTimeout(() => {
                                                                          this.setState({
                                                                              showAnim: false,
                                                                              showAnim1: false,
                                                                              showAnim2: true,
                                                                              anim2IsReverse: true,
                                                                              width: 150,
                                                                              top: '45%'
                                                                          })
                                                                      }, 1000)
                                                                  }
                                                              )
                                                          })
                                                  } else {
                                                      this.openNotification('Error', response.data.msg)
                                                  }
                                              })
                                              .catch(err => {
                                                  this.openNotification('Error', 'You fail to pin it')
                                              })
                                      }}>
                                      Confirm
                                  </Button>
                              ]
                            : null
                    }>
                    {this.state.showAnim ? (
                        <TweenOne
                            animation={animation1}
                            reverse={this.state.anim1IsReverse}
                            paused={!this.state.showAnim1}
                            style={{transform: 'scale(0)'}}
                            className="code-box-shape">
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Table
                                    showHeader={true}
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={this.state.currentBoards}
                                    rowKey="id"
                                    loading={this.state.loadingAdd}
                                    footer={() => {
                                        if (this.state.showAddBoard) {
                                            return (
                                                <Tooltip title="Add a new board">
                                                    <Button
                                                        icon="plus"
                                                        shape="circle"
                                                        onClick={() => {
                                                            this.setState({showAddBoard: false})
                                                        }}
                                                    />
                                                </Tooltip>
                                            )
                                        } else {
                                            return (
                                                <FormItem style={{marginBottom: 0}}>
                                                    {getFieldDecorator('name', {
                                                        rules: [{required: true, message: 'You should input a name'}]
                                                    })(
                                                        <Input
                                                            placeholder="Input Name"
                                                            onPressEnter={() => {
                                                                this.setState({loadingAdd: true})
                                                                const cache = cookies.get('loginInfo')
                                                                this.props.form.validateFields(
                                                                    ['name'],
                                                                    (errors, values) => {
                                                                        if (errors) return
                                                                        const value = values['name']
                                                                        axios
                                                                            .post(`${configs.server_url}board/add`, {
                                                                                name: value,
                                                                                user_id: cache.id
                                                                            })
                                                                            .then(response => {
                                                                                this.setState(
                                                                                    {loadingAdd: false},
                                                                                    () => {
                                                                                        if (response.data.code === 0) {
                                                                                            this.openNotification(
                                                                                                'Success',
                                                                                                'You succeed to add a new board'
                                                                                            )
                                                                                            axios
                                                                                                .get(
                                                                                                    `${
                                                                                                        configs.server_url
                                                                                                    }board/list_simple?user_id=
                                ${cache.id}`
                                                                                                )
                                                                                                .then(response => {
                                                                                                    if (
                                                                                                        response.data
                                                                                                            .code === 0
                                                                                                    )
                                                                                                        response =
                                                                                                            response.data
                                                                                                    this.setState({
                                                                                                        currentBoards:
                                                                                                            response.data,
                                                                                                        showAddBoard: true
                                                                                                    })
                                                                                                })
                                                                                        } else {
                                                                                            this.openNotification(
                                                                                                'Error',
                                                                                                response.data.msg
                                                                                            )
                                                                                        }
                                                                                    }
                                                                                )
                                                                            })
                                                                            .catch(error => {
                                                                                this.setState(
                                                                                    {loadingAdd: false},
                                                                                    () => {
                                                                                        this.openNotification(
                                                                                            'Error',
                                                                                            'You fail to add a new board'
                                                                                        )
                                                                                    }
                                                                                )
                                                                            })
                                                                    }
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </FormItem>
                                            )
                                        }
                                    }}
                                />
                            </div>
                        </TweenOne>
                    ) : (
                        <TweenOne
                            animation={animation2}
                            reverse={this.state.anim2IsReverse}
                            paused={!this.state.showAnim2}
                            style={{transform: 'scale(1)'}}
                            className="code-box-shape">
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
                                {cache ? <Divider type="vertical" /> : null}
                                {cache ? (
                                    <Tooltip title="Pin it to a board">
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            style={{
                                                backgroundColor: '#65cc43',
                                                borderColor: '#65cc43'
                                            }}
                                            icon="pushpin-o"
                                            loading={this.state.pinBtnLoading}
                                            onClick={() => {
                                                const cache = cookies.get('loginInfo')
                                                if (cache) {
                                                    axios
                                                        .get(
                                                            `${configs.server_url}board/list_simple?user_id=${
                                                                cache.id
                                                            }&resource_id=${this.state.currentData.resource_id}`
                                                        )
                                                        .then(response => {
                                                            if (response.data.code === 0) response = response.data
                                                            this.setState(
                                                                {
                                                                    showAnim2: true,
                                                                    anim2IsReverse: false,
                                                                    currentBoards: response.data
                                                                },
                                                                () => {
                                                                    if (this.timer) {
                                                                        clearTimeout(this.timer)
                                                                    }
                                                                    this.timer = setTimeout(() => {
                                                                        this.setState({
                                                                            showAnim: true,
                                                                            showAnim1: true,
                                                                            showAnim2: false,
                                                                            anim1IsReverse: false,
                                                                            width: 600,
                                                                            top: '0%'
                                                                        })
                                                                    }, 1000)
                                                                }
                                                            )
                                                        })
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                ) : null}
                            </div>
                        </TweenOne>
                    )}
                </Modal>
            </div>
        )
    }
}

let IntroScreenReal

export default (IntroScreenReal = Form.create()(IntroScreen))
