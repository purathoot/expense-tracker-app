<script lang="ts">
	
	import { page } from '$app/stores';
	import Head from '../../Header.svelte';
	import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation'; 

    let categories = writable<{ id: number; category_name: string }[]>([]);
    let selectedCategoryId = "";
    let amount = "";
    let description = "";
    let date = "";
   
	interface Category {
		id: number;
		category_name: string;
	}
    onMount(async () => {
        fetchCategories();
    });
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


    async function submitExpense() {
		const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/expenses/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryId: selectedCategoryId,
                amount: parseFloat(amount),
                description,
                expenseDate: date
            })
        });

        if (response.ok) {
            alert('Expense added successfully!');
            goto('/expense');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to add expense.'}`);
        }
    }
</script>

<svelte:head>
	<title>Expense - Expense Tracker</title>
	<meta name="description" content="Expense" />
</svelte:head>

<section>
	<main>
		<h1>Add New Expense</h1>

		<form on:submit|preventDefault={submitExpense}>
			<label for="category">Category:</label>
			<select bind:value={selectedCategoryId} required>
				<option value="" disabled>Select a category</option>
				{#each $categories as category}
					{#if category.id && category.category_name}
						<option value={category.id }>{category.category_name}</option>
					{/if}
				{/each}
			</select>

			<label for="amount">Amount:</label>
			<input type="number" step="0.01" bind:value={amount} required>

			<label for="description">Description:</label>
			<textarea bind:value={description}></textarea>

			<label for="date">Date:</label>
			<input type="date" bind:value={date} required>

			<button type="submit">Add Expense</button>
		</form>
	</main>
</section>

	<style>
		main {
			padding: 2rem;
			max-width: 600px;
			margin: 0 auto;
		}
		label {
			display: block;
			margin-bottom: 0.5rem;
		}
		input, textarea {
			width: 100%;
			padding: 0.5rem;
			margin-bottom: 1rem;
			box-sizing: border-box;
		}
		button {
			display: inline-block;
			padding: 0.75rem 1.5rem;
			background-color: #007bff;
			color: #fff;
			border: none;
			cursor: pointer;
		}
	
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

</style>
