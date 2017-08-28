<template>
	<div>
		<input type="number" v-model="inpNum" min="0"/>
		<ol>
			<li v-for="item in list">
				{{ item.name }} - {{ item.OPS }}
			</li>
		</ol>
	</div>
</template>

<script>
import utils from "../libs/utils";
import { QUERY_SHEET_URL } from "../constants/index";

export default {
	data() {
		return {
			list: [],
			players: [],
			records: [],
			top: 10
		};
	},
	mounted() {
		this.fetch();
	},
	methods: {
		fetch() {
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
					this.list = utils.genStatistics(this.players, this.records, this.top)
						.filter(item => item.PA !== '-')
						.sort((a, b) => b.OPS - a.OPS);
				});
		}
	},
	computed:{
		inpNum:{
			get: function() {
				return this.top;
			},
			set: function(newValue) {
				this.top = newValue.replace(/[^\d]/g,'');
				this.list = utils.genStatistics(this.players, this.records, this.top)
					.filter(item => item.PA !== '-')
					.sort((a, b) => b.OPS - a.OPS);
			}
		}
	}
}
</script>

<style lang="scss">
.message {
	color: pink;
	font-size: 1.4em;
}
ol {
	list-style-type: decimal;
}
</style>