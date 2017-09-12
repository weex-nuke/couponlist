import { createElement, PureComponent, PropTypes, findDOMNode } from 'rax';
import { View, Text, Image, Transition } from 'nuke';

import styles from './index.css';

const loadingUrl = '//gw.alicdn.com/tfs/TB1DmRjQpXXXXcJXVXXXXXXXXXX-40-40.png';

class Loading extends PureComponent {

  constructor(props) {
    super(props);
    this.index = 0;
  }

  componentDidMount() {
    setTimeout(() => {
      this.startRotate();
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.flag = false;
      this.startRotate();
    } else {
      this.flag = true;
      this.stopRotate();
    }
  }

  startRotate() {
    this.index += 1;

    const rotate = `rotate(${this.index * 360}deg)`;

    if (!this.flag && this.img) {
      Transition(this.img, {
        transform: rotate,
      }, {
        timingFunction: 'linear',
        duration: 1000,
        delay: 0,
      }, () => {
        this.startRotate();
      });
    }
  }

  stopRotate() {
    this.index = 0;
  }

  render() {
    const { type, text, visible, children } = this.props;
    const child = text || children || '正在加载 ...';

    if (!visible) {
      return null;
    }

    if (type === 'inline') {
      return (
        <View style={styles.inline_loading}>
          <Text style={styles.inline_text}>{ child }</Text>
        </View>
      );
    }

    return (
      <View style={styles.fixed_loading}>
        <View style={styles.inner_loading}>
          <Image style={styles.fixed_img} source={{ uri: loadingUrl }} ref={(n) => { this.img = findDOMNode(n); }} />
          <Text style={styles.fixed_text}>{ child }</Text>
        </View>
      </View>
    );
  }
}
Loading.propTypes = {
  type: PropTypes.oneOf(['inline', 'fixed']),
  visible: PropTypes.any,
  text: PropTypes.string,
  children: PropTypes.any,
};

Loading.defaultProps = {
  type: 'fixed',
  visible: null,
  text: '',
  children: null,
};

export default Loading;
