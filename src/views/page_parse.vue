<template>
	<div class="parse-container">
		<button class="parse-btn" @click="importData">
			Batch Upload&nbsp;<i class="fa fa-cloud-upload" style="vertical-align: middle;"></i>
		</button>
		<div class="parse-item" v-for="(item, index) in list">
			<label :for="`chk${index}`">
				<input type="checkbox" :id="`chk${index}`" :disabled="item.disabled" :checked="item.checked" @change="toggleTodo(item.game)"/>
				{{ item.game }}
			</label>
			<button :disabled="!item.disabled" class="parse-btn" style="padding: 4px 6px;" @click="importOneGame(item.game)">
				Re-upload&nbsp;<i class="fa fa-cloud-upload" style="vertical-align: middle;"></i>
			</button>
		</div>
		<loading v-if="loading"></loading>
	</div>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	.parse-container {
		padding: 10px;
		text-align: center;
	}
	.parse-item {
		margin: 10px 0;
	}
	.parse-btn {
		border-radius: 5px;
		background-color: $header_bgcolor;
		color: white;
		border: 1px solid transparent;
		padding: 10px 20px;
		&:focus {
			outline: none;
		}
		&:disabled {
			opacity: .3;
		}
	}
</style>

<script>
	import { mapGetters, mapActions } from 'vuex';

	export default {
		created () {
			this.fetchTwoOrigin();
		},
		methods: {
			...mapActions([
				'fetchTwoOrigin',
				'importData',
				'importOneGame',
				'toggleTodo'
			])
		},
		computed: {
			...mapGetters({
				list: 'getSourceList',
				loading: 'loading'
			})
		}
	}
</script>