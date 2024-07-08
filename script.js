let gameSets = [10, 100, 1000, 10000];
let currentGameSet = 0;
let currentRound = 0;
let results = [];

function startGame() {
    currentGameSet = 0;
    currentRound = 0;
    results = [];
    document.getElementById('summary').style.display = 'none';
    document.getElementById('roundResults').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    startRound();
}

function startRound() {
    if (currentGameSet >= gameSets.length) {
        showSummary();
        return;
    }
    if (currentRound >= 5) {
        currentGameSet++;
        currentRound = 0;
        startRound();
        return;
    }
    let amount = gameSets[currentGameSet];
    document.getElementById('gameSet').innerText = currentGameSet + 1;
    document.getElementById('round').innerText = currentRound + 1;
    document.getElementById('amount').innerText = amount;
    document.getElementById('offer').value = '';
    document.getElementById('result').innerText = '';
    document.getElementById('waitingMessage').style.display = 'none';
}

function makeOffer() {
    let amount = gameSets[currentGameSet];
    let offer = parseInt(document.getElementById('offer').value);
    if (isNaN(offer) || offer < 0 || offer > amount) {
        alert("Please enter a valid offer.");
        return;
    }
    document.getElementById('waitingMessage').style.display = 'block';
    setTimeout(() => {
        let response = getResponse(amount, offer);
        let resultText = `Offer: $${offer}, Response: ${response ? 'Accepted' : 'Rejected'}`;
        let userKeeps = response ? offer : 0;
        let responderGets = response ? amount - offer : 0;
        document.getElementById('result').innerText = resultText;
        document.getElementById('waitingMessage').style.display = 'none';
        results.push({ gameSet: currentGameSet + 1, round: currentRound + 1, amount, offer, response, userKeeps, responderGets });
        displayRoundResults();
        currentRound++;
        setTimeout(startRound, 0);
    }, Math.random() * 0 + 0); // 3-5 seconds delay
}

function getResponse(amount, offer) {
    let percentage = (offer / amount) * 100;
    if (percentage >= 50) return true;
    if (percentage >= 40 && Math.random() <= 0.4) return true;
    if (percentage >= 30 && Math.random() <= 0.3) return true;
    if (percentage >= 20 && Math.random() <= 0.2) return true;
    if (percentage >= 10 && Math.random() <= 0.1) return true;
    return false;
}

function displayRoundResults() {
    document.getElementById('roundResults').style.display = 'block';
    let roundResultsList = document.getElementById('roundResultsList');
    roundResultsList.innerHTML = '';
    results.forEach(result => {
        roundResultsList.innerHTML += `
            <div>
                <p>Game Set ${result.gameSet}, Round ${result.round}</p>
                <p>Offer: $${result.offer}, Response: ${result.response ? 'Accepted' : 'Rejected'}</p>
                <p>You: $${result.responderGets}, Your partner: $${result.userKeeps}</p>
            </div>
            <hr>
        `;
    });
}

function showSummary() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('roundResults').style.display = 'none';
    document.getElementById('summary').style.display = 'block';
    let summary = '';
    let totalScore = 0;
    results.forEach(result => {
        summary += `
            <div>
                <p>Game Set ${result.gameSet}, Round ${result.round}</p>
                <p>Offer: $${result.offer}, Response: ${result.response ? 'Accepted' : 'Rejected'}</p>
                <p>User Keeps: $${result.userKeeps}, Responder Gets: $${result.responderGets}</p>
            </div>
            <hr>
        `;
        if (result.response) totalScore += result.userKeeps;
    });
    summary += `<br><strong>Total Score: $${totalScore}</strong>`;
    document.getElementById('summaryResults').innerHTML = summary;
}

startGame();
