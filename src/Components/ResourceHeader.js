import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import classNames from 'classnames';
import styles from './Header.css';
import { Image } from './UIKit';
import ScrollAnim from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';

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
            category_id: parseInt(props.category_id, 10)
        };
        this.setCategoryName = category_name => {
            this.vm.navs = [
                { label: 'Home', anchor: 'home' },
                { label: category_name + ' category', anchor: 'category' },
                { label: 'Title', anchor: 'title' },
                { label: 'Content', anchor: 'content' },
                { label: 'Relevant information', anchor: 'relevant' },
                { label: 'Discussion', anchor: 'discussion' }
            ];
            this.setState({ category_name });
        };
    }

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
    }

    render() {
        const vm = this.vm;
        const className = classNames(styles.container, vm.scrollY && styles.backgroundWhite);
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
                    </div>
                </QueueAnim>
            </div>
        );
    }
}
