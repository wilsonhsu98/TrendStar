<template>
	<div class="parse-container">
		<button class="parse-btn" @click="push">Parse Game</button>
		<div class="parse-item" v-for="(item, index) in sourceTables">
			<label :for="`chk${index}`">
				<input type="checkbox" :value="item" :id="`chk${index}`" :disabled="myTables.indexOf(item) > -1" v-model="chkItems"/>
				{{ item }}
			</label>
		</div>
		<loading v-if="loading"></loading>
	</div>
</template>

<style lang="scss">
	@import "../scss/base";

	.parse-container {
		padding: 10px;
		text-align: center;
	}
	.parse-item {
		margin: 10px 0;
	}
	.parse-btn {
		border-radius: 5px;
		border-color: #5cb85c;
		background-color: #5cb85c;
		color: white;
		border: 1px solid;
		padding: 10px 20px;
		&:focus {
			outline: none;
		}
	}
</style>

<script>
	import utils from "../libs/utils";
	import { GET_URL, TEDDY, POST_URL } from "../constants/index";

	export default {
		data() {
			return {
				myTables: [],
				sourceTables: [],
				todoTables: [],
				summaryTable: [],
				loading: false
			};
		},
		mounted() {
			this.fetch();
		},
		methods: {
			fetch() {
				this.loading = true;
				Promise.all(
					[
						GET_URL({action: 'sheets'}),
						GET_URL({fileId: TEDDY, action: 'sheets'}),
						GET_URL({fileId: TEDDY, sheetname: '比賽結果'})
					].map(url => fetch(url).then(res => {
						if (res.status >= 400) throw new Error("Bad response from server");
						return res.json();
					}))
				).then(arr => {
					this.myTables = arr[0].filter(item => item.match(/\d{8}-\d{1}/g));
					this.sourceTables = arr[1]
						.filter(item => item.match(/\d{8}-\d{1}/g))
						.sort((a, b) => {
							return parseInt(b.match(/\d/g).join(''), 10) - parseInt(a.match(/\d/g).join(''), 10)
						});
					this.summaryTable = arr[2];
					this.todoTables = [];
					this.loading = false;
				}).catch(err => {
					alert(err);
					this.loading = false;
				});
			},
			push() {
				this.loading = true;
				Promise.all(
					this.todoTables.map(table => {
						return fetch(GET_URL({action: '2DArray', fileId: TEDDY, sheetname: table}))
							.then(res => {
								if (res.status >= 400) throw new Error("Bad response from server");
								return res.json();
							})
							.then(json => {
								return { result: json, table: table };
							});
					})
				).then(arr => {
					return Promise.all(arr.map(obj => {
						const newData = utils.parseGame(obj.result);
						let params = new FormData();
						params.append("sheetname", obj.table);
						params.append("data", JSON.stringify(newData));
						return fetch(POST_URL, {
								method: 'POST',
								body: params
							})
							.then(res => {
								if (res.status >= 400) throw new Error("Bad response from server");
								return res.json();
							})
							.then(json => {
								return { result: json, table: obj.table };
							});
					}));
				}).then(res => {
					const gameData = res.map(game => {
						const findGame = this.summaryTable.find(item => item['場次'] === game.table);
						return {
							game: game.table,
							result: ['win', 'lose', 'tie'][['勝', '敗', '和'].indexOf(findGame['結果'])],
							year: findGame['年度'],
							season: findGame['季度']
						}
					});
					let params = new FormData();
					params.append("sheetname", 'game');
					params.append("data", JSON.stringify(gameData));
					return fetch(POST_URL, {
							method: 'POST',
							body: params
						})
						.then(res => {
							if (res.status >= 400) throw new Error("Bad response from server");
							return res.json();
						});
				}).then(res => {
					this.loading = false;
					this.fetch();
				}).catch(err => {
					alert(err);
					this.loading = false;
				});
			}
		},
		computed: {
			chkItems: {
				get: function() {
					return this.todoTables.concat(this.sourceTables.filter(item => this.myTables.indexOf(item) > -1));
				},
				set: function(newValue) {
					var old = this.sourceTables.filter(item => this.myTables.indexOf(item) > -1);
					var newAdd = newValue.find(item => {
						return old.indexOf(item) === -1 &&
							this.todoTables.indexOf(item) === -1
					});
					var remove = this.todoTables.find(item => {
						return newValue.indexOf(item) === -1
					});
					if (newAdd) {
						this.todoTables.push(newAdd);
					} else {
						this.todoTables.splice(this.todoTables.indexOf(remove), 1);
					}
				}
			}
		}
	}
</script>