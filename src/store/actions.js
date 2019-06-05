/**
 * Created by jet on 2018/6/29.
 */
import * as types from './mutation-types'
export const setUserInfo = function ({commit, state}, userInfo) {
    commit(types.SET_USERINFO, userInfo)
};

export const setShowDialog = ({commit, state}, value) => {
  commit(types.SET_DIALOG, value)
};
