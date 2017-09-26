<template>
	<div>
		<div class="search-bar" ref="searchBar">
 			<div class="search-bar__container"><i class="icono-search"></i></div>
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
				 <i class="icono-reset" @click="refreshPlayer()"></i>
			</div>
		</div>
		<div id="table">
			<div class="header-row">
				<span class="cell delete"><i class="icono-reset" @click="refreshPlayer()"></i></span>
				<span :class="`cell ${col.name}`" v-for="col in displayedCols">{{ col.name }}</span>
			</div>
			<template v-for="(item, index) in list">
				<input type="radio" name="expand" class="toggle-row" @click="toggleRadio($event)"/>
				<div class="row-grid">
					<span class="cell delete"><i class="icono-trash" @click="deletePlayer(item.name)"></i></span>
					<span
						:class="`cell${col.name === sortBy ? ' sort' : ''}${['Rank', 'name'].indexOf(col.name) > -1 ? ' ' + col.name : ''}`"
						v-for="(col, cIndex) in displayedCols"
						:data-label="col.name">
						{{ cIndex === 0 ? (index + 1) : formatValue(item[col.name], col.name) }}
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
		border-radius: 5px;
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
				&.Rank, &.delete { width: 50px; }
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
			line-height: 36px;
			text-align: center;
		}
	}
	.search-bar__container,
	.condition .icono-reset,
	.toggle-row,
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
				position: relative;
				overflow: hidden;
				> br {
					display: none;
				}
				&__col {
					margin: 0;
				}
				.icono-reset {
					display: inline-block;
					position: absolute;
					bottom: 5px;
					left: 5px;
				}
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
				max-height: 36px;
				&:nth-child(4n+1) {
					background-color: #FFF;
					.cell {
						&.Rank, &.name, &.sort, &.delete {
							background-color: $row_odd_bgcolor;
						}
					}
				}
				&:nth-child(4n+3) {
					background-color: #FFF;
					.cell {
						&.Rank, &.name, &.sort, &.delete {
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
				&:not(.sort):not(.Rank):not(.name):not(.delete) {
					grid-column: auto / span 2;
					text-align: left;
				}
				&:not(.Rank):not(.name):not(.delete) {
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
			}
			.toggle-row {
				display: block;
				position: absolute;
				z-index: 1;
				height: 36px;
				// width: 100%;
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
				grid-template-areas: "rank name name sort sort delete";
			}
			.toggle-row {
				width: calc(100% / 6 * 5);
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
				grid-template-areas: "rank name name sort sort sort sort sort sort delete";
			}
			.toggle-row {
				width: calc(100% / 10 * 9);
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
	// import utils from "../libs/utils";
	// import { GET_URL } from "../constants/index";
	import { mapGetters, mapActions } from 'vuex';

	export default {
		data() {
			return {
				// period: [{period: 'All time'}],
				// periodSelect: localStorage.getItem("pref_period") || 'All time',
				// periodSelectValues: [],
				// periodLoaded: [],
				// allGames: [],
				toggleSearch: false,
				toggleTarget: null,
			};
		},
		created () {
			this.$store.dispatch('initFromLS');
			this.$store.dispatch('fetchTable');
		},
		mounted() {
			window.addEventListener('click', this.collapseSearch, true);
		},
		beforeDestroy() {
			window.removeEventListener('click', this.collapseSearch);
		},
		methods: {
			...mapActions([
				'setPeriod',
				'setTop',
				'setSortBy',
				'setCheckAll',
				'toggleColumn',
				'deletePlayer',
				'refreshPlayer',
			]),
			fetch() {
				// this.loading = true;
				// fetch(GET_URL({sheetname: 'game'}))
				// 	.then(res => {
				// 		if (res.status >= 400) throw new Error("Bad response from server");
				// 		return res.json();
				// 	})
				// 	.then(arr => {
				// 		this.allGames = arr.map(item => item.game);
				// 		this.period = [{period: 'All time', games: this.allGames}].concat(
				// 			arr.map(item => item.year + item.season)
				// 				.filter((value, index, self) => self.indexOf(value) === index)
				// 				.map(item => ({period: item, games: arr.filter(sub => (sub.year + sub.season) === item ).map(sub => sub.game)}))
				// 				.sort((a, b)=> a.period < b.period)
				// 		);
				// 		let games = this.period.find(item => item.period === this.periodSelect);
				// 		games = games ? games.games : [];

				// 		const tableArr = JSON.stringify(
				// 			this.allGames.filter(function(item) { return games.indexOf(item) > -1; })
				// 		);

				// 		return Promise.all([
				// 			GET_URL({sheetname: 'player'}),
				// 			GET_URL({sheetname: tableArr})
				// 		].map(url => fetch(url)
				// 			.then(res => {
				// 				if (res.status >= 400) throw new Error("Bad response from server");
				// 				return res.json();
				// 			})
				// 		));
				// 	}).then(arr => {
				// 		this.players = arr[0].map(item => item.player);
				// 		this.records = arr[1];
				// 		this.periodLoaded.push(this.periodSelect);
				// 		this.loading = false;
				// 	}).catch(err => {
				// 		alert(err);
				// 		this.loading = false;
				// 	});
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
				if (this.toggleSearch && !this.$refs["searchBar"].contains(event.target)) {
					this.toggleSearch = false;
					event.preventDefault();
					if (event.target.classList.contains('icono-trash')) {
						event.stopPropagation();
					}
				}
			},
			// secondFetch() {
			// 	const tableArr = JSON.stringify(this.periodSelectValues);
			// 	this.loading = true;
			// 	fetch(GET_URL({sheetname: tableArr}))
			// 		.then(res => {
			// 			if (res.status >= 400) throw new Error("Bad response from server");
			// 			return res.json();
			// 		})
			// 		.then(res => {
			// 			if (this.periodSelect === 'All time') {
			// 				this.records = res;
			// 			} else {
			// 				this.records = this.records.concat(res);
			// 			}
			// 			this.periodLoaded.push(this.periodSelect);
			// 			this.loading = false;
			// 		})
			// 		.catch(err => {
			// 			alert(err);
			// 			this.loading = false;
			// 		});
			// },
			setCheckAll_(isCheckAll) {
				this.setCheckAll(isCheckAll);
				if (isCheckAll) {
					setTimeout(function() {
						var x = document.getElementsByClassName('cell');
						for (var i = 0, len = x.length; i < len; i++) {
							x[i].style.display = 'block';
							x[i].style.display = '';
						}
					});
				}
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