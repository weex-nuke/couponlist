/*
 * Copyright (c) 2017 alibbaba-inc
 * 数据mock详情见：http://site.alibaba.net/nuke/docs_tools/fie-toolkit-nuke/mock.html
*/

'use strict';
const api = {
  local:{
    'interface.page.init.get': {       //fetch请求
      type:'jsonp',
      value:'../data/local.json'
    },
    'page.demo':{                      //mtop请求
      type:'jsonp',
      value:'../data/mtop.json'
    },
    'interview.get':{                  //千牛网关请求
        type:'jsonp',
        value:'../data/local.json',
        method:'GET'
    }
  },
  product:{
    'interface.page.init.get':{        //fetch请求
      type:'jsonp',
      value:'http://dip.alibaba-inc.com/api/v2/services/schema/mock/56182'
    },
    'page.demo':{                      //mtop请求
      type:'mtop',
      value:'mtop.order.querySoldList'
    },
    'interview.get':{                  //千牛网关请求
        type:'callGWInterface',
        value:'circles.interview.get',
        method:'GET'
    }
  }
}


export default api; 

