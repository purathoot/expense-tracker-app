<script lang="ts">
    import { onMount } from 'svelte';
    import { Chart, registerables } from 'chart.js';

    Chart.register(...registerables);

    
    interface ChartData {
        labels: string[];
        values: number[];
    }

    let chartData: ChartData = { labels: [], values: [] };
    let chart: Chart | null = null;

    onMount(async () => {
        try {
          
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/api/reports/total-expenses-per-user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data: ChartData = await response.json();

            chartData.labels = data.labels;
            chartData.values = data.values;

           
            if (chart) {
                chart.destroy();
            }
            const ctx = document.getElementById('expbBarChart') as HTMLCanvasElement;
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Total Expenses',
                        data: chartData.values,
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

<canvas id="expbBarChart" width="400" height="200"></canvas>

<style>
    canvas {
        max-width: 100%;
    }
</style>
