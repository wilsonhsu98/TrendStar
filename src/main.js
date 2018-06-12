import Vue from 'vue';
import store from './store';
import router from './router';
import VueI18n from 'vue-i18n';
import en from './i18n/en-us.json';
import tw from './i18n/zh-tw.json';

import './css/font-awesome.min.css';
import './css/font.css';
import './scss/_base.scss';

Vue.use(VueI18n);
const currentLocale = 'zh-TW';
const messages ={
	'en-US': en,
	'zh-TW': tw,
};
const i18n = new VueI18n({
	locale: currentLocale,
	messages,
});
document.getElementsByTagName('html')[0].setAttribute('lang', currentLocale);

let componentsReq = require.context("./components/", false, /\.vue$/);
componentsReq.keys().forEach(path => {
	Vue.component(path.replace(/(\_|\b|\-)./g, function(a) { return a.toUpperCase(); }).replace(/(\_|\b|\-|\.\/|\.vue)*/ig, ""), componentsReq(path).default);
});

const app = new Vue({
	el: '#app',
	store,
	router,
	i18n,
});

const version = 6;
if (window.localStorage.getItem('version') !== version.toString()) {
	window.localStorage.clear();
	window.localStorage.setItem('version', version.toString());
	window.location.href = "";
}

document.title = 'TrendStar';
let link = document.createElement('link');
link.type = 'image/png';
link.rel = 'shortcut icon';
link.href = require('./images/icon.png');
document.getElementsByTagName('head')[0].appendChild(link);