import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from 'vuex-persist';
import user from "./user";
import conference from "./conference";
import management from "./management";
Vue.use(Vuex);



export default new Vuex.Store({
  plugins:[new VuexPersistence().plugin],
  modules: {
    user,
    conference,
    management
  },
  strict: process.env.DEV
});
