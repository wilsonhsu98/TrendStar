<template>
	<div class="main-container">
		<header>
			<ul class="tab">
				<li>
					<router-link :to="{ name: 'games' }" active-class="active" :data-label="$t('menu_games')">
						<i class="fa fa-table"></i>
					</router-link>
				</li>
				<li>
					<router-link :to="{ name: 'stats_pa' }" active-class="active" :data-label="$t('menu_stats')">
						<i class="fa fa-list-ol"></i>
					</router-link>
				</li>
				<li>
					<router-link :to="{ name: 'stats_item' }" active-class="active" :data-label="$t('menu_stats_item')">
						<i class="fa fa-th-large"></i>
					</router-link>
				</li>
				<li data-label="account">
					<router-link :to="{ name: 'user' }" active-class="active" :data-label="$t('menu_profile')">
						<i class="fa fa-user"></i>
					</router-link>
				</li>
				<li style="margin-left: auto;">
					<a @click="fbLogout">{{ $t('logout_btn') }}</a>
				</li>
			</ul>
		</header>
		<div class="content">
			<router-view></router-view>
		</div>
		<loading v-if="loading" :text="loading.text"></loading>
	</div>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	$header_menu_height: 70px;
	$footer_menu_height: 50px;

	.main-container {
		padding-top: $header_menu_height;
		padding-bottom: 20px;
	}
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 2;
		background-color: $header_bgcolor;
		height: $header_menu_height;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,.13), 0 0 2px 0 rgba(0,0,0,.2);
		.tab {
			display: flex;
			box-sizing: border-box;
			list-style-type: none;
			padding: 0;
			margin: 0 auto;
			width: 980px;
			padding-left: 100px;
			background: url(../images/icon.png) no-repeat;
			background-size: contain;
			height: 100%;
			line-height: 70px;
			> li {
				display: inline-block;
				&[data-label=account] {
					display: none;
				}
			}
		}
		a {
			color: $header_color;
			text-decoration: none;
			padding: 8px 15px;
			margin: 0 2px;
			border-radius: 98px;
			cursor: pointer;
			&.active {
				background-color: $row_odd_bgcolor;
				color: $row_color;
			}
			&:after {
				content: attr(data-label);
			}
			.fa { display: none; }
		}
	}
	.content {
		width: 980px;
		margin: 0 auto;
	}
	@media only screen and (max-width: 990px) {
		header .tab,
		.content {
			width: calc(100% - 40px);
			margin-left: 20px;
			margin-right: 20px;
		}
	}
	@media only screen and (max-width: 760px) {
		.main-container {
			padding-top: 0;
			padding-bottom: $footer_menu_height;
		}
		header {
			height: $footer_menu_height;
			line-height: $footer_menu_height;
			bottom: 0;
			top: initial;
			.tab {
				justify-content:space-around;
				align-items: start;
				font-size: 25px;
				padding: 0;
				background: none;
				margin: 0;
				width: 100%;
				> li {
					&[data-label=account] {
						display: inline-block;
					}
					&:last-child {
						display: none;
					}
				}
				a {
					display: inline-block;
					text-align: center;
					padding: 0;
					color: $header_color;
					.fa {
						display: block;
						width: 40px;
						height: 30px;
						line-height: 30px;
						margin: 0 auto;
					}
					&:after {
						content: attr(data-label);
						display: block;
						line-height: 15px;
						font-size: 15px;
					}
				}
				.active {
					background: none;
					margin-top: -15px;
					.fa {
						background-color: $active_bgcolor;
						border-radius: 50%;
						width: 40px;
						height: 40px;
						line-height: 44px;
						margin-bottom: 3px;
						color: $current_user_color;
						opacity: .9;
					}
				}
			}
		}
		.content {
			width: 100%;
			margin: 0;
			padding-top: 50px;
		}
	}
</style>

<script>
	import { mapGetters, mapActions } from 'vuex';

	export default {
		created() {
			this.initFromLS();
			this.fetchTable();
		},
		methods: {
			...mapActions({
				initFromLS: 'initFromLS',
				fetchTable: 'fetchTable',
				fbLogout: 'fbLogout',
			})
		},
		computed: {
			...mapGetters({
				loading: 'loading',
			})
		},
		watch: {
			$route() {
				window.scrollTo(0, 0);
			}
		}
	}
</script>