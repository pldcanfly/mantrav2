<nav>
	<div class="left">
		Mantra Raidplaner
		<div class="nav-container">
			<a href="/" class="nav-item"><span>Raids</span></a>
			<a href="/" class="nav-item"><span>Roster</span></a>
		</div>
	</div>
	<div class="right">
		Login
	</div>
</nav>

<style lang="scss">
	nav {
		padding: 0;
		min-height: 50px;
		z-index: 99;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;

		background-color: var(--c__lighter_background);
		box-shadow: var(--c__shadow);
		display: flex;
		align-items: stretch;
		//border: 1px solid green;

		.left,
		.right {
			display: flex;
			//border: 1px solid pink;
			align-items: center;
			padding: 0px;
			padding-left: 10px;
			padding-right: 10px;
			width: 50%;
		}

		.nav-container {
			padding-left: 10px;
			padding-right: 10px;
			display: flex;
			//border: solid 1px blue;
			height: 100%;
			align-items: stretch;
			justify-items: center;

			a {
				margin-left: 5px;
				margin-right: 5px;
				padding-left: 10px;
				padding-right: 10px;
				height: 100%;
				display: flex;
				align-items: center;
				justify-items: center;

				transition: background-color 0.2s linear;

				&:hover {
					//background-color: var(--c__background);
					box-shadow: var(--c__shadow);
				}
			}
		}
	}
</style>
