<template>
	<div>
		<div class="search-bar">
 			<div class="search-bar__container"><div class="search-icon"></div></div>
 			<input type="checkbox" class="toggle-search"/>
 			<div class="condition">
				<div class="condition__label">Latest PA:</div>
				<div class="condition__element">
					 <div class="dec button" @click="minusPa"></div><!--
					 --><input type="number" id="top_pa" v-model.number="inpNum" min="1"><!--
					 --><div class="inc button" @click="addPa"></div>
				</div>
				<div class="condition__label">Sort by:</div>
				<div class="condition__element">
					<select id="sort_by" v-model="sortBy">
						<option v-for="col in conditionCols()">{{ col }}</option>
					</select>
				</div>
				<br>
				<div class="condition__label col">Display:</div>
				<div class="condition__element col">
					<label class="condition__col" :for="col" v-for="col in conditionCols()"><!--
						 --><input :id="col" type="checkbox" :value="col" v-model="columnsDisplay" :disabled="col===sortBy"/><!--
						 -->{{ col }}<!--
					 --></label>
				 </div>
			</div>
		</div>
		<div id="table" v-if="list.length">
			<div class="header-row">
				<span class="cell" v-for="col in filterCols()">{{ col }}</span>
			</div>
			<div class="row" v-for="(item, index) in list">
				<input type="radio" name="expand" class="toggle-row" @click="toggleRadio($event)"/>
				<span
					:class="`cell ${col === sortBy ? 'sort' : ''} ${['Rank', 'name'].indexOf(col) > -1 ? col : ''}`"
					v-for="(col, cIndex) in filterCols()"
					:data-label="col">
					{{ cIndex === 0 ? (index + 1) : formatValue(item[col], col) }}
				</span>
			</div>
		</div>
		<div v-if="loading" class="loading-mask">
			<div class="sk-cube-grid">
				<div class="sk-cube sk-cube1"></div>
				<div class="sk-cube sk-cube2"></div>
				<div class="sk-cube sk-cube3"></div>
				<div class="sk-cube sk-cube4"></div>
				<div class="sk-cube sk-cube5"></div>
				<div class="sk-cube sk-cube6"></div>
				<div class="sk-cube sk-cube7"></div>
				<div class="sk-cube sk-cube8"></div>
				<div class="sk-cube sk-cube9"></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	$table_bordercolor: #327a81;
	$header_bgcolor: rgba(50, 122, 129, 0.9);
	$header_color: #FFF;
	$row_odd_bgcolor: #edf7f8;
	$row_even_bgcolor: #FFF;
	$row_color: #2b686e;
	$magnifier_size: 20px;
.loading-mask {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(50, 122, 129, 0.1);
}
.sk-cube-grid {
	width: 40px;
	height: 40px;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin:auto;
}

.sk-cube-grid .sk-cube {
	width: 33%;
	height: 33%;
	background-color: $header_bgcolor;
	float: left;
	-webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
			animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
}
.sk-cube-grid .sk-cube1 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }
.sk-cube-grid .sk-cube2 {
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s; }
.sk-cube-grid .sk-cube3 {
  -webkit-animation-delay: 0.4s;
          animation-delay: 0.4s; }
.sk-cube-grid .sk-cube4 {
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s; }
.sk-cube-grid .sk-cube5 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }
.sk-cube-grid .sk-cube6 {
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s; }
.sk-cube-grid .sk-cube7 {
  -webkit-animation-delay: 0s;
          animation-delay: 0s; }
.sk-cube-grid .sk-cube8 {
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s; }
.sk-cube-grid .sk-cube9 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }

@-webkit-keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
            transform: scale3D(1, 1, 1);
  } 35% {
    -webkit-transform: scale3D(0, 0, 1);
            transform: scale3D(0, 0, 1);
  }
}

@keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
            transform: scale3D(1, 1, 1);
  } 35% {
    -webkit-transform: scale3D(0, 0, 1);
            transform: scale3D(0, 0, 1);
  }
}
	body {
		margin: 0;
		font-family: 'Inconsolata';
		padding: 10px;
	}
	.condition {
		> div, label {
			display: inline-block;
			line-height: 30px;
			height: 30px;
			vertical-align: middle;
		}
		&__label {
			padding: 4px;
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
	#top_pa {
		width: 40px;
		padding: 3px 0 0 0;
		text-align: center;
		vertical-align: top;
		height: 30px;
		box-sizing: border-box;
		border: 2px solid rgb(166, 166, 166);
		background-color: rgb(248, 248, 248);
		vertical-align: middle;
	}
	.button {
		position: relative;
		width: 22px;
		height: 22px;
	    display: inline-block;
		border: 4px solid black;
		vertical-align: middle;
		&:before, &:after {
		    content: "";
			position: absolute;
			background-color: white;
		}
		&.inc {
			border-radius: 0 5px 5px 0;
			border-color: #5cb85c;
			background-color: #5cb85c;
			&:before {
				top: 6px;
				left: 50%;
				width: 4px;
				height: calc(100% - 12px);
				margin-left: -2px;
			}
			&:after {
				top: 50%;
				left: 6px;
				width: calc(100% - 12px);
				height: 4px;
				margin-top: -2px;
			}
		}
		&.dec {
			border-radius: 5px 0 0 5px;
			border-color: #d9534f;
			background-color: #d9534f;
			&:after {
				top: 50%;
				left: 6px;
				width: calc(100% - 12px);
				height: 4px;
				margin-top: -2px;
			}
		}
	}
	input[type=number]::-webkit-inner-spin-button,
	input[type=number]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0; /* Removes leftover margin */
	}
	#sort_by {
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
		.header-row {
			display: table-row;
			background: $header_bgcolor;
			color: $header_color;
		}
		.row {
			display: table-row;
			&:nth-child(even) { background-color: $row_even_bgcolor; }
			&:nth-child(odd) { background-color: $row_odd_bgcolor; }
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
		body {
			padding: 0;
		}
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
				max-height: 0px;
				transition: max-height .8s cubic-bezier(0, 1, 0, 1) -.1s;
				display: grid;
				grid-template-rows: auto;
				grid-column-gap: 3px;
				grid-row-gap: 3px;
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
			.row {
				position: relative;
				display: grid;
				grid-template-rows: auto;
				z-index: 0;
				&:nth-child(even) {
					background-color: #fff;
					.cell {
						&.Rank, &.name, &.sort {
							background-color: $row_even_bgcolor;
						}
					}
				}
				&:nth-child(odd) {
					background-color: #fff;
					.cell {
						&.Rank, &.name, &.sort {
							background-color: $row_odd_bgcolor;
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
					display: none;
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
					&~.cell:not(.sort):not(.Rank):not(.name) {
						display: block;
						grid-column: auto / span 2;
						text-align: left;
					}
				}
			}
		}
	}
	@media only screen and (max-width: 760px) and (orientation: portrait) {
		#table {
			.row {
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
			.row {
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
	import { QUERY_SHEET_URL } from "../constants/index";

	export default {
		data() {
			return {
				list: [],
				players: [],
				records: [],
				top: 10,
				sortBy: 'OPS',
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
			const pref_top = localStorage.getItem("pref_top");
			const pref_sortby = localStorage.getItem("pref_sortby");
			const pref_cols = localStorage.getItem("pref_cols");
			if (pref_top) this.top = parseInt(pref_top, 10);
			if (pref_sortby) this.sortBy = pref_sortby;
			if (pref_cols) this.cols = JSON.parse(pref_cols);

			this.fetch();
		},
		methods: {
			fetch() {
				this.loading = true;
				fetch(QUERY_SHEET_URL.replace(/\$\{sheetname\}/, 'game') + new Date().toString())
					.then(res => {
						if (res.status >= 400) throw new Error("Bad response from server");
						return res.json();
					})
					.then(arr => {
						var tableArr = JSON.stringify(
							arr
							// .filter(function(item) { return ['20170812-1', '20170812-2'].indexOf(item.game) > -1; })
							.sort(function(a, b) { return a.game.replace(/[^\d]/g, '') > b.game.replace(/[^\d]/g, ''); })
							.map(function(item) { return item.game; })
						);
						return Promise.all([
							QUERY_SHEET_URL.replace(/\$\{sheetname\}/, 'player') + new Date().toString(),
							QUERY_SHEET_URL.replace(/\$\{sheetname\}/, tableArr) + new Date().toString()
						].map(url => fetch(url))).then(responses => Promise.all(responses.map(res => res.json())));
					}).then(arr => {
						this.players = arr[0].map(item => item.player);
						arr[1].reverse();
						this.records = arr[1];
						this.loading = false;
					});
			},
			addPa() { this.top += 1; },
			minusPa() { this.top -= this.top > 1 ? 1 : 0; },
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
			}
		},
		computed: {
			inpNum: {
				get: function() {
					return this.top;
				},
				set: function(newValue) {
					this.top = newValue || 1;
				}
			},
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
			}
		},
		watch: {
			top(top) {
				localStorage.setItem("pref_top", top);

				this.list = utils.genStatistics(this.players, this.records, top)
					.filter(item => item.PA !== '-')
					.sort((a, b) => b[this.sortBy] - a[this.sortBy]);
			},
			records(records) {
				this.list = utils.genStatistics(this.players, records, this.top)
					.filter(item => item.PA !== '-')
					.sort((a, b) => b[this.sortBy] - a[this.sortBy]);
			},
			sortBy(sortBy) {
				this.cols.forEach(item => {
					if (Object.keys(item)[0] === sortBy) {
						item[Object.keys(item)[0]] = true;
					}
				});

				localStorage.setItem("pref_cols", JSON.stringify(this.cols));
				localStorage.setItem("pref_sortby", sortBy);

				this.list = utils.genStatistics(this.players, this.records, this.top)
					.filter(item => item.PA !== '-')
					.sort((a, b) => b[sortBy] - a[sortBy]);
			}
		}
	}
</script>