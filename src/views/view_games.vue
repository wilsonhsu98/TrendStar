<template>
	<div class="gamelist-container">
		<mobile-header></mobile-header>
		<template v-for="item in gameList">
			<div class="row" :data-date="item.date">
				<template v-for="sub in item.games">
					<div class="item" v-if="sub.hasOrder">
						<router-link :to="{ path: `game/${sub.game}` }" :class="`result ${sub.result} ${sub.group}`" >
							{{ (sub.result && sub.result.substr(0, 1)) || '?' }}
						</router-link>
						<div class="name">{{ sub.opponent || sub.game }}</div>
					</div>
					<div class="item" v-else>
						<div :class="`result ${sub.result} ${sub.group} ${sub.hasOrder ? '' : 'no-order'}`">
							{{ (sub.result && sub.result.substr(0, 1)) || '?' }}
						</div>
						<div class="name">{{ sub.opponent || sub.game }}</div>
					</div>
				</template>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	.gamelist-container {
		background-color: #fff;
		border-radius: 10px;
		margin: 20px 0;
		padding: 20px;
		.row {
			padding-bottom: 20px;
			display: flex;
			position: relative;
			.item {
				color: $row_color;
				text-align: center;
				flex: 1;
				.result {
					border-radius: 50%;
					display: inline-block;
					width: 60px;
					height: 60px;
					line-height: 50px;
					text-transform: uppercase;
					font-size: 40px;
					font-weight: bold;
					text-decoration: none;
					color: #CCC;
					box-sizing: border-box;
					border: 5px solid;
					box-shadow:
						0 2px 2px 0 rgba(0, 0, 0, 0.14),
						0 3px 1px -2px rgba(0, 0, 0, 0.2),
						0 1px 5px 0 rgba(0, 0, 0, 0.12);
					&.win, &.tie, &.lose {
						color: #FFF;
					}
					&.win { background-color: #ef1010; }
					&.tie { background-color: #efaf34; }
					&.lose { background-color: #4d9de5; }
					&.C { border-color: $header_bgcolor; }
					&.G { border-color: $row_odd_bgcolor; }
					&.no-order {
						opacity: .5;
						cursor: not-allowed;
					}
				}
			}
			&:after {
				content: attr(data-date);
				display: inline-block;
				text-decoration: underline;
				color: #ccc;
				position: absolute;
				left: 50%;
				bottom: 5px;
				transform: translateX(-50%);
			}
		}
	}
	@media only screen and (max-width: 760px) {
		.gamelist-container {
			border-radius: 0;
			margin: 0;
			padding: 10px 0 0;
			background-color: transparent;
			.row {
				&:after {
					color: #fff;
				}
				.item .result {
					color: #fff;
				}
			}
		}
	}
</style>

<script>
	import { mapGetters, mapActions } from 'vuex';

	export default {
		data() {
			return {
			};
		},
		created() {
		},
		methods: {
			...mapActions({
			})
		},
		computed: {
			...mapGetters({
				gameList: 'gameList'
			})
		}
	}
</script>