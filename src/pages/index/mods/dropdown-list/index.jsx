import { createElement, PureComponent, PropTypes, findDOMNode } from 'rax';
import { View, Text, Image, Touchable, Transition, Icon } from 'nuke';
import styles from './index.less';

const noop = () => {};
const translateY = 90;
const MENUS = [
  [{ text: '全部类型', type: '' }],
  [{ text: '自己领取', type: '1' }, { text: '他人赠送', type: '2' }, { text: '抽奖获得', type: '3' }],
  [{ text: '领取时间', type: '1' }, { text: '到期时间', type: '2' }],
];
const iconUrl = '//gw.alicdn.com/tfs/TB1jz3sQXXXXXawXFXXXXXXXXXX-26-14.png';
const iconUrl2 = '//gw.alicdn.com/tfs/TB1883vQXXXXXXwXFXXXXXXXXXX-26-14.png';

class DropdownList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      curr: null,
    };
    this.swithHandle = this.swithHandle.bind(this);
    this.hideHandle = this.hideHandle.bind(this);
    this.showHandle = this.showHandle.bind(this);
    this.selectHandle = this.selectHandle.bind(this);
  }


  show() {
    Transition(this.domNode, {
      transform: 'translateY(0)',
    }, {
      timingFunction: 'linear',
      duration: 200,
      delay: 0,
    });
  }
  hide() {
    Transition(this.domNode, {
      transform: `translateY(-${translateY})`,      // for weex //
    }, {
      timingFunction: 'linear',
      duration: 200,
      delay: 0,
    });
  }
  swithHandle(index) {
    if (this.state.curr !== null && this.state.curr === index) {
      this.hideHandle();
      return;
    }
    this.showHandle(index);
  }

  hideHandle() {
    this.setState({ curr: null });
  }

  showHandle(index) {
    this.setState({ curr: index });
  }

  selectHandle(item) {
    const { curr } = this.state;
    if (curr === 1) {
      if (this.props.spreadType !== item.type) {
        this.props.changeSpreadType(item.type);
        // this.context.scrollTo({ y: 0 });
      }
    } else if (curr === 2) {
      if (this.props.sortOrder !== item.type) {
        this.props.changeSortOrder(item.type);
        // this.context.scrollTo({ y: 0 });
      }
    }
    this.hideHandle();
  }

  render() {
    const { curr } = this.state;
    const { tabList, spreadType, sortOrder } = this.props;
    let newTabList = MENUS;

    if (tabList.length) {
      newTabList = [tabList, MENUS[1], MENUS[2]];
    }
    const tabs = newTabList.map((items, index) => {
      let type = '-99';

      if (index === 1) {
        type = spreadType.toString();
      } else if (index === 2) {
        type = sortOrder.toString();
      }

      return items.map((item) => {
        if (item.type === type.toString()) {
          if (curr !== null && curr === index) {
            return (
              <Touchable style={styles.selectitem} onPress={() => { this.swithHandle(index); }}>
                <Text style={[styles.title, styles.hl]} numberOfLines={1}>{item.text}</Text>
                <Image style={styles.icon} source={{ uri: iconUrl2 }} />
              </Touchable>
            );
          }
          return (
            <Touchable style={styles.selectitem} onPress={() => { this.swithHandle(index); }}>
              <Text style={styles.title} numberOfLines={1}>{item.text}</Text>
              <Image style={styles.icon} source={{ uri: iconUrl }} />
            </Touchable>
          );
        }
        return null;
      });
    });

    let options = null;

    if (curr !== null) {
      let type = '-99';
      const items = newTabList[curr];
      if (curr === 1) {
        type = spreadType;
      } else if (curr === 2) {
        type = sortOrder;
      }
      options = items.map((item, index) => (
        <Touchable style={[styles.optionsitem, index === items.length - 1 ? styles.lastitem : {}]} onPress={() => { this.selectHandle(item); }}>
          {item.type === type.toString() ?
              [<Text style={[styles.type, styles.hl]}>{item.text}</Text>, <Icon name="select" style={[styles.check, styles.hl]} />] :
              <Text style={styles.type}>{item.text}</Text> }
        </Touchable>
        ));
    }

    return (
      <View style={styles.dropdownlist}>
        { options ? <Touchable style={styles.mask} onPress={this.hideHandle} /> : null }
        { options ? <View x="sublist" style={styles.options}><View style={styles.inner}>{options}</View></View> : null }
        <View style={styles.select} ref={(n) => { this.domNode = findDOMNode(n); }}>{tabs}</View>
      </View>
    );
  }
}

DropdownList.propTypes = {
  changeSpreadType: PropTypes.func,
  changeSortOrder: PropTypes.func,
  tabList: PropTypes.array,
  spreadType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  sortOrder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

DropdownList.defaultProps = {
  tabList: [],
  spreadType: 1,
  sortOrder: 1,
  changeSpreadType: noop,
  changeSortOrder: noop,
};
DropdownList.contextTypes = {
  body: PropTypes.object,
  params: PropTypes.object,
  scrollTo: PropTypes.func,
};
export default DropdownList;
