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
            path: '/parse',
            name: 'parse',
            component: require('./views/page_parse').default,
            meta: { requiresAuth: false },
        },
        {
            path: '/main',
            name: 'main',
            component: require('./views/page_main').default,
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'games',
                    name: 'games',
                    component: require('./views/view_games').default,
                    meta: { requiresAuth: true },
                }, {
                    path: 'game/:game',
                    name: 'game',
                    component: require('./views/view_game').default,
                    meta: { requiresAuth: true },
                }, {
                    path: 'stats_pa',
                    name: 'stats_pa',
                    component: require('./views/view_stats_pa').default,
                    meta: { requiresAuth: true },
                }, {
                    path: 'stats_item',
                    name: 'stats_item',
                    component: require('./views/view_stats_item').default,
                    meta: { requiresAuth: true },
                }, {
                    path: 'user',
                    name: 'user',
                    component: require('./views/view_user').default,
                    meta: { requiresAuth: true },
                }
            ],
        },
        {
            path: '*',
            redirect: '/login',
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(route => route.meta.requiresAuth) && store.getters.userId === '' && store.getters.token === '') {
        next({ path: 'login' });
    } else {
        next();
    }
});

export default router;