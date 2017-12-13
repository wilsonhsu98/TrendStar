<template>
	<div class="login-container">
		<button class="signin-btn" @click="fbLogin">
			<i class="fa fa-facebook-square"></i>
			Sign in with your Facebook account
		</button>
		<loading v-if="loading" :img="loading.img"></loading>
	</div>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	.login-container {
		text-align: center;
		height: 100vh;
	}
	.signin-btn {
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
		.fa-facebook-square {
			font-size: 2em;
			vertical-align: middle;
			margin-right: 4px;
		}
	}
</style>

<script>
	import { mapGetters, mapActions } from 'vuex';

	export default {
		created() {
			this.chkLoginStatus();
		},
		methods: {
			...mapActions({
				fbLogin: 'fbLogin',
				chkLoginStatus: 'chkLoginStatus',
			})
		},
		computed: {
			...mapGetters({
				loading: 'loading'
			})
		}
	}
</script>