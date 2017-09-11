import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './views/app';
require('./images/icon.png');
require('./css/font.css');
require('./css/icono.min.css');

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
		{ path: '/parse', component: require('./views/parse-game').default },
		{ path: '/foo', component: Foo },
		{ path: '/bar', component: Bar }
	]
});

const app = new Vue({
	router,
	render: h => h(App)
}).$mount('#app');