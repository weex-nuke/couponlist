import { createElement, Component, PropTypes } from 'rax';
import { ListView, Cell } from 'nuke';
import CouponItem from './item';
import styles from './index.css';

const noop = () => {};

class Coupon extends Component { // eslint-disable-line
  constructor(props) {
    super(props);
    this.changeHandle = this.changeHandle.bind(this);
  }
  changeHandle(item, checked) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(item, checked);
    }
  }

  render() {
    const { data = [], ...others } = this.props;
    const children = data.map((item, key) => (
      <Cell><CouponItem {...others} index={key} key={`couponItem${item.couponId}`} data={item} onChange={this.changeHandle} /></Cell>
    ));

    return (
      <ListView style={styles.list} _autoWrapCell={false} showScrollbar={false}>{children}</ListView>
    );
  }
}
Coupon.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.array,
};

Coupon.defaultProps = {
  onChange: noop,
  data: [],
};
export default Coupon;
