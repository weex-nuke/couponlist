'use strict';
import { createElement, Component, render } from 'rax';
import { View, Text, Modal, Link, Env } from 'nuke';
import Label from '$components/label/';
import G from '$util/global';
import {Http} from '$util/index';
const { appInfo } = Env;

class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    欢迎使用fie-toolkit-nuke!
                </Text>
                <Text style={styles.instructions}>
                    编辑src目录下的文件，开始nuke之旅吧
                </Text>
                <Label>点我试试</Label>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        width: 750,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    link: {
        color: '#EB7E10'
    }
};

render(<Demo />);
