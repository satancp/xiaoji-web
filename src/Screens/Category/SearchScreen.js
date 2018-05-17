import React, {Component} from 'react'
import styles from './SearchScreen.css'
import {Title} from '~/Components/Title'
import ScrollAnim from 'rc-scroll-anim'
import QueueAnim from 'rc-queue-anim'
import axios from 'axios'
import configs from '../../config'
import {notification, Modal, Tooltip, Button, Divider, Form, Table, Input} from 'antd'
import TweenOne from 'rc-tween-one'
import Cookies from 'universal-cookie'

const FormItem = Form.Item
const OverPack = ScrollAnim.OverPack
const cookies = new Cookies()

const ServiceItem = props => {
    const {image, name} = props.item
    return (
        <div className={styles.serviceItem} style={{alignItems: 'center'}}>
            <img src={image} alt="service" />
            <div className={styles.divider} />
            <p>{name}</p>
        </div>
    )
}

const BrandItem = props => {
    const {name, creator, image} = props.item
    return (
        <div className={styles.brandItem}>
            <img src={image} alt="brand" />
            <p className={styles.english}>{name}</p>
            <p className={styles.name}>{creator}</p>
        </div>
    )
}

class SearchScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            SERVICE_ITEMS: [],
            BRAND_ITEMS: [],
            category_id: parseInt(props.category_id, 10),
            currentCategory: '',
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
        this.linkToCategory = item => {
            window.location = '/category/' + item.id + '/'
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
        axios.get(`${configs.server_url}category/list`).then(response => {
            if (response.data.code === 0) response = response.data
            let temp = []
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].id === this.state.category_id) {
                    this.setState({currentCategory: response.data[i].display_name})
                }
                temp.push({
                    id: response.data[i].id,
                    name: response.data[i].display_name,
                    image: response.data[i].icon
                })
            }
            this.setState({SERVICE_ITEMS: temp})
        })
        axios
            .get(`${configs.server_url}resource/get_resources?category_id=${this.state.category_id}`)
            .then(response => {
                if (response.data.code === 0) response = response.data
                let temp = []
                for (let i = 0; i < response.data.length; i++) {
                    temp.push({
                        id: response.data[i].id,
                        name: response.data[i].name,
                        creator: response.data[i].creator,
                        image: response.data[i].preview_image
                    })
                }
                this.setState({BRAND_ITEMS: temp})
            })
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const animation1 = {scale: 1, yoyo: true, repeat: 0, duration: 1000}
        const animation2 = {scale: 0, yoyo: true, repeat: 0, duration: 1000}
        const cache = cookies.get('loginInfo')
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
        return (
            <div className={styles.container}>
                <OverPack id="categories" playScale={0} className={styles.wrapper2}>
                    <QueueAnim leaveReverse key="featureWrapper">
                        <Title key="title" name="Categories" />
                        <QueueAnim leaveReverse type="scale" key="category" className={styles.serviceWrapper}>
                            {this.state.SERVICE_ITEMS.map((item, index) => (
                                <a
                                    onClick={this.linkToCategory.bind(this, item)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: 'transparent',
                                        color: 'black'
                                    }}
                                    key={index}>
                                    <ServiceItem item={item} key={index} />
                                </a>
                            ))}
                        </QueueAnim>
                    </QueueAnim>
                </OverPack>
                <OverPack id="resources" playScale={0} className={styles.wrapper2}>
                    <QueueAnim leaveReverse key="featureWrapper">
                        <Title key="title" name={`${this.state.currentCategory} Items`} />
                        <QueueAnim leaveReverse type="scale" key="category" className={styles.brandWrapper}>
                            {this.state.BRAND_ITEMS.map((item, index) => {
                                const category_id = this.state.category_id
                                const resource_id = item.id
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

let SearchScreenReal

export default (SearchScreenReal = Form.create()(SearchScreen))
