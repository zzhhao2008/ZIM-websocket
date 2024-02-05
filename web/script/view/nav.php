<nav class="left-nav navtopc">
	<div class="left-nav-item">
		<button onclick="<?= jump_JS("/") ?>" data-bs-toggle="tooltip" data-bs-placement="right" title="消息列表">
			<?= nav_icon("chat-dots", "/") ?>
		</button>
		<button onclick="<?= jump_JS("/fmanage") ?>" data-bs-toggle="tooltip" data-bs-placement="right" title="好友/群管理">
			<?= nav_icon("people", "fmanage") ?>
		</button>

	</div>
	<div class="left-nav-item left-nav-item-bottom">
		<button onclick="<?= jump_JS("/themeset") ?>" data-bs-toggle="tooltip" data-bs-placement="right" title="主题设置">
			<?= nav_icon("brush", "themeset") ?>
		</button>
		<button onclick="<?= jump_JS("/profile") ?>" data-bs-toggle="tooltip" data-bs-placement="right" title="个人中心">
			<?= nav_icon("person", "profile") ?>
		</button>
	</div>
</nav>
