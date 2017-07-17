import { createElement, PureComponent } from 'rax';
import { View, Text, Image } from 'nuke';


import styles from './index.css';

const imageUrl = '//gw.alicdn.com/tfs/TB1lifzQXXXXXXcaFXXXXXXXXXX-440-440.png';

export default class EmptyCoupon extends PureComponent { // eslint-disable-line
  render() {
    return (
      <View style={styles.empty}>
        <Image style={styles.img} source={{ uri: imageUrl }} />
        <Text style={styles.title}>竟然一张券都没有</Text>
        <Text style={styles.subtitle}>“你有没有考虑过券的感受～”</Text>
      </View>
    );
  }
}

