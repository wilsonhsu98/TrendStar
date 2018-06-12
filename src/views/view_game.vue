<template>
	<div>
		<mobile-header></mobile-header>
		<div class="gamebox-container">
			<div class="box-summary" v-if="boxSummary.league && boxSummary.group">
				{{ `${boxSummary.league} ${$t('box_group', { g: boxSummary.group })}` }}
				<template v-if="boxSummary.year && boxSummary.season">
					{{ `(${boxSummary.year} ${boxSummary.season}) ${boxSummary.game}` }}
				</template>
				<div>{{ boxSummary.opponent ? $t('box_opponent', { opponent: boxSummary.opponent }) : $t('box_forgot_opponent') }}</div>
				<div class="result" v-if="boxSummary.result">{{ $t('box_summary', { h: boxSummary.h, r: boxSummary.r, result: $t(`box_${boxSummary.result}`)}) }}</div>
			</div>
			<div class="player-records" v-for="item in box">
				<div class="player">
					<span class="order">{{ item.altOrder ? $t('PH'): item.order }}</span><!--
					 --><span class="name">
							<span class="img" style="border-width: 1px">
								<i class="fa fa-user-o"></i>
							</span>
							<span v-if="item.data.img" class="img" :style="`background-image: url(${item.data.img})`">
							</span>
							{{ item.name }}
						</span><!--
					 --><span class="error">{{ item.error > 0 ? `${item.error}E` : '' }}</span>
				</div><!--
				 --><div class="records">
						<template v-for="record in item.content">
							<div class="record" v-if="record === undefined"></div>
							<div class="record" v-else>
								<span class="inn">{{ record.innChange }}</span><!--
								 --><span :class="`content ${record.color} ${record.rbi ? 'rbi' : ''} ${record.r === record.name ? 'run' : ''}`" :data-rbi="record.rbi" :data-run="`${record.r === record.name ? 'R' : ''}`">{{ $t(record.content) }}</span>
							</div>
						</template>
					</div>
				<span class="summary">{{ item.summary }}</span>
			</div>
		</div>
		<div style="text-align:center; margin: 10px;">
			<button class="share-btn" @click="screenshot">
				<i class="fa fa-facebook-square"></i>
				{{ $t('fb_share') }}
			</button>
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
				width: 160px;
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
						background-size: cover;
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
				.error {
					color: $current_user_bgcolor;
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
	.share-btn {
		border-radius: 5px;
		background-color: #365899;
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
					flex-basis: 128px;
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
							overflow: hidden;
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
	import html2canvas from 'html2canvas';
	import axios from 'axios';

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
				document.querySelector('a[href^="#/main/games"]').classList.add('active');
			});
		},
		beforeDestroy() {
			document.querySelector('a[href^="#/main/games"]').classList.remove('active');
		},
		methods: {
			...mapActions({
				setGame: 'setGame',
				toggleLoading: 'toggleLoading',
			}),
			screenshot() {
				this.toggleLoading(true);
				html2canvas(document.querySelector('.gamebox-container'), {
						useCORS: true,
						logging: false,
					})
					.then(canvas => {
						const formData = new FormData();
						formData.append('image', canvas.toDataURL('image/jpeg', 1.0).split(',')[1]);
						return axios.post('https://api.imgur.com/3/image', formData, {
							headers: {
								Authorization: 'Client-ID af58b85d81d963f'
							}
						});
					})
					.then(res => {
						this.toggleLoading(false);
						FB.ui({
							method: 'share',
							href: res.data.data.link,
							display: 'popup',
						}, response => {});
					})
					.catch(() => {
						this.toggleLoading(false);
					});
			},
		},
		computed: {
			...mapGetters({
				box: 'box',
				boxSummary: 'boxSummary',
				loading: 'loading',
			})
		}
	}
</script>