<script lang="ts">
	
	import { page } from '$app/stores';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	let email: string = '';
	let password: string = '';
	let errorMessage: string = '';

  	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();
		errorMessage = '';

		try {
		const response = await fetch('http://localhost:8080/login', { 
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const result = await response.json();

		if (response.ok) {
			localStorage.setItem('token', result.token);
			window.location.href = '/home';
		} else {
			errorMessage = result.error || 'Login failed';
		}
		} catch (error) {
		errorMessage = 'Network error or API is down';
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		Track your <br />Expense 
	</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<label>
		  Email:
		  <input type="email" bind:value={email} required />
		</label>
		<label>
		  Password:
		  <input type="password" bind:value={password} required />
		</label>
		<button type="submit">Login</button>
	  
		{#if errorMessage}
		  <p style="color: red;">{errorMessage}</p>
		{/if}
	  </form>
	  <p>Create a new account  <a href="/signUp">Sign Up</a></p>
	  

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
