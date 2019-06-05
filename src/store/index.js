import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import mine from './mine'
import home from './home'
import homeMenu from './homeMenu'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    modules: {
      mine,
      home,
      homeMenu
    },
    strict: debug
})
