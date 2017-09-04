<template>
	<div>
		<div class="search-bar">
 			<div class="search-bar__container"><div class="search-icon"></div></div>
 			<input type="checkbox" class="toggle-search" v-model="toggleSearch"/>
 			<div class="condition" ref="condition">
				<div class="condition__label">Period:</div>
				<div class="condition__element">
					<select class="dropdown" v-model="periodSelect">
						<option v-for="item in period">{{ item.period }}</option>
					</select>
				</div>
				<div class="condition__label">Latest PA:</div>
				<div class="condition__element">
					 <minus-plus-number :value="top" v-on:change="setTop"/>
				</div>
				<div class="condition__label">Sort by:</div>
				<div class="condition__element sort">
					<select class="dropdown" v-model="sortBy">
						<option v-for="col in conditionCols()">{{ col }}</option>
					</select>
				</div>
				<br>
				<div class="condition__label col">Display:</div>
				<div class="condition__element col">
					<label class="condition__col" for="check_all"><!--
						 --><input id="check_all" type="checkbox" v-model="checkAll"/><!--
						 -->All<!--
					 --></label><!--
					 --><label class="condition__col" :for="col" v-for="col in conditionCols()"><!--
						 --><input :id="col" type="checkbox" :value="col" v-model="columnsDisplay" :disabled="col===sortBy"/><!--
						 -->{{ col }}<!--
					 --></label>
				 </div>
			</div>
		</div>
		<div id="table" v-if="list.length">
			<div class="header-row">
				<span :class="`cell ${col}`" v-for="col in filterCols()">{{ col }}</span>
			</div>
			<template v-for="(item, index) in list">
				<input type="radio" name="expand" class="toggle-row" @click="toggleRadio($event)"/>
				<div class="row-grid">
					<span
						:class="`cell${col === sortBy ? ' sort' : ''}${['Rank', 'name'].indexOf(col) > -1 ? ' ' + col : ''}`"
						v-for="(col, cIndex) in filterCols()"
						:data-label="col">
						{{ cIndex === 0 ? (index + 1) : formatValue(item[col], col) }}
					</span>
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
		}
	}

	.dropdown {
		height: 30px;
		width: 100px;
		border: 2px solid rgb(166, 166, 166);
		background-color: rgb(248, 248, 248);
	}
	#table {
		display: table;
		width: 100%;
		background: #FFF;
		margin: 0;
		box-sizing: border-box;
		color: $row_color;
		border: 1px solid $table_bordercolor;
		overflow: hidden;
		.header-row {
			display: table-row;
			background: $header_bgcolor;
			color: $header_color;
			.cell {
				&.Rank { width: 50px; }
				&.name { width: 70px; }
				// &.AVG, &.OBP, &.SLG, &.OPS { width: 60px; }
			}
		}
		.row-grid {
			display: table-row;
			&:nth-child(4n+3) { background-color: $row_even_bgcolor; }
			&:nth-child(4n+1) { background-color: $row_odd_bgcolor; }
		}
		.cell {
			display: table-cell;
			line-height: 30px;
			text-align: center;
		}
	}
	.toggle-row,
	.search-icon,
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
						max-height: 9999px;
						transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
						transition-delay: 0s;
					}
				}
			}
			.condition {
				max-height: 0;
				transition: max-height .8s cubic-bezier(0, 1, 0, 1) -.1s;
				display: grid;
				grid-template-rows: auto;
				grid-column-gap: 3px;
				grid-row-gap: 6px;
				align-items: center;
				justify-items: start;
				padding: 0 3px;
				box-sizing: border-box;
				> br {
					display: none;
				}
				&__col {
					margin: 0;
				}
			}
		}
		.search-icon {
			position: relative;
			display: inline-block;
			width: $magnifier_size*1.4;
			height: $magnifier_size*1.4;
			text-align: left;
			vertical-align: middle;
			&:before {
				content: '';
				display: inline-block;
				height: $magnifier_size;
				width: $magnifier_size;
				border-radius: 50%;
				border: $magnifier_size/8 solid $header_color;
			}
			&:after {
				content: '';
				position: absolute;
				top: $magnifier_size/2 + $magnifier_size/4*1.414 + $magnifier_size/4;
				left: $magnifier_size/2 + $magnifier_size/4*1.414 + $magnifier_size/14;
				transform: rotate(45deg);
				height: $magnifier_size/8;
				width: $magnifier_size/2;
				background-color: $header_color;
				border-radius: 10px;
			}
		}
		#table {
			display: block;
			border: none;
			margin-top: 40px;
			position: relative;
			z-index: 0;

			.row-grid {
				position: relative;
				display: grid;
				grid-template-rows: auto;
				z-index: 0;
				background-color: #FFF;
				transition: max-height 0.8s cubic-bezier(0, 1, 0, 1) -.1s;
				max-height: 30px;
				&:nth-child(4n+1) {
					background-color: #FFF;
					.cell {
						&.Rank, &.name, &.sort {
							background-color: $row_odd_bgcolor;
						}
					}
				}
				&:nth-child(4n+3) {
					background-color: #FFF;
					.cell {
						&.Rank, &.name, &.sort {
							background-color: $row_even_bgcolor;
						}
					}
				}
			}
			.header-row {
				display: none;
			}
			.cell {
				display: block;
				box-sizing: border-box;
				&:not(.sort):not(.Rank):not(.name) {
					grid-column: auto / span 2;
					text-align: left;

				}
				&:not(.Rank):not(.name) {
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
			}
			.toggle-row {
				display: block;
				position: absolute;
				z-index: 1;
				height: 30px;
				width: 100%;
				margin: 0;
				opacity: 0;
				&:checked {
					&+.row-grid {
						max-height: 9999px;
						transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
						transition-delay: 0s;
					}
				}
			}
		}
	}
	@media only screen and (max-width: 760px) and (orientation: portrait) {
		#table {
			.row-grid {
				grid-template-columns: repeat(6, 1fr);
				grid-template-areas: "rank name name sort sort sort";
			}
		}
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
	@media only screen and (max-width: 760px) and (orientation: landscape) {
		#table {
			.row-grid {
				grid-template-columns: repeat(10, 1fr);
				grid-template-areas: "rank name name sort sort sort sort sort sort sort";
			}
		}
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
		}
	}
</style>

<script>
	import utils from "../libs/utils";
	import { GET_URL } from "../constants/index";

	export default {
		data() {
			return {
				period: [{period: 'All time'}],
				periodSelect: localStorage.getItem("pref_period") || 'All time',
				periodSelectValues: [],
				periodLoaded: [],
				allGames: [],
				list: [],
				players: [],
				records: [],
				toggleSearch: false,
				top: parseInt(localStorage.getItem("pref_top"), 10) || 10,
				sortBy: localStorage.getItem("pref_sortby") || 'OPS',
				cols: [
					{Rank: true},
					{name: true},
					{PA: true},
					{AB: true},
					{H: true},
					{TB: true},
					{TOB: true},
					{R: true},
					{RBI: true},
					{'1H': true},
					{'2H': true},
					{'3H': true},
					{HR: true},
					{K: true},
					{DP: true},
					{BB: true},
					{SF: true},
					{AVG: true},
					{OBP: true},
					{SLG: true},
					{OPS: true}
				],
				toggleTarget: null,
				loading: false
			};
		},
		mounted() {
			const pref_cols = localStorage.getItem("pref_cols");
			if (pref_cols) this.cols = JSON.parse(pref_cols);

			this.fetch();

			window.addEventListener('click', this.collapseSearch, true);
		},
		beforeDestroy() {
			window.removeEventListener('click', this.collapseSearch);
		},
		methods: {
			fetch() {
				this.loading = true;
				fetch(GET_URL({sheetname: 'game'}))
					.then(res => {
						if (res.status >= 400) throw new Error("Bad response from server");
						return res.json();
					})
					.then(arr => {
						this.allGames = arr.map(item => item.game);
						this.period = [{period: 'All time', games: this.allGames}].concat(
							arr.map(item => item.year + item.season)
								.filter((value, index, self) => self.indexOf(value) === index)
								.map(item => ({period: item, games: arr.filter(sub => (sub.year + sub.season) === item ).map(sub => sub.game)}))
								.sort((a, b)=> a.period < b.period)
						);
						let games = this.period.find(item => item.period === this.periodSelect);
						games = games ? games.games : [];

						const tableArr = JSON.stringify(
							this.allGames.filter(function(item) { return games.indexOf(item) > -1; })
						);

						return Promise.all([
							GET_URL({sheetname: 'player'}),
							GET_URL({sheetname: tableArr})
						].map(url => fetch(url)
							.then(res => {
								if (res.status >= 400) throw new Error("Bad response from server");
								return res.json();
							})
						));
					}).then(arr => {
						this.players = arr[0].map(item => item.player);
						this.records = arr[1];
						this.periodLoaded.push(this.periodSelect);
						this.loading = false;
					}).catch(err => {
						alert(err);
						this.loading = false;
					});
			},
			conditionCols() {
				return this.cols.map(item => Object.keys(item)[0]).filter(i => i !== 'Rank' && i!= 'name');
			},
			filterCols() {
				return this.cols
					.filter(item => item[Object.keys(item)[0]])
					.map(item => Object.keys(item)[0]);
			},
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
				if (this.toggleSearch && !this.$refs["condition"].contains(event.target)) {
					this.toggleSearch = false;
				}
			},
			setTop(val) {
				this.top = val;
			},
			secondFetch() {
				const tableArr = JSON.stringify(this.periodSelectValues);
				this.loading = true;
				fetch(GET_URL({sheetname: tableArr}))
					.then(res => {
						if (res.status >= 400) throw new Error("Bad response from server");
						return res.json();
					})
					.then(res => {
						if (this.periodSelect === 'All time') {
							this.records = res;
						} else {
							this.records = this.records.concat(res);
						}
						this.periodLoaded.push(this.periodSelect);
						this.loading = false;
					})
					.catch(err => {
						alert(err);
						this.loading = false;
					});
			}
		},
		computed: {
			columnsDisplay: {
				get: function() {
					return this.filterCols();
				},
				set: function(newValue) {
					this.cols.forEach(item => {
						var key = Object.keys(item)[0];
						item[key] = newValue.indexOf(key) === -1 ?  false : true;
					});

					localStorage.setItem("pref_cols", JSON.stringify(this.cols));
				}
			},
			checkAll: {
				get: function() {
					return this.filterCols().length === this.cols.length;
				},
				set: function(newValue) {
					this.cols
					.filter(item => ['Rank', 'name'].indexOf(Object.keys(item)[0]) === -1)
					.forEach(item => {
						item[Object.keys(item)[0]] = newValue;
						if (Object.keys(item)[0] === this.sortBy) {
							item[Object.keys(item)[0]] = true;
						}
					});

					localStorage.setItem("pref_cols", JSON.stringify(this.cols));

					if (newValue) {
						setTimeout(function() {
							var x = document.getElementsByClassName('cell');
							for (var i = 0, len = x.length; i < len; i++) {
								x[i].style.display = 'block';
								x[i].style.display = '';
							}
						});
					}
				}
			}
		},
		watch: {
			top(top) {
				localStorage.setItem("pref_top", top);

				this.list = utils.genStatistics(this.players, this.records, top, this.periodSelectValues)
					.filter(item => item.PA !== '-')
					.sort((a, b) => b[this.sortBy] - a[this.sortBy]);
			},
			records(records) {
				this.list = utils.genStatistics(this.players, records, this.top, this.periodSelectValues)
					.filter(item => item.PA !== '-')
					.sort((a, b) => b[this.sortBy] - a[this.sortBy]);
			},
			periodSelect(periodSelect) {
				localStorage.setItem("pref_period", periodSelect);
				this.periodSelectValues = this.period.find(item => item.period === periodSelect);
				this.periodSelectValues = this.periodSelectValues ? this.periodSelectValues.games : [];
				const loadedTables = this.period
					.filter(item => this.periodLoaded.indexOf(item.period) > -1 )
					.map(item => item.games)
					.reduce(function(a, b) { return a.concat(b); }, []);
				if (
					this.periodLoaded.indexOf('All time') > -1 ||
					this.periodLoaded.indexOf(periodSelect) > -1 ||
					loadedTables.length === this.allGames.length
				) {
					this.list = utils.genStatistics(this.players, this.records, this.top, this.periodSelectValues)
						.filter(item => item.PA !== '-')
						.sort((a, b) => b[this.sortBy] - a[this.sortBy]);
				} else {
					this.secondFetch();
				}
			},
			sortBy(sortBy) {
				this.cols.forEach(item => {
					if (Object.keys(item)[0] === sortBy) {
						item[Object.keys(item)[0]] = true;
					}
				});

				localStorage.setItem("pref_cols", JSON.stringify(this.cols));
				localStorage.setItem("pref_sortby", sortBy);

				this.list = utils.genStatistics(this.players, this.records, this.top, this.periodSelectValues)
					.filter(item => item.PA !== '-')
					.sort((a, b) => b[sortBy] - a[sortBy]);
			}
		}
	}
</script>