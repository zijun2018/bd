/**
 * Created by jet on 2018/6/29.
 */
import * as types from './types'
const mutaions = {
    [types.SET_CACHECODEURL](state, params = {path: '', url: ''}) {
        state.cacheCodeUrl = params.path;
        state.cacheWholeCodeUrl = params.url;
    },
}

export default mutaions