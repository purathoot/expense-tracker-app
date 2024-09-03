<script lang="ts">
    import { onMount } from 'svelte';
    import { Chart, registerables } from 'chart.js';

 
    Chart.register(...registerables);


interface DayExpenses {
	[date: string]: string;
}

interface ApiResponse {
	days: DayExpenses;
	total_expenses: number;
	average_daily_expenses: number;
}

interface ChartData {
	date: string;
	totalAmount: number;
}

let chartData: ChartData[] = [];
let chart: Chart | null = null;

onMount(async () => {
	try {
	
		const token = localStorage.getItem('token');

		const response = await fetch('http://localhost:8080/api/reports/average-daily-expenses/september', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		const data: ApiResponse = await response.json();

		chartData = Object.entries(data.days).map(([date, amount]) => ({
			date,
			totalAmount: parseFloat(amount)
		}));

		
		if (chart) {
			chart.destroy();
		}
		const ctx = document.getElementById('barChart') as HTMLCanvasElement;
		chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: chartData.map(d => d.date),
				datasets: [{
					label: 'Daily Expenses',
					data: chartData.map(d => d.totalAmount),
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					borderColor: 'rgba(75, 192, 192, 1)',
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				scales: {
					x: {
						beginAtZero: true
					},
					y: {
						beginAtZero: true
					}
				}
			}
			});
		} catch (error) {
			console.error('Error fetching or processing data:', error);
		}
	});
</script>

<canvas id="barChart" width="400" height="200"></canvas>

<style>
    canvas {
        max-width: 100%;
    }
</style>
