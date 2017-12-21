<template>
	<header/>
</template>

<style lang="scss" scoped>
	@import "../scss/variable";

	header {
		display: none;
	}
	@media only screen and (max-width: 760px) {
		header {
			display: block;
			background: $header_bgcolor url(../images/icon.png) center 2px no-repeat;
			background-size: 55px auto;
			height: 50px;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 1;
		}
	}
</style>