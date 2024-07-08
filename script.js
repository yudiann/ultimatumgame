let currentRound = 1;
let totalRounds = 5; // Total rounds per game
let totalScore = 0;
let gameAmounts = [10, 100, 1000, 10000];
let currentGameIndex = 0;
let gameAmount = gameAmounts[currentGameIndex];
let results = [];

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('submit-offer').addEventListener('click', submitOffer);
document.getElementById('export-results').addEventListener('click', exportResults);

function resetGame() {
        currentRound = 1;
        totalScore = 0;
        currentGameIndex = 0;
        gameAmount = gameAmounts[currentGameIndex];
        updateRoundInfo();
        updateTotalScore();
        document.getElementById('results-display').innerText = '';
        document.getElementById('offer-section').style.display = 'none';
        document.getElementById('start-game').style.display = 'block';
        document.getElementById('export-results').style.display = 'none';
        results = [];
}

function updateRoundInfo() {
    document.getElementById('round-info').innerText = `Round: ${currentRound} (Amount: $${gameAmount})`;
}

function updateTotalScore() {
    document.getElementById('total-score').innerText = `Total Score: ${totalScore}`;
}

function startGame() {
    document.getElementById('start-game').style.display = 'none';
    document.getElementById('offer-section').style.display = 'block';
    updateRoundInfo();
    updateTotalScore();
}

function submitOffer() {
    let offer = parseInt(document.getElementById('offer-amount').value);
    let playerName = document.getElementById('player-name').value.trim();

    if (playerName === "") {
        alert('Please enter your name.');
        document.getElementById('offer-section').style.display = 'block';
        return;
    }

    if (isNaN(offer) || offer < 0 || offer > gameAmount) {
        alert(`Invalid offer. Please enter a number between 0 and ${gameAmount}`);
        document.getElementById('offer-section').style.display = 'block';
        return;
    }

    document.getElementById('offer-section').style.display = 'none';
    document.getElementById('waiting-message').style.display = 'block';

    // Simulate the responder taking 5-7 seconds before responding
    setTimeout(() => {
        let acceptance = computerDecision(offer, gameAmount);

        let resultMessage;
        if (acceptance) {
            resultMessage = `Round ${currentRound}: Offer accepted. You get $${gameAmount - offer}, Responder gets $${offer}.`;
            totalScore += (gameAmount - offer);
        } else {
            resultMessage = `Round ${currentRound}: Offer rejected. Both players get $0.`;
        }

        results.push({
            player: playerName,
            round: currentRound,
            gameAmount: gameAmount,
            offer: offer,
            accepted: acceptance,
            playerEarnings: acceptance ? gameAmount - offer : 0,
            responderEarnings: acceptance ? offer : 0
        });

        displayResults(resultMessage);

        currentRound++;
        document.getElementById('waiting-message').style.display = 'none';

        // Check if current game rounds are completed
        if (currentRound > totalRounds) {
            currentGameIndex++;
            if (currentGameIndex < gameAmounts.length) {
                gameAmount = gameAmounts[currentGameIndex];
                currentRound = 1;
                updateRoundInfo();
                updateTotalScore();
                document.getElementById('offer-section').style.display = 'block';
            } else {
                alert(`All games completed! Your total score is $${totalScore}.`);
                document.getElementById('export-results').style.display = 'block';
            }
        } else {
            updateRoundInfo();
            document.getElementById('offer-section').style.display = 'block';
        }

    }, (Math.random() * 0) * 1000); // Delay between 5 to 7 seconds
}

function computerDecision(offer, totalAmount) {
    if (offer >= totalAmount * 0.5) {
        return true;
    }

    const acceptanceThresholds = [
        { threshold: totalAmount * 0.4, probability: 0.4 },
        { threshold: totalAmount * 0.3, probability: 0.3 },
        { threshold: totalAmount * 0.2, probability: 0.2 },
        { threshold: totalAmount * 0.1, probability: 0.1 }
    ];

    for (let i = 0; i < acceptanceThresholds.length; i++) {
        if (offer >= acceptanceThresholds[i].threshold) {
            return Math.random() < acceptanceThresholds[i].probability;
        }
    }
    return false;
}

function displayResults(result) {
    document.getElementById('results-display').innerText += `${result}\n`;
}

function exportResults() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Player,Round,Game Amount,Offer,Accepted,Player Earnings,Responder Earnings\n";
    results.forEach(result => {
        let row = `${result.player},${result.round},${result.gameAmount},${result.offer},${result.accepted},${result.playerEarnings},${result.responderEarnings}`;
        csvContent += row + "\n";
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ultimatum_game_results.csv");
    document.body.appendChild(link);

    link.click();
}
