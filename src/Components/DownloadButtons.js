import React, {Component} from 'react'
import styles from './DownloadButtons.css'
import classNames from 'classnames'
import {Image} from './UIKit'
import {observer} from 'mobx-react'
import {observable, action} from 'mobx'

export const AppStoreURL = 'https://itunes.apple.com/app/id1286604314'
export const AndroidAppURL = 'http://android.myapp.com/myapp/detail.htm?apkName=com.xiangx.mall'

class DownloadButtonsVM {
    @observable showIOSQRCode = false
    @observable showAndroidQRCode = false

    @action
    showIPhoneQRCode = () => {
        this.showIOSQRCode = true
    }

    @action
    hideIPhoneQRCode = () => {
        this.showIOSQRCode = false
    }

    @action
    showAndroidButton = () => {
        this.showAndroidQRCode = true
    }

    @action
    hideAndroidQRCode = () => {
        this.showAndroidQRCode = false
    }

    openWindow(url) {
        window.open(url, '_blank')
    }
}

@observer
export class DownloadButtons extends Component {
    componentWillMount() {
        this.vm = new DownloadButtonsVM()
    }

    render() {
        const vm = this.vm
        const className = classNames(styles.downloadWrapper, this.props.className)
        return (
            <div className={className}>
                {vm.showIOSQRCode && <img src={Image.AppleQRCode} alt="CodeImage" className={styles.iPhoneQRCode} />}
                <img
                    onClick={() => vm.openWindow(AppStoreURL)}
                    src={Image.AppStoreBanner}
                    alt="AppStoreBanner"
                    onMouseEnter={vm.showIPhoneQRCode}
                    onMouseLeave={vm.hideIPhoneQRCode}
                />
                {vm.showAndroidQRCode && (
                    <img src={Image.AndroidQRCode} alt="CodeImage" className={styles.androidQRCode} />
                )}
                <img
                    src={Image.GooglePlayBanner}
                    alt="GooglePlayBanner"
                    onClick={() => vm.openWindow(AndroidAppURL)}
                    onMouseEnter={vm.showAndroidButton}
                    onMouseLeave={vm.hideAndroidQRCode}
                />
            </div>
        )
    }
}
