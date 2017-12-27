<template>
	<div>
		<mobile-header></mobile-header>
		<div class="gamebox-container">
			<div class="box-summary" v-if="boxSummary.league && boxSummary.group">
				{{ `${boxSummary.league} ${boxSummary.group}組` }}
				<template v-if="boxSummary.year && boxSummary.season">
					{{ `(${boxSummary.year} ${boxSummary.season}) ${boxSummary.game}` }}
				</template>
				<div>{{ boxSummary.opponent ? 　`V.S. ${boxSummary.opponent}` : '對手不記得了' }}</div>
				<div class="result" v-if="boxSummary.result">{{ $t('box_summary', { h: boxSummary.h, r: boxSummary.r, result: $t(`box_${boxSummary.result}`)}) }}</div>
			</div>
			<div class="player-records" v-for="item in box">
				<div class="player">
					<span class="order">{{ item.altOrder ? '代': item.order }}</span><!--
					 --><span class="name">
							<span class="img" :style="item.data.img ? `background-image: url(${item.data.img})` : 'border-width: 1px'">
								<i v-if="!item.data.img" class="fa fa-user-o"></i>
							</span>
							{{ item.name }}
						</span><!--
					 --><span class="alt"></span>
				</div><!--
				 --><div class="records">
						<template v-for="record in item.content">
							<div class="record" v-if="record === undefined"></div>
							<div class="record" v-else>
								<span class="inn">{{ record.innChange }}</span><!--
								 --><span :class="`content ${record.color} ${record.rbi ? 'rbi' : ''} ${record.r === record.name ? 'run' : ''}`" :data-rbi="record.rbi" :data-run="`${record.r === record.name ? 'R' : ''}`">{{ record.content }}</span>
							</div>
						</template>
					</div>
				<span class="summary">{{ item.summary }}</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	.gamebox-container {
		text-align: left;
		.box-summary {
			background-color: #fff;
			border-radius: 10px;
			margin: 20px 0;
			padding: 20px;
			position: relative;
			.result {
				position: absolute;
				top: 20px;
				right: 20px;
				font-size: 30px;
			}
		}
		span {
			display: inline-block;
			text-align: center;
		}
		.player-records {
			height: 36px;
			line-height: 36px;
			color: $row_color;
			display: flex;
			&:nth-child(odd) { background-color: $row_even_bgcolor; }
			&:nth-child(even) { background-color: $row_odd_bgcolor; }
			.player {
				display: inline-block;
				.order {
					text-align: right;
					width: 30px;
					padding-right: 10px;
				}
				.name {
					text-align: left;
					padding-left: 36px;
					line-height: 36px;
					box-sizing: border-box;
					position: relative;
					width: 100px;
					.img {
						display: inline-block;
						width: 32px;
						height: 32px;
						border: 0 solid $row_color;
						box-sizing: border-box;
						border-radius: 50%;
						background: 50% 50% no-repeat;
						background-size: 32px auto;
						position: absolute;
						top: 2px;
						left: 0;
						text-align: center;
						line-height: 26px;
						.fa-user-o {
							font-size: 20px;
							vertical-align: middle;
						}
					}
				}
			}
			.records {
				flex: 1;
				.record {
					width: 80px;
					display: inline-block;
					text-align: left;
					.inn {
						width: 20px;
					}
					.content {
						width: 60px;
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
							left: 0;
							line-height: 17px;
							font-size: 10px;
							text-align: center;
							background-color: #3f00ff;
						}
						&.rbi:after {
							content: attr(data-rbi);
							display: inline-block;
							width: 10px;
							height: 17px;
							position: absolute;
							bottom: 0;
							right: 0;
							line-height: 17px;
							font-size: 10px;
							text-align: center;
							background-color: #2497a2;
						}
					}
				}
			}
			.summary {
				padding-right: 20px;
			}
		}

	}
	@media only screen and (max-width: 760px) {
		.gamebox-container {
			margin-top: 50px;
			font-size: 14px;
			.box-summary {
				background-color: transparent;
				border-radius: 0;
				margin: 0;
				padding: 10px 0;
				text-align: center;
				color: $row_color;
				font-size: 14px;
				.result {
					position: initial;
					font-size: 14px;
				}
			}
			.player-records {
				.player {
					flex-basis: 114px;
					.order {
						width: 20px;
						padding-right: 4px;
					}
					.name {
						width: 90px;
					}
				}
				.records {
					display: flex;
					.record {
						width: auto;
						flex: 1;
						display: flex;
						.inn {
							width: 10px;
						}
						.content {
							width: auto;
							font-size: 10px;
							flex: 1;
							max-width: 60px;
							height: 34px;
							align-self: center;
							&.run:before,
							&.rbi:after {
								height: 10px;
								line-height: 10px;
								font-size: 8px;
							}
						}
					}
				}
				.summary {
					flex-basis: 26px;
					padding: 0 5px;
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
				box: 'box',
				boxSummary: 'boxSummary',
			})
		}
	}
</script>