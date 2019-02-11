import axios from 'axios';
import { db, auth, provider } from "../firebase";
import router from '../router';

const types = {
    LOADING: 'LOADING',
    SET_TOKEN: 'SET_TOKEN',
    CLEAN_TOKEN: 'CLEAN_TOKEN',
    SET_USERID: 'SET_USERID',
    SET_USERNAME: 'SET_USERNAME',
};

const state = {
    loading: false,
    token: '',
    userId: '',
    userName: '',
};

const getters = {
    loading: state => state.loading,
    token: state => state.token || window.localStorage.getItem('token') || '',
    userId: state => state.userId || window.localStorage.getItem('user') || '',
    userName: state => state.userName || window.localStorage.getItem('userName') || '',
};

const actions = {
    toggleLoading({ commit }, isLoading) {
        commit(types.LOADING, isLoading);
    },
    fbLogin({ commit }) {
        auth.signInWithRedirect(provider);
    },
    anonymousLogin({ commit }) {
        commit(types.LOADING, { img: true });
        auth.signInAnonymously();
        auth.onAuthStateChanged(user => {
            if (user) {
                commit(types.SET_TOKEN, user.refreshToken);
                commit(types.SET_USERNAME, user.uid);
                // go to main page
                router.push('/main/stats_pa');
                commit(types.LOADING, false);
            }
        });
    },
    chkLoginStatus({ commit }) {
        commit(types.LOADING, { img: true });
        auth.getRedirectResult()
            .then(result => {
                const user = auth.currentUser;
                if (user) {
                    const refPlayers = db.collection("players");
                    commit(types.SET_USERID, user.uid);
                    if (result.credential && result.credential.accessToken) {
                        commit(types.SET_TOKEN, result.credential.accessToken);
                    }
                    if (result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
                        // new user registration & binding account
                        const fbGraphQL = `https://graph.facebook.com/v2.11/me?access_token=${state.token}&fields=name&locale=zh_TW`;
                        axios.get(fbGraphQL).then(res => refPlayers.where("fb", "==", res.data.name).get())
                            .then(snapshot => {
                                if (snapshot.size) {
                                    commit(types.SET_USERNAME, snapshot.docs[0].id);
                                    return refPlayers.doc(snapshot.docs[0].id).set({
                                        img: `https://graph.facebook.com/${result.additionalUserInfo.profile.id}/picture?type=large`,
                                        userId: user.uid,
                                    }, { merge: true });
                                } else {
                                    return;
                                }
                            })
                            .then(() => {
                                router.push('/main/stats_pa');
                                commit(types.LOADING, false);
                            });
                    } else if (result.additionalUserInfo && !result.additionalUserInfo.isNewUser) {
                        // result.additionalUserInfo.profile.picture.data.url
                        refPlayers.where("userId", "==", user.uid).get()
                            .then(snapshot => {
                                if (snapshot.size) {
                                    commit(types.SET_USERNAME, snapshot.docs[0].id);
                                }
                                return refPlayers.doc(snapshot.docs[0].id).set({
                                    img: `https://graph.facebook.com/${result.additionalUserInfo.profile.id}/picture?type=large`,
                                }, { merge: true });
                            })
                            .then(() => {
                                // go to main page
                                router.push('/main/stats_pa');
                                commit(types.LOADING, false);
                            });
                    } else {
                        refPlayers.where("userId", "==", user.uid).get()
                            .then(snapshot => {
                                if (snapshot.size) {
                                    commit(types.SET_USERNAME, snapshot.docs[0].id);
                                }
                            })
                            .then(() => {
                                // go to main page
                                router.push('/main/stats_pa');
                                commit(types.LOADING, false);
                            });
                    }
                } else {
                    // // wait for signin
                    // commit(types.CLEAN_TOKEN);
                    commit(types.LOADING, false);
                }
            })
            .catch(error => {
                console.log('getRedirectResult error')
                console.log(error);
                commit(types.CLEAN_TOKEN);
                commit(types.LOADING, false);
            });
    },
    fbLogout({ commit }) {
        auth.signOut()
            .then(() => {
                console.log('logout');
                commit(types.CLEAN_TOKEN);
            })
            .catch(error => {
                console.log('logout error');
                console.log(error);
            });
    },
};

const mutations = {
    [types.LOADING](state, isLoading) {
        state.loading = isLoading;
    },
    [types.SET_TOKEN](state, token) {
        window.localStorage.setItem('token', token);
        state.token = token;
    },
    [types.SET_USERID](state, userId) {
        window.localStorage.setItem('user', userId);
        state.userId = userId;
    },
    [types.SET_USERNAME](state, userName) {
        window.localStorage.setItem('userName', userName);
        state.userName = userName;
    },
    [types.CLEAN_TOKEN](state) {
        const version = window.localStorage.getItem('version');
        window.localStorage.clear();
        state.token = '';
        state.userId = '';
        router.push('/login');
        window.localStorage.setItem('version', version);
    },
};

export {
    types,
    state,
    getters,
    actions,
    mutations,
};