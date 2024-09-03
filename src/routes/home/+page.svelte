<script lang="ts">
	
	import { page } from '$app/stores';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import Head from '../Header.svelte';
    import LineChart from '../components/LineChart.svelte';
	import BarChart from '../components/BarChart.svelte';
	import ExpenseBarChart from '../components/ExpenseBarChart.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h3>Total expenses per category for September</h3>
	<LineChart/>
	<h3>Average daily expenses for a specific month</h3>
	<BarChart/>
	<h3>Total expenses per category for a specific user</h3>
	<ExpenseBarChart/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
