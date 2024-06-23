function setContractSize(value) {
    document.getElementById('contract_size').value = value;
}

function calculate() {
    const funds = parseFloat(document.getElementById('funds').value);
    const riskPerTrade = parseFloat(document.getElementById('risk_per_trade').value);
    const buyingPrice = parseFloat(document.getElementById('buying_price').value);
    const stopLoss = parseFloat(document.getElementById('stop_loss').value);
    const contractSize = parseFloat(document.getElementById('contract_size').value);

    if (isNaN(funds) || isNaN(riskPerTrade) || isNaN(buyingPrice) || isNaN(stopLoss) || isNaN(contractSize)) {
        alert("Please enter valid numbers");
        return;
    }

    if (funds < 0 || riskPerTrade < 0 || buyingPrice < 0 || stopLoss < 0 || contractSize < 0) {
        alert("Please enter non-negative numbers");
        return;
    }

    const positionSize = (buyingPrice * riskPerTrade) / (buyingPrice - stopLoss);
    const contractsToBuy = positionSize / (buyingPrice * contractSize);
    const tradingFees = positionSize * 0.001;
    const actualLossAfterSL = riskPerTrade + tradingFees;
    const breakevenPrice = buyingPrice + (((buyingPrice - stopLoss) / riskPerTrade) * tradingFees);

    document.getElementById('position_size').textContent = `Position Size : ${positionSize.toFixed(2)}`;
    document.getElementById('contracts_to_buy').textContent = `CONTRACTS TO BUY : ${contractsToBuy.toFixed(2)}`;
    document.getElementById('contracts_to_buy').classList.add('highlighted-background');
    document.getElementById('trading_fees').textContent = `Trading Fees : ${tradingFees.toFixed(2)}`;
    document.getElementById('actual_loss_after_sl').textContent = `Actual Loss After SL : ${actualLossAfterSL.toFixed(2)}`;
    document.getElementById('breakeven_price').textContent = `Breakeven Price : ${breakevenPrice.toFixed(2)}`;

    updateRRRTable(breakevenPrice, buyingPrice, stopLoss);
}

function updateRRRTable(bep, bp, slp) {
    const table = document.getElementById('rrr-table');
    const headerRow = table.querySelector('thead tr');
    const dataRow = table.querySelector('tbody tr');

    // Ensure the table has at least one row
    if (!headerRow || !dataRow) return;

    for (let i = 0; i < headerRow.cells.length; i++) {
        const columnNumber = i + 1; // Adjust for 1-based indexing
        const value = bep + (columnNumber * (bp - slp));
        dataRow.cells[i].textContent = value.toFixed(2);
    }
}

function addRRRColumn() {
    const table = document.getElementById('rrr-table');
    const headerRow = table.querySelector('thead tr');
    const dataRow = table.querySelector('tbody tr');

    // Ensure the table has at least one row
    if (!headerRow || !dataRow) return;

    const newColumnIndex = headerRow.cells.length + 1; // Adjust for 1-based indexing
    const columnNumber = newColumnIndex;

    const newHeaderCell = document.createElement('th');
    newHeaderCell.textContent = `1 : ${columnNumber}`;
    newHeaderCell.style.backgroundColor = '#2B7A78';
    newHeaderCell.style.color = 'white';
    headerRow.appendChild(newHeaderCell);

    const newDataCell = document.createElement('td');
    const bp = parseFloat(document.getElementById('buying_price').value);
    const slp = parseFloat(document.getElementById('stop_loss').value);
    const bep = parseFloat(document.getElementById('breakeven_price').textContent.split(': ')[1]);

    const value = bep + (columnNumber * (bp - slp));
    newDataCell.textContent = value.toFixed(2);
    dataRow.appendChild(newDataCell);
}

function removeLastRRRColumn() {
    const table = document.getElementById('rrr-table');
    const headerRow = table.querySelector('thead tr');
    const dataRow = table.querySelector('tbody tr');

    if (headerRow.cells.length > 5) { // Ensure we don't remove initial columns
        headerRow.deleteCell(-1);
        dataRow.deleteCell(-1);
    }
}

