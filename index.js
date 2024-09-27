async function initialFetchCloudWatchData() {
    let baseURL = "https://x36h4lqlfi.execute-api.us-east-1.amazonaws.com/testing/yamlcloudwatchtest";
    try {
       let response = await fetch(baseURL);
        if (!response.ok) {
            return {
                "errorMessage": response,
                "result": false
            }
        } else {
            let cloudWatchData = await response.json();
            return {
                "data": cloudWatchData,
                "result": true
            }
        }
    } catch (err) {
        return {
            "errorMessage": err,
            "result": false
        }
    }

}

async function displayMetricTableData() {
    let loadingModal = document.createElement("p");
    loadingModal.innerHTML = "loading . . .";
    let sectionHeader = document.querySelector(".loading");
    sectionHeader.append(loadingModal);
    
    let data = await initialFetchCloudWatchData();
    if (!data.result) {
        sectionHeader.removeChild(loadingModal);
        let error = document.createElement("p");
        error.innerHTML = `Error: ${data.errorMessage.status}`;
        sectionHeader.appendChild(error);
        return;
    } else {
        sectionHeader.removeChild(loadingModal);
        let metricDataResults = data.data.MetricDataResults.length;

        // Prepare data for the chart
        let labels = data.data.MetricDataResults[0].Timestamps;
        let datasets = [];

        for (let i = 0; i < metricDataResults; i++) {
            let metricData = data.data.MetricDataResults[i];
            datasets.push({
                label: cleanMetricName(metricData.Id),
                data: metricData.Values,
                borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
                fill: false
            });
            newCreateTable(metricData); // Keep your existing table creation
        }

        // Create the chart
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Values'
                        }
                    }
                }
            }
        });
    }
}
