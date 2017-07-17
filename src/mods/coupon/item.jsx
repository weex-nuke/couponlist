import { createElement, Component, PropTypes } from 'rax';

import { View, Image, Link, Checkbox } from 'nuke';


import ShopItem from './shop-item';

import styles from './item.less';

function getStatusIcon(status) {
  let icon = '';

  // 使用中
  if (status === '102') {
    icon = '//gw.alicdn.com/tfs/TB1jR5tQXXXXXbaXXXXXXXXXXXX-102-90.png?getAvatar=avatar';
  // 已使用
  } else if (status === '201') {
    icon = '//gw.alicdn.com/tfs/TB1dbp9QXXXXXb7XFXXXXXXXXXX-102-90.png?getAvatar=avatar';
  // 已过期
  } else if (status === '202') {
    icon = '//gw.alicdn.com/tfs/TB1BsirQXXXXXcbXXXXXXXXXXXX-102-90.png?getAvatar=avatar';
  }

  return icon;
}

class CouponItem extends Component {

  constructor(props) {
    super(props);
    this.changeHandle = this.changeHandle.bind(this);
  }
  componentWillMount() {

  }

  changeHandle(checked) {
    this.props.onChange(this.props.data, checked);
  }

  // clickHandle = () => {
  //   Modal.toast('使用中的券无法删除');
  // }

  render() {
    let checked;
    let disabled;
    const { deleteList, data } = this.props;
    const children = createElement(ShopItem, this.props);
    if (deleteList.indexOf(`${data.couponId}_1`) === -1) {
      checked = false;
    } else {
      checked = true;
    }
    // 使用中的优惠券不可删除
    if (data.status === '102') {
      disabled = true;
    } else {
      disabled = false;
    }

    const icon = getStatusIcon(data.status);

    const url = `${data.url}`;

    return (
      <View style={styles.item}>
        <View style={styles.checkbox}>
          <Checkbox checkedStyle={styles.checked} checked={checked} disabled={disabled} onChange={this.changeHandle} />
        </View>
        <Link href={url}>{children}</Link>
        { icon ? <Image style={styles.img} source={{ uri: icon }} /> : null }
      </View>
    );
  }
}
CouponItem.propTypes = {
  data: PropTypes.array,
  deleteList: PropTypes.array,
  onChange: PropTypes.func,
};

CouponItem.defaultProps = {
  data: [],
  deleteList: [],
  onChange: () => {},
};
export default CouponItem;
