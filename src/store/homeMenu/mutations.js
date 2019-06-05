/**
 * Created by jet on 2018/6/29.
 */
import * as types from './types'
const mutations = {
    [types.SET_CLASSIFICATION](state, classification) {
        state.classification = classification;
    },
    [types.SET_STATUS_LIST](state, param) {
        state.statusList = [false, false, false, false];
        state.statusList[param.index] = param.status;
    },
    [types.SET_PAGE](state, page) {
        state.page = page;
    },
    [types.SET_BEHAVOR_STATUS](state, status) {
        state.behavorStatus = status;
    }
}

export default mutations