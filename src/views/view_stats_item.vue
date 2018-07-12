<template>
	<div>
		<div class="search-bar" ref="searchBar">
			<div class="search-bar__container"><i class="fa fa-search"></i></div>
			<input type="checkbox" class="toggle-search" v-model="toggleSearch"/>
			<div class="condition">
				<div class="condition__label">{{ $t('col_period') }}</div>
				<div class="condition__element">
					<div class="selectdiv">
						<select class="dropdown" :value="periodSelect" @change="setPeriod_($event.target.value)">
							<option v-for="item in period" :value="item.period">{{ `${item.period === 'period_all' ? $t(item.period) : item.period}` }}</option>
						</select>
					</div>
				</div>
				<template v-if="lastUpdate">
					<br>
					<div class="condition__label date">{{ $t('col_update') }}</div>
					<div class="condition__element date" :data-long="`${$t('col_update')} `" :data-short="`${$t('col_update_short')} `">{{ new Date(lastUpdate).toLocaleString() }}</div>
				</template>
			</div>
		</div>
		<div class="item-container">
			<div class="item-container__table" v-for="key in ['AVG', 'H', 'HR', 'RBI']">
				<div class="header"><span @click="goStats(key)">{{ $t(key) }}</span></div>
				<template v-for="(item, index) in itemStats[key].slice(0, 5)">
					<div v-if="index === 0" class="row">
						<span class="rank">{{ index + 1 }}</span>
						<img class="img" :src="item.data.img" onLoad="this.className='img'" onError="this.className='img-hidden'"/>
						<span class="name">{{ item.name }}</span>
						<span class="dummy"></span>
						<span class="value">{{ item[key] }}</span>
					</div>
					<div v-else class="row">
						<span class="rank">{{ index + 1 }}</span>
						<span class="name">{{ item.name }}</span>
						<span class="value">{{ item[key] }}</span>
					</div>
				</template>
				<div class="note">{{ $t(`${key}_note`, { g: periodGames.length,pa: parseInt(periodGames.length * 1.6, 10) }) }}</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	.condition {
		background-color: #fff;
		border-radius: 10px;
		margin: 20px 0;
		padding: 20px;
		> div, label {
			display: inline-block;
			line-height: 30px;
			height: 30px;
			vertical-align: middle;
		}
		label {
			cursor: pointer;
		}
		&__label {
			padding: 0 4px;
			text-align: left;
			&.col {
				vertical-align: top;
			}
		}
		&__element {
			&.col {
				width: calc(100% - 90px);
				height: auto;
			}
		}
		&__col {
			margin-right: 10px;
			vertical-align: middle;
		}
	}

	.dropdown {
		height: 30px;
		width: 110px;
		border: 2px solid rgb(166, 166, 166);
		background-color: rgb(248, 248, 248);
		border-radius: 5px;
		vertical-align: top;
	}
	i.fa {
		font-size: 28px;
		vertical-align: middle;
		cursor: pointer;
	}
	.search-bar__container,
	.toggle-search {
		display: none;
	}

	.item-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: auto;
		grid-column-gap: 20px;
		grid-row-gap: 20px;
		.item-container__table {
			background-color: #fff;
			display: flex;
			flex-direction: column;
			.header {
				background: $header_bgcolor;
				color: $header_color;
				line-height: 36px;
				text-align: right;
				padding-right: 10px;
				span {
					cursor: pointer;
					&:hover {
						text-decoration: underline;
					}
				}
			}
			.row {
				color: $row_color;
				line-height: 36px;
				height: 36px;
				display: flex;
				&:nth-child(even) { background-color: $row_even_bgcolor; }
				&:nth-child(odd) { background-color: $row_odd_bgcolor; }
				.rank {
					width: 20px;
					text-align: left;
					padding-left: 10px;
				}
				.name, .dummy { flex: 1; }
				.value {
					width: 50px;
					text-align: right;
					padding-right: 10px;
				}
			}
			.img {
				width: 60px;
				height: 60px;
				border-radius: 50%;
				position: relative;
				top: -30px;
				left: -7px;
				~ .name {
					display: none;
				}
			}
			.img-hidden {
				display: none;
				~ .dummy {
					display: none;
				}
			}
			.note {
				border-top: 2px dotted $row_color;
				padding: 10px;
				background-color: $row_even_bgcolor;
				margin-top: auto;
				// display: flex;
				// align-items: center;
				font-size: 10px;
			}
		}
	}
	@media only screen and (max-width: 760px) {
		.search-bar {
			background: $header_bgcolor url(../images/icon.png) center 2px no-repeat;
			background-size: 55px auto;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 1;
			overflow: hidden;
			color: $header_color;
			text-align: center;
			&__container {
				display: block;
				height: 50px;
				line-height: 50px;
				text-align: right;
				padding-right: 14px;
			}
			.toggle-search {
				display: block;
				position: absolute;
				top: 0;
				right: 0;
				z-index: 1;
				height: 50px;
				width: 50px;
				margin: 0;
				opacity: 0;
				&:checked {
					&~.condition {
						max-height: 200vh;
						transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
						transition-delay: 0s;
						.fa {
							opacity: 1;
							transition-delay: .4s;
						}
					}
				}
			}
			.condition {
				background-color: transparent;
				border-radius: 0;
				margin: 0;
				max-height: 0;
				transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
				display: grid;
				grid-template-rows: auto;
				grid-column-gap: 3px;
				grid-row-gap: 6px;
				align-items: center;
				justify-items: start;
				padding: 0 3px;
				box-sizing: border-box;
				position: relative;
				> br {
					display: none;
				}
				&__col {
					margin: 0;
				}
				.fa {
					opacity: 0;
					transition: opacity .1s 0s;
					display: inline-block;
					color: $header_color;
				}
				.fa-refresh {
					position: absolute;
					bottom: 10px;
					left: 12px;
				}
			}
		}
		.item-container {
			margin: 20px 0;
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media only screen and (max-width: 760px) and (max-aspect-ratio: 13/9) {
		.search-bar {
			.condition {
				grid-template-columns: repeat(6, 1fr);
				&__label {
					grid-column: auto / span 2;
					justify-self: end;
					&.col {
						align-self: start;
					}
					&.date {
						display: none;
					}
				}
				&__element {
					grid-column: auto / span 4;
					&.col {
						height: auto;
						width: auto;
						display: grid;
						grid-template-columns: repeat(4, 1fr);
						grid-column-gap: 8px;
						grid-row-gap: 3px;
						align-items: center;
						justify-items: start;
						margin-bottom: 4px;
					}
					&.date {
						grid-column: auto / span 6;
						justify-self: end;
						padding: 0 10px 10px 0;
						&:before {
							content: attr(data-short)
						}
					}
				}
			}
		}
	}
	@media only screen and (max-width: 760px) and (min-aspect-ratio: 13/9) {
		.search-bar {
			.condition {
				grid-template-columns: repeat(10, 1fr);
				&__label {
					grid-column: auto / span 2;
					justify-self: end;
					&.col {
						align-self: start;
					}
					&.date {
						visibility: hidden;
					}
				}
				&__element {
					grid-column: auto / span 3;
					&.pa {
						grid-column: auto / span 8;
					}
					&.col {
						grid-column: auto / span 8;
						height: auto;
						width: auto;
						display: grid;
						grid-template-columns: repeat(8, 1fr);
						grid-column-gap: 10px;
						grid-row-gap: 3px;
						align-items: center;
						justify-items: start;
						margin-bottom: 4px;
					}
					&.date {
						grid-column: auto / span 8;
						justify-self: end;
						padding: 0 10px 10px 0;
						&:before {
							content: attr(data-long);
						}
					}
				}
			}
		}
	}
</style>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import router from '../router';
	const clickEvent = (() => {
		if ('ontouchstart' in document.documentElement === true)
			return 'touchstart';
		else
			return 'click';
	})();

	export default {
		data() {
			return {
				toggleSearch: false,
			};
		},
		created () {
		},
		mounted() {
			document.addEventListener(clickEvent, this.collapseSearch, true);
		},
		beforeDestroy() {
			document.removeEventListener(clickEvent, this.collapseSearch);
		},
		methods: {
			...mapActions([
				'setPeriod',
				'setSortBy',
				'setUnlimitedPA'
			]),
			collapseSearch(event) {
				if (this.toggleSearch && !this.$refs["searchBar"].contains(event.target)) {
					this.toggleSearch = false;
					event.preventDefault();
				}
			},
			setPeriod_(period) {
				this.setPeriod(period);
				this.toggleSearch = false;
			},
			goStats(key) {
				this.setSortBy(key);
				this.setUnlimitedPA(true);
				router.push('/main/stats_pa');
			}
		},
		computed: {
			...mapGetters({
				period: 'period',
				periodSelect: 'periodSelect',
				periodGames: 'periodGames',
				lastUpdate: 'lastUpdate',
				itemStats: 'itemStats',
			}),
		}
	}
</script>