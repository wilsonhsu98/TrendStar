<template>
	<div class="gamelist-container">
		<template v-for="item in gameList">
			<div class="row" :data-date="item.date">
				<router-link :key="sub.game" class="item" :to="{ path: `game/${sub.game}` }" v-for="sub in item.games">
					<div :class="`result ${sub.result} ${sub.group}`">{{ (sub.result && sub.result.substr(0, 1)) || '?' }}</div>
					<div class="name">{{ sub.opponent || sub.game }}</div>
				</router-link>
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
				text-decoration: none;
				text-align: center;
				flex: 1;
				.result {
					border-radius: 50%;
					display: inline-block;
					width: 50px;
					height: 50px;
					line-height: 50px;
					text-transform: uppercase;
					font-size: 40px;
					font-weight: bold;
					color: #CCC;
					box-sizing: border-color;
					border: 5px solid;
					&.win, &.tie, &.lose {
						color: #FFF;
					}
					&.win { background-color: #ef1010; }
					&.tie { background-color: #efaf34; }
					&.lose { background-color: #4d9de5; }
					&.C { border-color: $header_bgcolor; }
					&.G { border-color: $row_odd_bgcolor; }
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
			padding: 0;
			background-color: transparent;
			.row {
				&:first-child {
					padding-top: 10px;
				}
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