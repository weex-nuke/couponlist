import { createElement, Component, findDOMNode, render } from 'rax';
import { View, Button, Transition, Modal, Env } from 'nuke';
import { Http } from './util/index';

import Error from './mods/error';
import Loading from './mods/loading';
import GoodCoupon from './mods/good-coupon';

import DropdownList from './mods/dropdown-list';
import styles from './index.less';

const { isWeb } = Env;
const translateX = 68;
const translateY = 96;

// 本地排序 + 筛选
const filter = (list, condition) => {
  if (list && list.length) {
    list = list.filter(item => (
      item.spreadType === condition.spreadType.toString()
    ));
    // 按领取时间排序
    if (condition.sortOrder === 1) {
      list.sort((a, b) => (
        parseInt(b.gmtCreated, 10) - parseInt(a.gmtCreated, 10)
      ));
    // 按到期时间排序
    } else if (condition.sortOrder === 2) {
      list.sort((a, b) => (
        parseInt(b.endTime, 10) - parseInt(a.endTime, 10)
      ));
    }
  }
  return list;
};


class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'loading', // loading/success/error
      spreadType: 1,
      sortOrder: 1,
      goodList: [],
      deleteList: [],
      onDelete: false,
    };
    this.popItem = this.popItem.bind(this);
    this.pushItem = this.pushItem.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.refreshHandle = this.refreshHandle.bind(this);
    this.changeHandle = this.changeHandle.bind(this);
    this.changeSpreadType = this.changeSpreadType.bind(this);
    this.changeSortOrder = this.changeSortOrder.bind(this);
    this.deleteCancelHandle = this.deleteCancelHandle.bind(this);
    this.deleteHandle = this.deleteHandle.bind(this);
    this.body = findDOMNode(document.body);
  }
  getChildContext() {
    return {
      params: {
      },
    };
  }

  componentDidMount() {
    // console.log(this.header.getWrappedInstance());


    this.getGoodList();
    // this.showEditButton();
  }

  componentWillUnmount() {
    this.hideEditButton();
  }

  // 获取有效券
  getGoodList() {
    const { sortOrder, spreadType } = this.state;

    this.setState({ status: 'loading' });

    this.fetchData('couponlist', {
      status: 1,
    }).then((res) => {
      // debugger;
      this.setState({
        goodList: filter(res.data.couponList, { sortOrder, spreadType }),
        status: 'success',
      });
    }, () => {
      this.setState({ status: 'error' });
    });
  }
  getDeleteIds(deleteList) {
    const ids = [];
    for (let i = 0; i < deleteList.length; i += 1) {
      ids.push(deleteList[i].couponId);
    }
    return ids;
  }
  popItem(item) {
    const index = this.state.deleteList.indexOf(`${item.couponId}_1`);
    this.state.deleteList.splice(index, 1);
    this.setState({ deleteList: [...this.state.deleteList, `${item.couponId}_1`] });
  }
  pushItem(item) {
    this.state.deleteList.push(`${item.couponId}_1`);

    this.setState({ deleteList: this.state.deleteList });
  }
  clearItems() {
    this.setState({ deleteList: [] });
  }

  refreshHandle() {
    this.getGoodList();
  }

  changeHandle() {
    this.getGoodList();
  }
  changeSpreadType(type) {
    this.setState({
      spreadType: type,

    });
    this.getGoodList();
  }
  deleteItems(params) {
    return Http.fetch({
      name: 'deletecoupon',
      data: params,
    });
  }
  fetchData(api, params) {
    return Http.fetch({
      name: api,
      data: params,
    });
  }
  changeSortOrder(order) {
    this.setState({
      sortOrder: order,
    });
    this.getGoodList();
  }


  onDeleteAnimate() {
    this.setState({
      onDelete: true,
    });
    this.header.hide();
    Transition(this.contentNode, {
      transform: `translate(0,-${translateY})`,
    }, {
      timingFunction: 'linear',
      duration: 200,
      delay: 0,
    });
  }
  resetAnimate() {
    this.setState({
      onDelete: false,
    });
    this.clearItems();
    this.header.show();
    Transition(this.contentNode, {
      transform: `translate(-${translateX},0)`,
    }, {
      timingFunction: 'linear',
      duration: 50,
      delay: 0,
    });
  }
  deleteCancelHandle() {
    this.resetAnimate();
  }
  deleteHandle(e) {
    if (isWeb) {
      // 此处在 web 端 button 重叠可能会穿透
      e.stopPropagation();
    }
    // debugger;
    if (!this.state.onDelete) {
      return this.onDeleteAnimate();
    }
    const { deleteList } = this.state;


    if (!deleteList.length) {
      Modal.toast('请选择要删除的券');
      return;
    }

    Modal.confirm(`确定要删除这 ${deleteList.length} 张券？`, [{
      onPress: () => {
        this.setState({ deleteLoading: true });
        this.deleteItems({
          couponId: this.getDeleteIds(deleteList),
        }).then(() => {
            // 清除选中的优惠券
          this.clearItems();
          this.setState({ deleteLoading: false });
          Modal.toast('删除成功');
        }, () => {
          this.setState({ deleteLoading: false });
          Modal.toast('删除失败');
        });
        this.resetAnimate();
      },
      text: '确定',
    },
    {
      onPress: () => {
            // 恢复动画到原状
        this.resetAnimate();
      },
      text: '取消',
    },
    ]);
  }

  render() {
    const { status, badLoading = false, deleteLoading = false } = this.state;
    const { goodList, tabList, deleteList = [], spreadType, sortOrder } = this.state;

    let children;

    if (status === 'loading') {
      children = <View style={styles.loading}><Loading type="inline" /></View>;
    } else if (status === 'error') {
      children = <View style={styles.error}><Error onRefresh={this.refreshHandle} /></View>;
    } else {
      children = (
        <View x="content" style={[styles.content, this.state.onDelete ? { paddingBottom: 0 } : {}]} ref={(n) => { this.contentNode = findDOMNode(n); }}>
          <GoodCoupon pushItem={this.pushItem} popItem={this.popItem} data={goodList} deleteList={deleteList} />

        </View>
      );
    }
    let bottomButtons;
    if (this.state.onDelete) {
      bottomButtons = (
        <View style={styles.footer}>
          <Button rect style={[styles['footer-button'], styles.primary]} type={'primary'} onPress={(e) => { this.deleteHandle(e); }}>删除</Button>
          <Button rect style={styles['footer-button']} type="normal" onPress={() => { this.deleteCancelHandle(); }}>取消</Button>
        </View>
      );
    } else {
      bottomButtons = (
        <View style={styles.footer}>
          <Button rect style={styles['footer-button']} type={'normal'} ref={(n) => { this.footerNode = findDOMNode(n); }} onPress={(e) => { this.deleteHandle(e); }}>批量删除</Button>
        </View>
      );
    }
    return (
      <View x="page" style={styles.page}>
        <Loading text="加载中..." visible={badLoading} />
        <Loading text="删除中..." visible={deleteLoading} />
        <View style={styles.placeholder} />
        {children}
        { goodList.length ? bottomButtons : null }

        <DropdownList
          tabList={tabList}
          changeSpreadType={this.changeSpreadType}
          spreadType={spreadType}
          sortOrder={sortOrder}
          changeSortOrder={this.changeSortOrder}
          onChange={this.changeHandle}
          ref={(n) => { this.header = n; }}
        />
      </View>
    );
  }
}
Page.propTypes = {

};

Page.defaultProps = {
};
render(<Page />);
