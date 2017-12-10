<template>
	<div>
		<button @click="fbLogout">
			fb log out
		</button>
	</div>
</template>

<style lang="scss" scoped>

</style>

<script>
	import { mapGetters, mapActions } from 'vuex';

	export default {
		created() {
			// this.chkLoginStatus();
		},
		methods: {
			...mapActions({
				// fbLogin: 'fbLogin',
				// chkLoginStatus: 'chkLoginStatus',
				fbLogout: 'fbLogout',
			})
		},
		computed: {
			...mapGetters({
				// loading: 'loading'
			})
		}
	}
</script>