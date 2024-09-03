<script lang="ts">
	
	import { page } from '$app/stores';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import Head from '../Header.svelte';


	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let categoryName = '';
	let success = '';
	let categories = writable<{ id: number; categoryName: string }[]>([]);
	let errorMessage = writable<string | null>(null);

	interface Category {
		id: number;
		categoryName: string;
	}

	async function fetchCategories(): Promise<void> {
		try {
			const token = localStorage.getItem('token');

			const response = await fetch('http://localhost:8080/api/categories', {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: Category[] = await response.json();
			categories.set(data);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	}

	async function addCategory(): Promise<void> {
		if (!categoryName) {
			errorMessage.set('Category Name is required');
			return;
		}

		try {
			const token = localStorage.getItem('token'); 

			const response = await fetch('http://localhost:8080/api/categories/', {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					categoryName
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log('Category added:', result);
			categoryName = '';
			errorMessage.set(null);
			success = "Created successfully.";
		} catch (error) {
			console.error('Error adding category:', error);
			errorMessage.set('Failed to add category');
		}
	}

	onMount(() => {
		fetchCategories();
	});
</script>

<svelte:head>
	<title>Category</title>
	<meta name="description" content="Categories" />
</svelte:head>

<section>
	<div>
		{#if success}
			<p>{success}</p>
		{/if}
		<h1>Add Category</h1>
		<form on:submit|preventDefault={addCategory}>
			<label for="name">Name:</label>
			<input
				id="name"
				type="text"
				bind:value={categoryName}
				placeholder="Enter category name"
			/>
	
			<button type="submit">Add Category</button>
		</form>
	
		{#if $errorMessage}
			<p style="color: red;">{$errorMessage}</p>
		{/if}
	</div>
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
