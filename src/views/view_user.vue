<template>
	<div class="profile-container">
		<button class="logout-btn" @click="fbLogout">
			log out
		</button>
	</div>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	.profile-container {
		margin: 20px 0;
		text-align: center;
	}

	.logout-btn {
		border-radius: 5px;
		background-color: $header_bgcolor;
		color: white;
		border: 1px solid transparent;
		padding: 10px 15px;
		position: relative;
		top: 50%;
		&:focus {
			outline: none;
		}
		&:disabled {
			opacity: .3;
		}
	}
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