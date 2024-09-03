<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
  
	let name: string = '';
	let email: string = '';
	let password: string = '';
	let confirmPassword: string = '';
	let errorMessage: string = '';
  
	async function handleSubmit(event: Event): Promise<void> {
	  event.preventDefault();
  
	  if (password !== confirmPassword) {
		errorMessage = 'Passwords do not match';
		return;
	  }
  
	  try {
		const response = await fetch('http://localhost:8080/register', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ name, email, password }),
		});
  
		if (!response.ok) {
		  const errorData = await response.json();
		  errorMessage = errorData.message || 'An error occurred';
		  return;
		}
  
		const data = await response.json();
		
		const token = data.token;
  
		localStorage.setItem('authToken', token);
  
		goto('/');
	  } catch (error) {
		errorMessage = 'Failed to connect to the server';
	  }
	}
  </script>
  
  <form on:submit={handleSubmit}>
	<div>
	  <label for="name">Name</label>
	  <input type="text" id="name" bind:value={name} required />
	</div>
	<div>
	  <label for="email">Email</label>
	  <input type="email" id="email" bind:value={email} required />
	</div>
	<div>
	  <label for="password">Password</label>
	  <input type="password" id="password" bind:value={password} required />
	</div>
	<div>
	  <label for="confirmPassword">Confirm Password</label>
	  <input type="password" id="confirmPassword" bind:value={confirmPassword} required />
	</div>
	{#if errorMessage}
	  <p style="color: red;">{errorMessage}</p>
	{/if}
	<button type="submit">Sign Up</button>
  </form>
  