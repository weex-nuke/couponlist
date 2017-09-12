/**
 * 网店优惠券（bizType = 1）
 */

import { createElement, PureComponent, PropTypes } from 'rax';
import { View, Text, Image } from 'nuke';

import styles from './shop-item.css';

const defaultShopLogo = '//gw.alicdn.com/tps/TB1dwdPOVXXXXamaXXXXXXXXXXX-192-192.png';

class ShopItem extends PureComponent {

  render() {
    const { data, isExpired } = this.props;
    // transform-jsx-style不支持变量style
    const children = [
      <View style={styles.price}>
        <Text style={styles.unit}>{data.currencyUnit}</Text>
        <Text style={styles.amount}>{data.amount}</Text>
      </View>,
    ];

    if (data.useCondition) {
      children.push(<Text style={styles.condition}>{data.useCondition}</Text>);
    }

    if (data.limitedPrompt) {
      children.push(<Text style={styles.condition} numberOfLines={1}>{data.limitedPrompt}</Text>);
    }

    return (
      <View style={styles.item}>
        <View style={styles.left}>
          <Image style={styles.img} source={{ uri: data.shopLogo || defaultShopLogo }} />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{data.title}</Text>
            <Text style={styles.time} numberOfLines={1}>{data.endDay}</Text>
          </View>
        </View>
        { isExpired ? <View style={[styles.right, styles.expired]}>{children}</View> :
        <View style={styles.right}>{children}</View>}
        <View style={styles.cornerup} />
        <View style={styles.cornerdown} />
      </View>
    );
  }
}
ShopItem.propTypes = {
  data: PropTypes.array,
  isExpired: PropTypes.boolean,
};

ShopItem.defaultProps = {
  data: [],
  isExpired: false,
};
export default ShopItem;
