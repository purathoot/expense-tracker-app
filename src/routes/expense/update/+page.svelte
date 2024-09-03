<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation'; // Import the goto function

    let expenseId: string | null = null;
    let selectedCategoryId = "";
    let amount = "";
    let description = "";
    let date = "";
  

    let categories = writable<{ id: number; category_name: string }[]>([]);

    interface Category {
        id: number;
        category_name: string;
    }

    onMount(() => {
        const params = new URLSearchParams($page.url.search);
        expenseId = params.get('expenseId');
        
        if (expenseId) {
            fetchExpenseDetails(expenseId);
        }
        
        fetchCategories();
    });

    async function fetchCategories(): Promise<void> {
        try {
            let token = localStorage.getItem('token');
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

    async function fetchExpenseDetails(expenseId: string): Promise<void> {
        try {
            let token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const expense = await response.json();
                selectedCategoryId = expense.category_id;
                amount = expense.amount.toString();
                description = expense.description;
                const expenseDate = new Date(expense.expense_date);
                date = expenseDate.toISOString().split('T')[0];
            } else {
                console.error('Failed to fetch expense details');
            }
        } catch (error) {
            console.error('Error fetching expense details:', error);
        }
    }

    async function updateExpense() {
        let token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
                method: 'PUT',
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
                alert('Expense updated successfully!');
                goto('/expense');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to update expense.'}`);
            }
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    }
</script>

<svelte:head>
    <title>Expense - Expense Tracker</title>
    <meta name="description" content="Update Expense" />
</svelte:head>

<section>
    <main>
        <h1>Update Expense</h1>

        <form on:submit|preventDefault={updateExpense}>
            <label for="category">Category:</label>
            <select bind:value={selectedCategoryId} required>
                <option value="" disabled>Select a category</option>
                {#each $categories as category}
                    <option value={category.id}>{category.category_name}</option>
                {/each}
            </select>

            <label for="amount">Amount:</label>
            <input type="number" step="0.01" bind:value={amount} required>

            <label for="description">Description:</label>
            <textarea bind:value={description}></textarea>

            <label for="date">Date:</label>
            <input type="date" bind:value={date} required>

            <button type="submit">Update Expense</button>
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
    input, textarea, select {
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
</style>
