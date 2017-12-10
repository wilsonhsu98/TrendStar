import Vue from 'vue';
import store from './store';
import router from './router';

import './css/font-awesome.min.css';
import './css/font.css';
import './scss/_base.scss';

let componentsReq = require.context("./components/", false, /\.vue$/);
componentsReq.keys().forEach(path => {
    Vue.component(path.replace(/(\_|\b|\-)./g, function(a) { return a.toUpperCase(); }).replace(/(\_|\b|\-|\.\/|\.vue)*/ig, ""), componentsReq(path).default);
});

const app = new Vue({
    el: '#app',
    store,
    router,
});

const version = 2;
if (window.localStorage.getItem('version') !== version.toString()) {
	window.localStorage.clear();
	window.localStorage.setItem('version', version.toString())
}

document.title = 'TrendStar';
let link = document.createElement('link');
link.type = 'image/png';
link.rel = 'shortcut icon';
link.href = require('./images/icon.png');
document.getElementsByTagName('head')[0].appendChild(link);