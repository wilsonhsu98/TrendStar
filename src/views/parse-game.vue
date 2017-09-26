<template>
	<div class="parse-container">
		<button class="parse-btn" @click="importData">Parse Game</button>
		<div class="parse-item" v-for="(item, index) in list">
			<label :for="`chk${index}`">
				<input type="checkbox" :id="`chk${index}`" :disabled="item.disabled" :checked="item.checked" @change="toggleTodo(item.game)"/>
				{{ item.game }}
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
	import { mapGetters, mapActions } from 'vuex';

	export default {
		created () {
			this.$store.dispatch('fetchTwoOrigin');
		},
		methods: {
			...mapActions([
				'importData',
				'toggleTodo'
			])
		},
		computed: {
			...mapGetters({
				list: 'getSourceList',
				loading: 'getLoading'
			})
		}
	}
</script>