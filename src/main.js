import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './views/app';
// require('./images/72029090.png');

Vue.use(VueRouter);

let componentsReq = require.context("./components/", false, /\.vue$/);
componentsReq.keys().forEach(path => {
    Vue.component(path.match(/\.\/(.*?)\.vue/)[1], componentsReq(path).default);
});

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const router = new VueRouter({
    routes: [
        { path: '*', redirect: '/' },
        { path: '/', component: App },
        { path: '/foo', component: Foo },
        { path: '/bar', component: Bar },
        { path: '/parse', component: require('./views/parse-game').default }
    ]
})

// const router = new VueRouter({
//   routers: [
//     { path: '/', component: App }
//   ]
// });

// router.map({
//   "/": {
//     component: App
//   }
// })
const app = new Vue({
    router
}).$mount('#app');