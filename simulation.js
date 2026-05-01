const PI = 3.14;
let computed = {};

function f(x) {
    let expr = document.getElementById("func").value;
    try {
        return eval(expr);
    } catch {
        return 0;
    }
}

// Numerical integration (simple trapezoidal)
function integrate(func, a, b, steps = 1000) {
    let h = (b - a) / steps;
    let sum = 0;

    for (let i = 0; i < steps; i++) {
        let x1 = a + i * h;
        let x2 = x1 + h;
        sum += (func(x1) + func(x2)) / 2 * h;
    }

    return sum;
}

function calculateFourier() {
    let L = parseFloat(document.getElementById("L").value);
    let nTerms = parseInt(document.getElementById("terms").value);

    if (!L || !nTerms) {
        alert("Enter valid L and number of terms");
        return;
    }

    // a0
    let a0 = (1 / L) * integrate(f, -L, L);

    let an = [];
    let bn = [];

    for (let n = 1; n <= nTerms; n++) {

        let a_n = (1 / L) * integrate(x => f(x) * Math.cos(n * PI * x / L), -L, L);
        let b_n = (1 / L) * integrate(x => f(x) * Math.sin(n * PI * x / L), -L, L);

        an.push(a_n);
        bn.push(b_n);
    }

    computed = { a0, an, bn };

    // Build series string
    let series = `f(x) ≈ ${a0.toFixed(3)}/2`;

    for (let n = 1; n <= nTerms; n++) {
        series += ` + (${an[n-1].toFixed(3)})cos(${n}πx/${L})`;
        series += ` + (${bn[n-1].toFixed(3)})sin(${n}πx/${L})`;
    }

    document.getElementById("output").innerHTML = `
        <b>Fourier Series:</b><br>${series}
    `;
}

function checkAnswer() {

    let ua0 = parseFloat(document.getElementById("user_a0").value);
    let uan = parseFloat(document.getElementById("user_an").value);
    let ubn = parseFloat(document.getElementById("user_bn").value);

    let tol = 0.1;

    let correct =
        Math.abs(ua0 - computed.a0) < tol &&
        Math.abs(uan - computed.an[0]) < tol &&
        Math.abs(ubn - computed.bn[0]) < tol;

    if (correct) {
        document.getElementById("output").innerHTML += `
            <br><span style="color:green;"><b>✔ Correct! You scored 1 point</b></span>
        `;
    } else {
        document.getElementById("output").innerHTML += `
            <br><span style="color:red;"><b>❌ Incorrect. Try again.</b></span>
        `;
    }
}
