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
        { label: 'Categories', anchor: 'categories' },
        { label: 'Resources', anchor: 'resources' }
    ];
    @observable scrollY = false;

    @action
    setScrollY = () => {
        this.scrollY = !!window.scrollY;
    };
}

@observer
export default class CategoryHeader extends Component {
    componentWillMount() {
        this.vm = new HeaderVM();
    }

    componentDidMount() {
        const vm = this.vm;
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
