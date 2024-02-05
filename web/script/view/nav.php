<style>
	.left-nav {
		position: fixed;
		left: 0;
		top: 0;
		width: 50px;
		height: 100vh;
	}

	.left-nav-item {
		text-align: center;
	}

	.left-nav-item>a {
		filter: grayscale(1) contrast(999) invert(1);
		line-height: 50px;
		height: 50px;
		display: block;
		font-size: larger;
		font-weight: 600;
	}
	.left-nav-item>a:hover {
		background: rgba(255,255,255,0.1);
		text-shadow: 0 0 5px #000;
	}
</style>
<nav class="left-nav navtopc">
	<div class="left-nav-item">
		<a id="naver"><?= view::icon("chat-dots") ?></a>
		<a><?= view::icon("people") ?></a>
	</div>
</nav>