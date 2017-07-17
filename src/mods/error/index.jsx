import { createElement, PureComponent, PropTypes } from 'rax';

import { View, Text, Image, Button, Link } from 'nuke';


import styles from './index.css';

const imageUrl = '//gw.alicdn.com/tfs/TB14AYHQXXXXXX9apXXXXXXXXXX-440-440.png';
const noop = () => {};
class Error extends PureComponent {
  constructor(props) {
    super(props);
    this.refreshHandle = this.refreshHandle.bind(this);
  }
  refreshHandle() {
    const { onRefresh } = this.props;
    onRefresh && onRefresh();
  }

  render() {
    return (
      <View style={styles.error}>
        <Image style={styles.img} source={{ uri: imageUrl }} />
        <Text style={styles.title}>网络竟然崩溃了</Text>
        <Text style={styles.subtitle}>“别紧张，试试看刷新页面~”</Text>
        <View style={styles.group}>
          <Button style={styles.button} onPress={this.refreshHandle}>
            刷新
          </Button>
          <Link href="//h5.m.taobao.com/feedback/detail.html?seCate=BUG&errCode=0">
            <Button style={[styles.button, styles.buttonright]}>
              报错
            </Button>
          </Link>
        </View>
      </View>
    );
  }
}
Error.propTypes = {
  onRefresh: PropTypes.func,
};

Error.defaultProps = {
  onRefresh: noop,
};
export default Error;
