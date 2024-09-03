<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let expenses = writable<{ id: number; categoryName: string; amount: number; description: string; expenseDate: string }[]>([]);
   
    onMount(async () => {
        fetchExpenses();
    });

    async function fetchExpenses(): Promise<void> {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/api/expenses', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            expenses.set(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

    async function deleteExpense(expenseId: number): Promise<void> {
        const confirmed = confirm('Are you sure you want to delete this expense?');
        if (!confirmed) return;

        try {
            const token = localStorage.getItem('token'); 

            const response = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Expense deleted successfully!');
                fetchExpenses(); 
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to delete expense.'}`);
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }

	function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
</script>

<section>
    <main>
		
		<h3><a href="/expense/create">Add expense</a></h3>
		{#if $expenses.length > 0}
			<table>
				<thead>
					<tr>
						<th>Category</th>
						<th>Amount</th>
						<th>Description</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each $expenses as expense}
						<tr>
							<td>{expense.categoryName}</td>
							<td>{expense.amount}</td>
							<td>{expense.description}</td>
							<td>{formatDate(expense.expenseDate)}</td>
							<td>
								<button on:click={() => deleteExpense(expense.id)}>Delete</button>
								<a href="/expense/update?expenseId={expense.id}">Edit</a>
							
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
    </main>
</section>

<style>
    main {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 1rem;
        border: 1px solid #ddd;
        text-align: left;
    }

    button {
        margin-right: 0.5rem;
    }
	h3 {
		color: black;
	}
</style>
