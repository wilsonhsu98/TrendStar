<template>
	<div>
		<div class="dec button" @click="minus"></div><!--
		--><input type="number" class="input" v-model.number="num" min="1"><!--
		--><div class="inc button" @click="plus"></div>
	</div>
</template>

<style lang="scss" scoped>
	.input {
		width: 40px;
		padding: 3px 0 0 0;
		text-align: center;
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
</style>

<script>
	export default {
		props: ['value'],
		data() {
			return {
				val: this.value
			}
		},
		methods: {
			plus() { this.val += 1; },
			minus() { this.val -= this.val > 1 ? 1 : 0; }
		},
		computed: {
			num: {
				get: function() {
					this.$emit('change', this.val);
					return this.val;
				},
				set: function(newValue) {
					this.val = newValue || 1;
				}
			}
		}
	}
</script>