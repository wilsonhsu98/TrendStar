<template>
	<div class="gamelist-container">
		<template v-for="item in games">
			<div>
				<router-link class="game" :to="{ path: `game/${item}` }">
					{{ item }}
				</router-link>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	.gamelist-container {
		text-align: center;
		// background-color: #FFF;
		> div {
			padding: 10px;
		}
		.game {
			color: $row_color;
			text-decoration: none;
			// display: inline-block;
		}
	}
</style>

<script>
	import { mapGetters, mapActions } from 'vuex';

	export default {
		data() {
			return {
			};
		},
		created() {
		},
		methods: {
			...mapActions({
			})
		},
		computed: {
			...mapGetters({
				games: 'games'
			})
		}
	}
</script>