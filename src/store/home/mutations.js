/**
 * Created by jet on 2018/6/29.
 */
import * as types from './types'
const mutaions = {
    [types.SET_BANNERS](state, banners) {
        state.banners = banners;
    },
    [types.SET_INFOMATION](state, data) {
        state.infomation = data;
    },
}

export default mutaions