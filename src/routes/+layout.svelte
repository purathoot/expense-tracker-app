<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import { page } from '$app/stores';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let token: string | null = null;

	onMount(() => {
		token = localStorage.getItem('token');
		if (!token) {
			goto('/');
		}
	});
</script>

<div class="app">
	{#if $page.url.pathname !== '/' && $page.url.pathname !== '/signUp'}
		<Header />
	{/if}
	<main>
		<slot />
	</main>

	<footer>
	
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
