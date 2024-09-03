<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

	Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

	let chart: Chart | null = null;
	let chartData: number[] = [];
	let chartLabels: string[] = [];

	interface ApiResponse {
		labels: string[];
		values: number[];
	}

	async function fetchData(): Promise<void> {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/api/reports/total-expenses-per-category/september', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();
         
            chartLabels = data.labels;
            chartData = data.values;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

	onMount(async () => {
		await fetchData();

		const ctx = document.getElementById('myChart') as HTMLCanvasElement | null;
		if (ctx) {
			chart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: chartLabels,
					datasets: [{
						label: 'Total Expense',
						data: chartData,
						borderColor: 'rgba(75, 192, 192, 1)',
						fill: false,
					}]
				},
				options: {
					scales: {
						y: {
							beginAtZero: true
						}
					}
				}
			});
		}
	});

	
	$: if (chart) {
		chart.data.labels = chartLabels;
		chart.data.datasets[0].data = chartData;
		chart.update();
	}
</script>

<canvas id="myChart" width="400" height="200"></canvas>

<style>
	canvas {
		max-width: 100%;
	}
</style>
