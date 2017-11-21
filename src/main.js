import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './views/app';
import store from './store';
import './css/font-awesome.min.css';
import './css/font.css';
import './images/icon.png';

Vue.use(VueRouter);

let componentsReq = require.context("./components/", false, /\.vue$/);
componentsReq.keys().forEach(path => {
	Vue.component(path.match(/\.\/(.*?)\.vue/)[1], componentsReq(path).default);
});

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const router = new VueRouter({
	routes: [
		{ path: '/', component: App },
		{ path: '/parse', component: require('./views/parse-game').default },
		{ path: '/foo', component: Foo },
		{ path: '/bar', component: Bar },
		{ path: '*', redirect: '/' }
	]
});

const app = new Vue({
	el: '#app',
	store,
	router
});