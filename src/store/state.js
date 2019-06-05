/**
 * Created by jet on 2018/6/29.
 */
const state = {
    userInfo: window.localStorage.getItem('userInfo')? JSON.parse(window.localStorage.getItem('userInfo')): {},

    isShowDialog: false
};

export default state
