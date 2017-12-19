<template>
	<div class="gamebox-container">
		<div class="player-records" v-for="item in box">
			<div class="player" v-if="item.altOrder">
				<span class="order"></span><!--
				 --><span class="name">{{ item.name }}</span><!--
				 --><span class="alt">代</span>
			</div>
			<div class="player" v-else>
				<span class="order">{{ item.order }}</span><!--
				 --><span class="name">{{ item.name }}</span><!--
				 --><span class="alt"></span>
			</div><!--
			 --><template v-for="record in item.content">
				<div class="record" v-if="record === undefined"></div>
				<div class="record" v-else>
					<span class="inn">{{ record.innChange }}</span><!--
					 --><span :class="`content ${record.color} ${record.rbi ? 'rbi' : ''} ${record.r === record.name ? 'run' : ''}`" :data-rbi="record.rbi" :data-run="`${record.r === record.name ? 'R' : ''}`">{{ record.content }}</span>
				</div>
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	.gamebox-container {
		margin-top: 20px;
		text-align: left;
		span {
			display: inline-block;
			text-align: center;
		}
		.player-records {
			height: 36px;
			line-height: 36px;
			color: $row_color;
			&:nth-child(odd) { background-color: $row_even_bgcolor; }
			&:nth-child(even) { background-color: $row_odd_bgcolor; }
		}
		.player {
			display: inline-block;
			.order {
				text-align: right;
				width: 20px;
				padding-right: 10px;
			}
			.name {
				text-align: left;
				width: 100px;
			}
			.alt {
				width: 20px;
			}
		}
		.record {
			width: 80px;
			display: inline-block;
			text-align: left;
			.inn {
				width: 20px;
			}
			.content {
				width: 50px;
				color: #fff;
				line-height: 34px;
				position: relative;
				&.red { background-color: #ef1010; }
				&.yellow { background-color: #efaf34; }
				&.blue { background-color: #4d9de5; }
				&.gray { background-color: #ccc; }
				&.run:before {
					content: attr(data-run);
					display: inline-block;
					width: 10px;
					height: 17px;
					position: absolute;
					top: 0;
					right: -10px;
					line-height: 17px;
					font-size: 10px;
					text-align: center;
					background-color: orange;
				}
				&.rbi:after {
					content: attr(data-rbi);
					display: inline-block;
					width: 10px;
					height: 17px;
					position: absolute;
					bottom: 0;
					right: -10px;
					line-height: 17px;
					font-size: 10px;
					text-align: center;
					background-color: red;
				}
			}
		}
	}
</style>

<script>
	import Vue from 'vue';
	import { mapGetters, mapActions } from 'vuex';

	export default {
		data() {
			return {
			};
		},
		created() {
			this.setGame(this.$route.params.game);
		},
		mounted() {
			Vue.nextTick().then(() => {
				document.querySelector('a[href="#/main/games"]').classList.add('active');
			});
		},
		beforeDestroy() {
			document.querySelector('a[href="#/main/games"]').classList.remove('active');
		},
		methods: {
			...mapActions({
				setGame: 'setGame',
			})
		},
		computed: {
			...mapGetters({
				box: 'box'
			})
		}
	}
</script>