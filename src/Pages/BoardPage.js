import React, {Component} from 'react'
import ContentScreen from '~/Screens/Board/ContentScreen'
import VirtualHomeScreen from '~/Screens/Board/VirtualHomeScreen'
import SimpleHeader from '~/Components/SimpleHeader'
import Particle from '~/Components/Particle'
import {Footer} from '../Components/Footer'

export default class CategorySearchPage extends Component {
    constructor(props) {
        super(props)
        this.board_id = props.match.params.board_id
    }

    render() {
        return (
            <div>
                <SimpleHeader />
                <Particle />
                <VirtualHomeScreen />
                <ContentScreen board_id={this.board_id} />
                <Footer />
            </div>
        )
    }
}
