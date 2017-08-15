import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './views/app.vue';

Vue.use(VueRouter);

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const router = new VueRouter({
  routes: [
    { path: '*', redirect: '/' },
    { path: '/', component: App },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
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
}).$mount('#app')
// new Vue({
//   el: '#app',
//   components: { App }
// });