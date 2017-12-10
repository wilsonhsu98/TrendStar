import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: require('./views/page_login').default,
            meta: { requiresAuth: false },
        },
        {
            path: '/user',
            name: 'user',
            component: require('./views/view_user').default,
            meta: { requiresAuth: true },
        },
        {
            path: '/stats_pa',
            name: 'stats_pa',
            component: require('./views/view_stats_pa').default,
            meta: { requiresAuth: true },
        },
        {
            path: '/parse',
            name: 'parse',
            component: require('./views/page_parse').default,
            meta: { requiresAuth: true },
        },
        {
            path: '*',
            redirect: '/login',
        }
    ]
});
/*
const router = new VueRouter({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: require('./views/page_login').default,
            meta: { requiresAuth: false },
        }, {
            path: '/login/:next',
            name: 'loginWithNextUrl',
            component: require('./views/page_login').default,
            meta: { requiresAuth: false },
        }, {
            path: '/download/:userId/:arch/:os',
            name: 'download',
            component: require('./views/page_download').default,
            meta: { requiresAuth: false },
        }, {
            path: '/main',
            name: 'main',
            component: require('./views/page_main').default,
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'logs',
                    name: 'logs',
                    component: require('./views/view_logs').default,
                    meta: { requiresAuth: true },
                }, {
                    path: 'about',
                    name: 'about',
                    component: require('./views/view_about').default,
                    meta: { requiresAuth: true },
                }
            ],
        },  {
            path: '*',
            redirect: '/login',
        }
    ]
});
*/
router.beforeEach((to, from, next) => {
    if (to.matched.some(route => route.meta.requiresAuth) && store.getters.userId === '' && store.getters.token === '') {
        next({ path: 'login' });
    } else {
        next();
    }
});

export default router;