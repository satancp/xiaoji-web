import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import classNames from 'classnames';
import styles from './Header.css';
import { Image } from './UIKit';
import ScrollAnim from 'rc-scroll-anim';
import QueueAnim from 'rc-queue-anim';

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
                    </div>
                </QueueAnim>
            </div>
        );
    }
}
