import React, { Component } from 'react';
import { Form, Icon, Input, Checkbox, Alert, Cascader, Upload, Tooltip, Select, notification, Button } from 'antd';
import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '../config';

const cookies = new Cookies();
const FormItem = Form.Item;
const Option = Select.Option;
const location = [
    {
        value: 'Shanghai',
        label: 'Shanghai',
        children: [
            {
                value: 'Shanghai',
                label: 'Shanghai',
                children: [
                    {
                        value: 'Xu Hui',
                        label: 'Xu Hui'
                    }
                ]
            }
        ]
    },
    {
        value: 'Zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'Hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'Xi Hu',
                        label: 'Xi Hu'
                    }
                ]
            }
        ]
    },
    {
        value: 'Jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'Nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'Zhong Hua Men',
                        label: 'Zhong Hua Men'
                    }
                ]
            }
        ]
    }
];

class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canDisplayAlert: false,
            canDisplaySuccess: false,
            alertText: '',
            showLogin: true,
            showRegis: true,
            hasSent: false,
            loading: false,
            action: `${config.server_url}user/upload/`,
            imageUrl: ''
        };
        this.handleSubmit = e => {
            return new Promise((resolve, reject) => {
                if (e) e.preventDefault();
                this.props.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                        delete values.remember;
                        delete values.loginBtn;
                        delete values.forget;
                        axios.post(`${config.server_url}user/login`, values).then(response => {
                            if (response.data && response.data.code !== 0) {
                                this.setState({
                                    alertText: response.data.msg,
                                    canDisplayAlert: true,
                                    canDisplaySuccess: false
                                });
                                reject();
                            } else {
                                this.setState({
                                    canDisplayAlert: false,
                                    canDisplaySuccess: false
                                });
                                cookies.set('loginInfo', response.data.data, { path: '/' });
                                resolve();
                            }
                        });
                    } else reject();
                });
            });
        };
        this.handleRegistrationSubmit = e => {
            return new Promise((resolve, reject) => {
                e.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                        const postValues = { ...values, avatar: values.avatar[0].response.data };
                        postValues.status = 1;
                        delete postValues.confirm;
                        postValues.phone = '+' + postValues.prefix + ' ' + postValues.phone;
                        postValues.location = postValues.location.join('-');
                        delete postValues.prefix;
                        axios.post(`${config.server_url}user/add`, postValues).then(response => {
                            if (response.data && response.data.code !== 0) {
                                this.setState({
                                    alertText: response.data.msg,
                                    canDisplayAlert: true,
                                    canDisplaySuccess: false
                                });
                                reject();
                            } else {
                                this.setState({
                                    canDisplayAlert: false,
                                    canDisplaySuccess: false
                                });
                                axios
                                    .post(`${config.server_url}user/login`, {
                                        email: values.email,
                                        password: values.password
                                    })
                                    .then(response1 => {
                                        cookies.set('loginInfo', response1.data.data, { path: '/' });
                                        resolve();
                                    });
                            }
                        });
                    } else reject();
                });
            });
        };
        this.handleForgetSubmit = e => {
            return new Promise((resolve, reject) => {
                if (e) e.preventDefault();
                this.props.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                        delete values.submitBtn;
                        delete values.login;
                        axios.post(`${config.server_url}user/reset_password`, values).then(response => {
                            if (response.data && response.data.code !== 0) {
                                this.setState({
                                    alertText: response.data.msg,
                                    canDisplayAlert: true,
                                    canDisplaySuccess: false
                                });
                                reject();
                            } else {
                                this.setState({
                                    canDisplayAlert: false,
                                    canDisplaySuccess: false,
                                    showLogin: true,
                                    showRegis: true
                                });
                                resolve();
                            }
                        });
                    } else reject();
                });
            });
        };
        this.sendConfirm = e => {
            return new Promise((resolve, reject) => {
                if (e) e.preventDefault();
                if (this.state.hasSent) {
                    let values = this.props.form.getFieldsValue();
                    console.log('Received values of form: ', values);
                    delete values.submitBtn;
                    delete values.login;
                    axios.post(`${config.server_url}user/forget`, { email: values.email }).then(response => {
                        console.log(response.data);
                        if (response.data && response.data.code !== 0) {
                            this.setState({
                                alertText: response.data.msg,
                                canDisplayAlert: true,
                                canDisplaySuccess: false
                            });
                            reject();
                        } else {
                            this.setState({
                                canDisplayAlert: false,
                                canDisplaySuccess: false
                            });
                            resolve();
                        }
                    });
                } else {
                    this.props.form.validateFields((err, values) => {
                        if (!err) {
                            console.log('Received values of form: ', values);
                            delete values.submitBtn;
                            delete values.login;
                            axios.post(`${config.server_url}user/forget`, values).then(response => {
                                console.log(response.data);
                                if (response.data && response.data.code !== 0) {
                                    this.setState({
                                        alertText: response.data.msg,
                                        canDisplayAlert: true,
                                        canDisplaySuccess: false,
                                        hasSent: false,
                                        showLogin: false,
                                        showRegis: false
                                    });
                                    reject();
                                } else {
                                    this.props.current.setState({ loginModalBtn: 'Confirm Reset' });
                                    this.setState({
                                        canDisplayAlert: false,
                                        canDisplaySuccess: false,
                                        hasSent: true,
                                        showLogin: false,
                                        showRegis: false
                                    });
                                    resolve();
                                }
                            });
                        } else reject();
                    });
                }
            });
        };
        this.handleConfirmBlur = e => {
            const value = e.target.value;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
        };
        this.compareToFirstPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('password')) {
                callback('Two passwords that you enter is inconsistent!');
            } else {
                callback();
            }
        };
        this.validateToNextPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.confirmDirty) {
                form.validateFields(['confirm'], { force: true });
            }
            callback();
        };
        this.normFile = e => {
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        };
        this.handleChange = info => {
            if (info.file.status === 'uploading') {
                this.setState({ loading: true });
                return;
            }
            if (info.file.status === 'done') {
                this.getBase64(info.file.originFileObj, imageUrl =>
                    this.setState({
                        imageUrl: info.file.response.data,
                        loading: false
                    })
                );
            }
        };
    }

    openNotification(msg, desc) {
        notification.open({
            message: msg,
            description: desc,
            placement: 'topLeft'
        });
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            this.openNotification('Error', 'The image must be less than 2MB');
        }
        return isLt2M;
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text" />
            </div>
        );
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86'
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
                <Option value="44">+44</Option>
            </Select>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <div>
                {this.state.showLogin ? (
                    <Form style={{ marginLeft: '5%', marginRight: '5%', marginTop: '5%' }} className="login-form">
                        <FormItem>
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!'
                                    },
                                    { required: true, message: 'Please input your email!' }
                                ]
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Email"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }]
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />
                            )}
                        </FormItem>
                        <FormItem style={{ textAlign: 'center' }}>
                            {getFieldDecorator('loginBtn', {
                                rules: []
                            })(<div />)}
                            {this.state.canDisplayAlert ? (
                                <Alert
                                    message={this.state.alertText}
                                    type="error"
                                    showIcon
                                    style={{ textAlign: 'center' }}
                                />
                            ) : null}
                            {this.state.canDisplaySuccess ? (
                                <Alert message="Success" type="success" showIcon style={{ textAlign: 'center' }} />
                            ) : null}
                        </FormItem>
                        <FormItem style={{ textAlign: 'center' }}>
                            {getFieldDecorator('forget', {
                                rules: []
                            })(
                                <div>
                                    <a
                                        className="login-form-forgot"
                                        onClick={() => {
                                            this.props.current.setState({ loginModalBtn: 'Send' });
                                            this.setState({ showLogin: false, showRegis: false, hasSent: false });
                                        }}
                                    >
                                        Forgot password?
                                    </a>
                                    <br />
                                    <a
                                        className="login-form-forgot"
                                        onClick={() => {
                                            this.props.current.setState({ loginModalBtn: 'Register' });
                                            this.setState({ showLogin: false, showRegis: true, hasSent: false });
                                        }}
                                    >
                                        Not yet registration?
                                    </a>
                                </div>
                            )}
                        </FormItem>
                    </Form>
                ) : this.state.showRegis ? (
                    <Form onSubmit={this.handleRegistrationSubmit}>
                        <FormItem {...formItemLayout} label="E-mail">
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!'
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!'
                                    }
                                ]
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Password">
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your password!'
                                    },
                                    {
                                        validator: this.validateToNextPassword
                                    }
                                ]
                            })(<Input type="password" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Confirm Password">
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please confirm your password!'
                                    },
                                    {
                                        validator: this.compareToFirstPassword
                                    }
                                ]
                            })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={
                                <span>
                                    Nickname&nbsp;
                                    <Tooltip title="What do you want others to call you?">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            }
                        >
                            {getFieldDecorator('nickname', {
                                rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }]
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Avatar">
                            <div className="dropbox">
                                {getFieldDecorator('avatar', {
                                    rules: [{ required: true, message: 'Please select a file!' }],
                                    valuePropName: 'fileList',
                                    getValueFromEvent: this.normFile
                                })(
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action={this.state.action}
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.handleChange}
                                        data={{ fileType: 'thumbnail' }}
                                    >
                                        {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
                                    </Upload>
                                )}
                            </div>
                        </FormItem>
                        <FormItem {...formItemLayout} label="Location">
                            {getFieldDecorator('location', {
                                initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                                rules: [{ type: 'array', required: true, message: 'Please select your location!' }]
                            })(<Cascader options={location} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="Phone Number">
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: 'Please input your phone number!' }]
                            })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                        </FormItem>
                        <div style={{ textAlign: 'center' }}>
                            {this.state.canDisplayAlert ? (
                                <Alert
                                    message={this.state.alertText}
                                    type="error"
                                    showIcon
                                    style={{ textAlign: 'center' }}
                                />
                            ) : null}
                            {this.state.canDisplaySuccess ? (
                                <Alert message="Success" type="success" showIcon style={{ textAlign: 'center' }} />
                            ) : null}
                            <br />
                            <a
                                className="login-form-forgot"
                                onClick={() => {
                                    this.props.current.setState({ loginModalBtn: 'Login' });
                                    this.setState({ showLogin: true, showRegis: true, hasSent: false });
                                }}
                            >
                                Want to login?
                            </a>
                        </div>
                    </Form>
                ) : (
                    <div>
                        {this.state.hasSent ? (
                            <Form
                                style={{ marginLeft: '10%', marginRight: '10%', marginTop: '15%' }}
                                onSubmit={this.handleSubmit}
                                className="login-form"
                            >
                                <FormItem>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                type: 'email',
                                                message: 'The input is not valid E-mail!'
                                            },
                                            { required: true, message: 'Please input your email!' }
                                        ]
                                    })(
                                        <Input
                                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Email"
                                        />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('content', {
                                        rules: [{ required: true, message: 'Please input the confirm code!' }]
                                    })(
                                        <Input
                                            prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Code"
                                        />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Please input a new password!' }]
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            type="password"
                                            placeholder="Password"
                                        />
                                    )}
                                </FormItem>
                                <FormItem style={{ textAlign: 'center' }}>
                                    {this.state.canDisplayAlert ? (
                                        <Alert
                                            message={this.state.alertText}
                                            type="error"
                                            showIcon
                                            style={{ textAlign: 'center' }}
                                        />
                                    ) : null}
                                    {this.state.canDisplaySuccess ? (
                                        <Alert
                                            message="Success"
                                            type="success"
                                            showIcon
                                            style={{ textAlign: 'center' }}
                                        />
                                    ) : null}
                                </FormItem>
                                <FormItem style={{ textAlign: 'center' }}>
                                    {getFieldDecorator('login', {
                                        rules: []
                                    })(
                                        <div>
                                            <a
                                                className="login-form-forgot"
                                                onClick={() => {
                                                    this.props.current.setState({ loginModalBtn: 'Login' });
                                                    this.setState({ showLogin: true, showRegis: true, hasSent: false });
                                                }}
                                            >
                                                Want to login?
                                            </a>
                                        </div>
                                    )}
                                </FormItem>
                            </Form>
                        ) : (
                            <Form
                                style={{ marginLeft: '10%', marginRight: '10%', marginTop: '15%' }}
                                onSubmit={this.sendConfirm}
                                className="login-form"
                            >
                                <FormItem>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                type: 'email',
                                                message: 'The input is not valid E-mail!'
                                            },
                                            { required: true, message: 'Please input your email!' }
                                        ]
                                    })(
                                        <Input
                                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Email"
                                        />
                                    )}
                                </FormItem>
                                <FormItem style={{ textAlign: 'center' }}>
                                    {this.state.canDisplayAlert ? (
                                        <Alert
                                            message={this.state.alertText}
                                            type="error"
                                            showIcon
                                            style={{ textAlign: 'center' }}
                                        />
                                    ) : null}
                                    {this.state.canDisplaySuccess ? (
                                        <Alert
                                            message="Success"
                                            type="success"
                                            showIcon
                                            style={{ textAlign: 'center' }}
                                        />
                                    ) : null}
                                </FormItem>
                                <FormItem style={{ textAlign: 'center' }}>
                                    {getFieldDecorator('login', {
                                        rules: []
                                    })(
                                        <div>
                                            <a
                                                className="login-form-forgot"
                                                onClick={() => {
                                                    this.props.current.setState({ loginModalBtn: 'Login' });
                                                    this.setState({ showLogin: true, showRegis: true, hasSent: false });
                                                }}
                                            >
                                                Want to login?
                                            </a>
                                        </div>
                                    )}
                                </FormItem>
                            </Form>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;
