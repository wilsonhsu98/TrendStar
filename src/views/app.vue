<template>
	<div>
		<div class="search-bar" ref="searchBar">
 			<div class="search-bar__container"><i class="fa fa-search"></i></div>
 			<input type="checkbox" class="toggle-search" v-model="toggleSearch"/>
 			<div class="condition">
				<div class="condition__label">Period:</div>
				<div class="condition__element">
					<select class="dropdown" :value="periodSelect" @change="setPeriod($event.target.value)">
						<option v-for="item in period">{{ item.period }}</option>
					</select>
				</div>
				<div class="condition__label">Latest PA:</div>
				<div class="condition__element">
					 <minus-plus-number :value="top" @change="setTop"/>
				</div>
				<div class="condition__label">Sort by:</div>
				<div class="condition__element sort">
					<select class="dropdown" :value="sortBy" @change="setSortBy($event.target.value)">
						<option v-for="col in conditionCols">{{ col.name }}</option>
					</select>
				</div>
				<i class="fa fa-cloud-download" @click="refetchAllTable"></i>
				<br>
				<div class="condition__label col">Display:</div>
				<div class="condition__element col">
					<label class="condition__col" for="check_all"><!--
						 --><input id="check_all" type="checkbox" :checked="checkAll" @change="setCheckAll_($event.target.checked)"/><!--
						 -->All<!--
					 --></label><!--
					 --><label class="condition__col" :for="col.name" v-for="col in conditionCols"><!--
						 --><input :id="col.name" type="checkbox" :value="col.name" :checked="col.visible" :disabled="col.disabled" @change="toggleColumn(col.name)"/><!--
						 -->{{ col.name }}<!--
					 --></label>
				 </div>
				 <i class="fa fa-refresh" @click="refreshPlayer"></i>
			</div>
		</div>
		<div id="table">
			<div class="header-row">
				<span class="cell delete"><i class="fa fa-refresh" @click="refreshPlayer"></i></span>
				<span :class="`cell ${col.name}`" v-for="col in displayedCols">{{ col.name }}</span>
			</div>
			<template v-for="(item, index) in list">
				<input type="radio" name="expand" class="toggle-row" @click="toggleRadio($event)"/>
				<div class="row-grid">
					<span class="cell delete"><i class="fa fa-trash" @click="deletePlayer(item.name)"></i></span>
					<span
						:class="`cell${col.name === sortBy ? ' sort' : ''}${['Rank', 'name'].indexOf(col.name) > -1 ? ' ' + col.name : ''}`"
						v-for="(col, cIndex) in displayedCols"
						:data-label="col.name">
						{{ cIndex === 0 ? (index + 1) : formatValue(item[col.name], col.name) }}
					</span>
					<div v-if="item.listByGame.length" class="cell chart">
						<div class="bar" v-for="cube in item.listByGame">
							<template v-for="(cell, i) in cube">
								<span v-if="i === cube.length - 1" class="game">{{ cell }}</span>
								<span v-else :class="`item ${cell.color} ${cell.exclude ? 'exclude' : ''}`">{{ cell.content }}</span>
							</template>
						</div>
					</div>
				</div>
			</template>
		</div>
		<loading v-if="loading"></loading>
	</div>
</template>

<style lang="scss">
	@import "../scss/variable";
	@import "../scss/base";

	.condition {
		> div, label {
			display: inline-block;
			line-height: 30px;
			height: 30px;
			vertical-align: middle;
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
				width: calc(100% - 80px);
				height: auto;
			}
		}
		&__col {
			margin-right: 10px;
			vertical-align: middle;
			cursor: pointer;
		}
	}

	.dropdown {
		height: 30px;
		width: 100px;
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
	.fa-cloud-download {
		color: #327a81;
	}
	#table {
		display: table;
		width: 100%;
		background: #FFF;
		margin: 0;
		box-sizing: border-box;
		color: $row_color;
		border: 1px solid $table_bordercolor;
		position: relative;
		.header-row {
			display: table-row;
			background: $header_bgcolor;
			color: $header_color;
			.cell {
				&.Rank, &.delete { width: 50px; }
				&.name { width: 70px; }
			}
		}
		.toggle-row {
			display: block;
			position: absolute;
			left: 50px;
			z-index: 1;
			height: 36px;
			width: calc(100% - 50px);
			margin: 0;
			opacity: 0;
			cursor: pointer;
			&:checked {
				&+.row-grid .cell.chart {
					display: flex;
				}
			}
		}
		.row-grid {
			display: table-row;
			&:nth-child(4n+3) { background-color: $row_even_bgcolor; }
			&:nth-child(4n+1) { background-color: $row_odd_bgcolor; }
		}
		.cell {
			display: table-cell;
			line-height: 36px;
			text-align: center;
			&.chart {
				background-color: #fff;
				position: absolute;
				left: 170px;
				right: -1px;
				z-index: 2;

				display: none;
				flex-direction: row-reverse;
				justify-content: space-around;
				align-items: flex-end;
				font-size: 12px;
				margin-top: 36px;
				padding-top: 5px;
				border: 1px solid $table_bordercolor;
				border-top: 0;
				box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
				.item {
					display: block;
					height: 20px;
					line-height: 20px;
					color: #fff;
					margin-bottom: 1px;
					&.red { background-color: #ef1010; }
					&.yellow { background-color: #efaf34; }
					&.blue { background-color: #4d9de5; }
					&.exclude { opacity: 0.1; }
				}
				.game {
					display: block;
					line-height: 20px;
				}
			}
		}
	}
	.search-bar__container,
	.condition .fa-refresh,
	.toggle-search {
		display: none;
	}
	@media only screen and (max-width: 760px) {
		.search-bar {
			background-color: $header_bgcolor;
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
				height: 40px;
				line-height: 40px;
			}
			.toggle-search {
				display: block;
				position: absolute;
				top: 0;
				z-index: 1;
				height: 40px;
				width: 100%;
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
				.fa-cloud-download {
					position: absolute;
					bottom: 50px;
					left: 10px;
				}
			}
		}
		#table {
			display: block;
			border: none;
			margin-top: 40px;
			overflow: hidden;
			position: relative;
			z-index: 0;

			.row-grid {
				position: relative;
				display: grid;
				grid-template-rows: auto;
				z-index: 0;
				background-color: #FFF;
				transition: max-height 1s cubic-bezier(0, 1, 0, 1) -.1s;
				max-height: 36px;
				&:nth-child(4n+1) {
					background-color: $row_odd_bgcolor;
					// background-color: #FFF;
					// .cell {
					// 	&.Rank, &.name, &.sort, &.delete {
					// 		background-color: $row_odd_bgcolor;
					// 	}
					// }
				}
				&:nth-child(4n+3) {
					background-color: $row_even_bgcolor;
					// background-color: #FFF;
					// .cell {
					// 	&.Rank, &.name, &.sort, &.delete {
					// 		background-color: $row_even_bgcolor;
					// 	}
					// }
				}
			}
			.header-row {
				display: none;
			}
			.cell {
				display: block;
				box-sizing: border-box;
				&:not(.sort):not(.Rank):not(.name):not(.delete):not(.chart) {
					grid-column: auto / span 2;
					text-align: left;
				}
				&:not(.Rank):not(.name):not(.delete):not(.chart) {
					&:before {
						content: attr(data-label) ":";
						display: inline-block;
						width: 40px;
						text-align: right;
					}
				}
				&.Rank {
					grid-area: rank;
				}
				&.name {
					grid-area: name;
				}
				&.sort {
					grid-area: sort;
					text-align: center;
				}
				&.delete {
					grid-area: delete;
				}
				&.chart {
					grid-area: chart;
					position: initial;
					margin-top: 0;
					border: none;
					box-shadow: none;
					background-color: transparent;
				}
			}
			.toggle-row {
				left: 0;
				&:checked {
					&+.row-grid {
						max-height: 10000px;
						transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
						transition-delay: 0s;
					}
				}
			}
		}
	}
	@media only screen and (max-width: 760px) and (max-aspect-ratio: 13/9) {
		#table {
			.row-grid {
				grid-template-columns: repeat(6, 1fr);
				grid-template-areas: "rank name name sort sort delete"
									"chart chart chart chart chart chart";
			}
			.toggle-row {
				width: calc(100% / 6 * 5);
			}
		}
		.search-bar {
			.condition {
				grid-template-columns: repeat(6, 1fr);
				&__label {
					grid-column: auto / span 2;
					justify-self: end;
					&.col {
						align-self: start;
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
				}
			}
		}
	}
	@media only screen and (max-width: 760px) and (min-aspect-ratio: 13/9) {
		#table {
			.row-grid {
				grid-template-columns: repeat(10, 1fr);
				grid-template-areas: "rank name name sort sort sort sort sort sort delete"
									"chart chart chart chart chart chart chart chart chart chart";
			}
			.toggle-row {
				width: calc(100% / 10 * 9);
			}
		}
		.search-bar {
			.condition {
				grid-template-columns: repeat(10, 1fr);
				&__label {
					grid-column: auto / span 2;
					justify-self: end;
					&.col {
						align-self: start;
					}
				}
				&__element {
					grid-column: auto / span 3;
					&.sort {
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
				}
				.fa-cloud-download {
					position: absolute;
					bottom: 10px;
					left: 50px;
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
				toggleSearch: false,
				toggleTarget: null,
			};
		},
		created () {
			this.initFromLS();
			this.fetchTable();
		},
		mounted() {
			window.addEventListener('click', this.collapseSearch, true);
		},
		beforeDestroy() {
			window.removeEventListener('click', this.collapseSearch);
		},
		methods: {
			...mapActions([
				'initFromLS',
				'fetchTable',
				'refetchAllTable',
				'setPeriod',
				'setTop',
				'setSortBy',
				'setCheckAll',
				'toggleColumn',
				'deletePlayer',
				'refreshPlayer',
			]),
			formatValue(value, col) {
				return ['AVG', 'OBP', 'SLG', 'OPS'].indexOf(col) > -1 && value !== '-' ? value.toFixed(3) : value;
			},
			toggleRadio(event) {
				if (this.toggleTarget === event.target) {
					event.target.checked = false;
					this.toggleTarget = null;
				} else {
					this.toggleTarget = event.target;
				}
			},
			collapseSearch(event) {
				if (this.toggleSearch && !this.$refs["searchBar"].contains(event.target)) {
					this.toggleSearch = false;
					event.preventDefault();
					if (event.target.classList.contains('fa-trash')) {
						event.stopPropagation();
					}
				}
			},
			setCheckAll_(isCheckAll) {
				this.setCheckAll(isCheckAll);
			}
		},
		computed: {
			...mapGetters({
				period: 'period',
				periodSelect: 'periodSelect',
				top: 'top',
				sortBy: 'sortBy',
				checkAll: 'checkAll',
				conditionCols: 'conditionCols',
				list: 'genStatistics',
				displayedCols: 'displayedCols',
				loading: 'getLoading',
			}),
		}
	}
</script>