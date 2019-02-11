<template>
	<div>
		<div class="login-container">
			<button class="signin-btn" @click="fbLogin">
				<i class="fa fa-facebook-square"></i>
				{{ $t('login_btn') }}
			</button>
			<button class="signin-btn" @click="anonymousLogin">
				<i class="fa fa-user-secret"></i>
				{{ $t('login_anonymous_btn') }}
			</button>
		</div>
		<loading v-if="loading" :img="loading.img"></loading>
	</div>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	.login-container {
		text-align: center;
		height: 100vh;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		left: 50%;
		transform: translateX(-50%);
	}
	.signin-btn {
		border-radius: 5px;
		background-color: $header_bgcolor;
		color: white;
		border: 1px solid transparent;
		padding: 10px 15px;
		width: 100%;
		text-align: left;
		&:focus {
			outline: none;
		}
		&:disabled {
			opacity: .3;
		}
		&:last-child {
			margin-top: 10px;
		}
		.fa {
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
				anonymousLogin: 'anonymousLogin',
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