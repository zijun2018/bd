/**
 * Created by jet on 2018/6/29.
 */
import * as types from './mutation-types'
import { Indicator } from 'mint-ui';
const mutaions = {
    [types.SET_USERINFO](state, userInfo) {
        for(var i in userInfo){
            state.userInfo[i] = userInfo[i]
        }
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    [types.SET_LOADING](state, type) {
        try {
            if (type === 'open') {
                Indicator.open({
                    spinnerType: 'triple-bounce'
                });
            } else {
                Indicator.close();
            }
        } catch(err) {
            console.log(err);
        }
    },
  // 显示/隐藏全局dialog组件
  [types.SET_DIALOG](state, value) {
    state.isShowDialog = value;
  },
}

export default mutaions
