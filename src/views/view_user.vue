<template>
	<div class="profile-container">
		<mobile-header></mobile-header>
		<button class="logout-btn" @click="fbLogout">
			{{ $t('logout_btn') }}
		</button>
		<!-- <coordination :values="dots"/> -->
		<br>
		<br>
		<coordination @change="valueCange"/>
		<div style="height: 30px; line-height: 30px;">{{ this.coordination ? `x: ${this.coordination.x} y: ${this.coordination.y} location: ${this.coordination.location}` : '' }}</div>
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

	@media only screen and (max-width: 760px) {
		.profile-container {
			padding: 10px 0 0;
		}
	}
</style>

<script>
	import { mapGetters, mapActions } from 'vuex';

	export default {
		data() {
			return {
				coordination: { x: '', y: '', location: ''},
				// dots: [{x: 50, y: 50, color: 'blue'}, {x: 30, y: 30}]
			};
		},
		created() {
			// this.chkLoginStatus();
		},
		methods: {
			...mapActions({
				// fbLogin: 'fbLogin',
				// chkLoginStatus: 'chkLoginStatus',
				fbLogout: 'fbLogout',
			}),
			valueCange(val) {
				this.coordination = val;
			},
		},
		computed: {
			...mapGetters({
				// loading: 'loading'
			})
		}
	}
</script>