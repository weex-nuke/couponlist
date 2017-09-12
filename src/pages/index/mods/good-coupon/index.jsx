import { createElement, Component, PropTypes } from 'rax';
import Coupon from '../coupon/index';
import Empty from '../empty/index';

const noop = () => {};
class GoodCoupon extends Component {

  constructor(props) {
    super(props);
    this.changeHandle = this.changeHandle.bind(this);
  }
  changeHandle(item, checked) {
    if (!checked) {
      this.props.popItem(item);
    } else {
      this.props.pushItem(item);
    }
  }
  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }

    if (!data.length) {
      return <Empty />;
    }

    return <Coupon {...this.props} onChange={this.changeHandle} />;
  }
}
GoodCoupon.propTypes = {
  data: PropTypes.array,
  popItem: PropTypes.func,
  pushItem: PropTypes.func,
};

GoodCoupon.defaultProps = {
  popItem: noop,
  pushItem: noop,
  data: [],
};
export default GoodCoupon;
