function generateInputs() {
    const n = document.getElementById("numRespondents").value;
    const container = document.getElementById("inputs");
    container.innerHTML = "";

    for (let i = 0; i < n; i++) {
        container.innerHTML += `
            <h4>Respondent ${i + 1}</h4>
            Driving: <input type="number" class="drive"><br>
            Journey: <input type="number" class="journey"><br>
            Food: <input type="number" class="food"><br>
            Cost: <input type="number" class="cost"><br><br>
        `;
    }
}

function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function calculate() {
    const drive = Array.from(document.getElementsByClassName("drive")).map(i => Number(i.value));
    const journey = Array.from(document.getElementsByClassName("journey")).map(i => Number(i.value));
    const food = Array.from(document.getElementsByClassName("food")).map(i => Number(i.value));
    const cost = Array.from(document.getElementsByClassName("cost")).map(i => Number(i.value));

    const avg_drive = mean(drive);
    const avg_journey = mean(journey);
    const avg_food = mean(food);
    const avg_cost = mean(cost);

    const w1 = Number(document.getElementById("w1").value);
    const w2 = Number(document.getElementById("w2").value);
    const w3 = Number(document.getElementById("w3").value);
    const w4 = Number(document.getElementById("w4").value);

    // Utilities
    const U_self = w1*(avg_drive+1) + w2*(avg_journey) + w3*(avg_food-1) + w4*(avg_cost-1);
    const U_ehail = w1*(avg_drive-1) + w2*(avg_journey+1) + w3*(avg_food) + w4*(avg_cost);
    const U_public = w1*(avg_drive-2) + w2*(avg_journey-1) + w3*(avg_food+1) + w4*(avg_cost+1);
    const U_carpool = w1*(avg_drive) + w2*(avg_journey) + w3*(avg_food) + w4*(avg_cost+0.5);

    // Logit
    const exp_self = Math.exp(U_self);
    const exp_ehail = Math.exp(U_ehail);
    const exp_public = Math.exp(U_public);
    const exp_carpool = Math.exp(U_carpool);

    const total = exp_self + exp_ehail + exp_public + exp_carpool;

    const P_self = exp_self / total;
    const P_ehail = exp_ehail / total;
    const P_public = exp_public / total;
    const P_carpool = exp_carpool / total;

    // Display
    document.getElementById("output").innerText =
        `Self-driving: ${P_self.toFixed(4)}
E-hailing: ${P_ehail.toFixed(4)}
Public: ${P_public.toFixed(4)}
Carpool: ${P_carpool.toFixed(4)}`;

    drawChart([P_self, P_ehail, P_public, P_carpool]);
}

let chart;

function drawChart(data) {
    const ctx = document.getElementById('chart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Self-driving', 'E-hailing', 'Public', 'Carpool'],
            datasets: [{
                label: 'Probability',
                data: data
            }]
        }
    });
}