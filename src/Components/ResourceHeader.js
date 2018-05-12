import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import classNames from 'classnames';
import { Redirect } from 'react-router';
import styles from './Header.css';
import { Image } from './UIKit';
import ScrollAnim from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';
import Cookies from 'universal-cookie';
import LoginPage from './LoginHeader';
import { Menu, Dropdown, Modal, Button } from 'antd';

const cookies = new Cookies();
const LinkS = ScrollAnim.Link;

class HeaderVM {
    navs = [
        { label: 'Home', anchor: 'home' },
        { label: 'Title', anchor: 'title' },
        { label: 'Content', anchor: 'content' },
        { label: 'Discussion', anchor: 'discussion' }
    ];
    @observable scrollY = false;

    @action
    setScrollY = () => {
        this.scrollY = !!window.scrollY;
    };
}

@observer
export default class ResourceHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            hasLogin: false,
            loginData: {},
            loginBtn: 'Login',
            category_id: parseInt(props.category_id, 10),
            redirect: false
        };
        this.setCategoryName = category_name => {
            this.vm.navs = [
                { label: 'Home', anchor: 'home' },
                { label: category_name + ' category', anchor: 'category' },
                { label: 'Title', anchor: 'title' },
                { label: 'Content', anchor: 'content' },
                { label: 'Relevant', anchor: 'relevant' },
                { label: 'Discussion', anchor: 'discussion' }
            ];
            this.setState({ category_name });
        };
        this.logout = () => {
            cookies.remove('loginInfo', { path: '/' });
            this.setState({ hasLogin: false, loginData: {}, loginBtn: 'Login', redirect: true });
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
        this.loginpage
            .handleSubmit(e)
            .then(() => {
                const cache = cookies.get('loginInfo');
                this.setState({
                    loading: false,
                    visible: false,
                    hasLogin: true,
                    loginData: cache,
                    loginBtn: 'Profile'
                });
            })
            .catch(err => {
                this.setState({ hasLogin: false, loginData: {}, loginBtn: 'Login', loading: false });
            });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    componentWillMount() {
        this.vm = new HeaderVM();
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    componentDidMount() {
        const vm = this.vm;
        this.props.onRef(this);
        window.addEventListener('scroll', vm.setScrollY, false);
        const cache = cookies.get('loginInfo');
        if (!cache) {
            this.setState({ hasLogin: false, loginData: {}, loginBtn: 'Login' });
        } else {
            this.setState({ hasLogin: true, loginData: cache, loginBtn: 'Profile' });
        }
    }

    render() {
        const { visible, loading } = this.state;
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
            return <Redirect push="/" />;
        }
        return (
            <div className={className}>
                <QueueAnim type="top" delay={400}>
                    <a href="/" key="log">
                        <img src={Image.Logo} alt="logo" />
                    </a>
                    <div key="nav" className={styles.nav}>
                        {vm.navs.map((item, k) => {
                            if (item.anchor === 'home') {
                                return (
                                    <Link className={styles.link} key={k} to="/">
                                        {item.label}
                                    </Link>
                                );
                            } else if (item.anchor === 'category') {
                                return (
                                    <Link className={styles.link} key={k} to={`/category/${this.state.category_id}/`}>
                                        {item.label}
                                    </Link>
                                );
                            } else {
                                return (
                                    <LinkS className={styles.link} key={k} to={item.anchor}>
                                        {item.label}
                                    </LinkS>
                                );
                            }
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
                        footer={[
                            <Button key="back" onClick={this.handleCancel}>
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                                Login
                            </Button>
                        ]}
                    >
                        <LoginPage onRef={ref => (this.loginpage = ref)} />
                    </Modal>
                </QueueAnim>
            </div>
        );
    }
}
