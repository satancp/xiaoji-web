import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import classNames from 'classnames';
import styles from './Header.css';
import { Image } from './UIKit';
import ScrollAnim from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';
import { Modal, Button, Menu, Dropdown } from 'antd';
import Cookies from 'universal-cookie';
import LoginPage from './LoginHeader';
import { Redirect } from 'react-router';

const cookies = new Cookies();
const Link = ScrollAnim.Link;

class HeaderVM {
    navs = [
        { label: 'Home', anchor: 'home' },
        { label: 'Star projects', anchor: 'star' },
        { label: 'Your favourites', anchor: 'favourite' },
        { label: 'Category', anchor: 'category' }
    ];
    @observable scrollY = false;

    @action
    setScrollY = () => {
        this.scrollY = !!window.scrollY;
    };
}

@observer
export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            hasLogin: false,
            loginData: {},
            loginBtn: 'Login',
            loginModalBtn: 'Login',
            loadingResend: false,
            redirect: false
        };
        this.logout = () => {
            cookies.remove('loginInfo', { path: '/' });
            this.vm.navs = [
                { label: 'Home', anchor: 'home' },
                { label: 'Star projects', anchor: 'star' },
                { label: 'Category', anchor: 'category' }
            ];
            this.props.homepage.checkCache();
            this.setState({
                hasLogin: false,
                loginData: {},
                loginBtn: 'Login',
                loginModalBtn: 'Login',
                redirect: true
            });
        };
        this.loginpage = {
            state: {
                hasSent: false
            }
        };
    }

    showModal = () => {
        if (!this.state.hasLogin) {
            this.setState({
                visible: true
            });
        }
    };

    handleOk = e => {
        this.setState({ loading: true });
        if (this.loginpage.state.showLogin) {
            this.loginpage
                .handleSubmit(e)
                .then(() => {
                    const cache = cookies.get('loginInfo');
                    this.vm.navs = [
                        { label: 'Home', anchor: 'home' },
                        { label: 'Star projects', anchor: 'star' },
                        { label: 'Your favourites', anchor: 'favourite' },
                        { label: 'Category', anchor: 'category' }
                    ];
                    this.props.homepage.checkCache();
                    this.setState({
                        loading: false,
                        visible: false,
                        hasLogin: true,
                        loginData: cache,
                        loginBtn: 'Profile'
                    });
                })
                .catch(err => {
                    this.vm.navs = [
                        { label: 'Home', anchor: 'home' },
                        { label: 'Star projects', anchor: 'star' },
                        { label: 'Category', anchor: 'category' }
                    ];
                    this.props.homepage.checkCache();
                    this.setState({
                        hasLogin: false,
                        loginData: {},
                        loginBtn: 'Login',
                        loading: false,
                        loginModalBtn: 'Login'
                    });
                });
        } else {
            if (this.loginpage.state.showRegis) {
                this.loginpage
                    .handleRegistrationSubmit(e)
                    .then(() => {
                        const cache = cookies.get('loginInfo');
                        this.vm.navs = [
                            { label: 'Home', anchor: 'home' },
                            { label: 'Star projects', anchor: 'star' },
                            { label: 'Your favourites', anchor: 'favourite' },
                            { label: 'Category', anchor: 'category' }
                        ];
                        this.props.homepage.checkCache();
                        this.setState({
                            loading: false,
                            visible: false,
                            hasLogin: true,
                            loginData: cache,
                            loginBtn: 'Profile'
                        });
                    })
                    .catch(err => {
                        this.vm.navs = [
                            { label: 'Home', anchor: 'home' },
                            { label: 'Star projects', anchor: 'star' },
                            { label: 'Category', anchor: 'category' }
                        ];
                        this.props.homepage.checkCache();
                        this.setState({
                            hasLogin: false,
                            loginData: {},
                            loginBtn: 'Login',
                            loading: false,
                            loginModalBtn: 'Login'
                        });
                    });
            } else {
                if (this.loginpage.state.hasSent) {
                    this.loginpage
                        .handleForgetSubmit(e)
                        .then(() => {
                            this.setState({
                                loading: false,
                                visible: false,
                                hasLogin: false,
                                loginData: {},
                                loginBtn: 'Login',
                                loginModalBtn: 'Login'
                            });
                        })
                        .catch(err => {
                            this.setState({
                                loading: false
                            });
                        });
                } else {
                    this.loginpage
                        .sendConfirm(e)
                        .then(() => {
                            this.setState({
                                loading: false
                            });
                        })
                        .catch(err => {
                            this.setState({
                                loading: false
                            });
                        });
                }
            }
        }
    };

    handleResend = e => {
        this.setState({ loadingResend: true });
        this.loginpage
            .sendConfirm(e)
            .then(() => {
                this.setState({
                    loadingResend: false
                });
            })
            .catch(err => {
                this.setState({
                    loadingResend: false
                });
            });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    componentWillMount() {
        this.vm = new HeaderVM();
    }

    componentDidMount() {
        const vm = this.vm;
        window.addEventListener('scroll', vm.setScrollY, false);
        const cache = cookies.get('loginInfo');
        if (!cache) {
            this.vm.navs = [
                { label: 'Home', anchor: 'home' },
                { label: 'Star projects', anchor: 'star' },
                { label: 'Category', anchor: 'category' }
            ];
            this.setState({ hasLogin: false, loginData: {}, loginBtn: 'Login' });
        } else {
            this.vm.navs = [
                { label: 'Home', anchor: 'home' },
                { label: 'Star projects', anchor: 'star' },
                { label: 'Your favourites', anchor: 'favourite' },
                { label: 'Category', anchor: 'category' }
            ];
            this.setState({ hasLogin: true, loginData: cache, loginBtn: 'Profile' });
        }
    }

    render() {
        const { visible, loading, loadingResend } = this.state;
        const vm = this.vm;
        const cache = cookies.get('loginInfo') || { id: 0 };
        const className = classNames(styles.container, vm.scrollY && styles.backgroundWhite);
        const menu = (
            <Menu style={{ textAlign: 'center' }}>
                <Menu.Item key="0">
                    <a href={`/user/${cache.id}`}>Profile</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a href={`/resource/add`}>Publish a new resource</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="2">
                    <a onClick={this.logout}>Logout</a>
                </Menu.Item>
            </Menu>
        );
        if (this.state.redirect) {
            return <Redirect push to="/" />;
        }
        return (
            <div className={className}>
                <QueueAnim type="top" delay={400}>
                    <a href="/#home" key="log">
                        <img src={Image.Logo} alt="logo" />
                    </a>
                    <div key="nav" className={styles.nav}>
                        {vm.navs.map((item, k) => {
                            return (
                                <Link className={styles.link} key={k} to={item.anchor}>
                                    {item.label}
                                </Link>
                            );
                        })}
                        {this.state.hasLogin ? (
                            <Dropdown overlay={menu} key="profiledrop">
                                <span
                                    className={styles.link}
                                    key={'login'}
                                    onClick={this.showModal}
                                    style={{ display: 'flex' }}
                                >
                                    <img
                                        alt={'avatar'}
                                        src={this.state.loginData.avatar}
                                        style={{
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20,
                                            borderBottomLeftRadius: 20,
                                            borderBottomRightRadius: 20,
                                            width: 40,
                                            height: 40,
                                            marginTop: -10,
                                            marginRight: 5
                                        }}
                                    />
                                    <p>{this.state.loginData.nickname}</p>
                                </span>
                            </Dropdown>
                        ) : (
                            <span className={styles.link} key={'login'} onClick={this.showModal}>
                                <p>{this.state.loginBtn}</p>
                            </span>
                        )}
                    </div>
                    <Modal
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        wrapClassName="vertical-center-modal"
                        closable={false}
                        footer={
                            this.loginpage.state.hasSent &&
                            !this.loginpage.state.showLogin &&
                            !this.loginpage.state.showRegis
                                ? [
                                      <Button key="back" onClick={this.handleCancel}>
                                          Cancel
                                      </Button>,
                                      <Button
                                          key="resend"
                                          style={{ backgroundColor: '#69dd2a', color: 'white' }}
                                          loading={loadingResend}
                                          onClick={this.handleResend}
                                      >
                                          Resend
                                      </Button>,
                                      <Button key="confirm" type="primary" loading={loading} onClick={this.handleOk}>
                                          {this.state.loginModalBtn}
                                      </Button>
                                  ]
                                : [
                                      <Button key="back" onClick={this.handleCancel}>
                                          Cancel
                                      </Button>,
                                      <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                                          {this.state.loginModalBtn}
                                      </Button>
                                  ]
                        }
                    >
                        <LoginPage onRef={ref => (this.loginpage = ref)} current={this} />
                    </Modal>
                </QueueAnim>
            </div>
        );
    }
}
