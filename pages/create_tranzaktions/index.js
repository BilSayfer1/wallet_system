import { postRequest } from '/lib/http.js';



const header = document.getElementById('main-header');

const glavHeader = document.createElement('div');
glavHeader.className = 'glav_header';

const leftMenu = document.createElement('div');
leftMenu.className = 'left';

const mainLink = document.createElement('a');
mainLink.href = '#';
mainLink.textContent = 'Главная';

const walletsLink = document.createElement('a');
walletsLink.href = '#';
walletsLink.textContent = 'Мои Кошельки';

const transactionsLink = document.createElement('a');
transactionsLink.href = '#';
transactionsLink.textContent = 'Мои транзакции';

transactionsLink.onclick = () => {
    location.assign('/pages/create_tranzaktions/');
};

leftMenu.append(mainLink);
leftMenu.append(walletsLink);
leftMenu.append(transactionsLink);

const rightMenu = document.createElement('div');
rightMenu.className = 'right';

const storedEmail = localStorage.getItem('email') || '';

const userEmailLink = document.createElement('a');
userEmailLink.href = '#';
userEmailLink.textContent = storedEmail;

const logoutIcon = document.createElement('img');
logoutIcon.src = '/images/icons8-выход-50.png';
logoutIcon.onclick = () => {
    localStorage.clear(); 
    location.assign('/pages/sign_in/');
};

rightMenu.append(userEmailLink);
rightMenu.append(logoutIcon);

glavHeader.append(leftMenu);
glavHeader.append(rightMenu);

header.append(glavHeader);


let form = document.getElementById('transactionForm');
let walletInput = document.getElementById('wallet');
let amountInput = document.getElementById('amount');
let categoryInput = document.getElementById('category');
let transactionsTable = document.getElementById('transactionsTable');

form.onsubmit = async function(event) {
    event.preventDefault();
    let walletName = walletInput.value.trim();
    let amount = parseFloat(amountInput.value.trim());
    let category = categoryInput.value.trim();

    if (!walletName || isNaN(amount) || !category) {
        alert('Все поля должны быть заполнены');
        return;
    }

    let transaction = {
        wallet: walletName,
        amount: amount,
        category: category,
        date: new Date().toISOString()
    };

    try {
        console.log('Sending request to create transaction:', transaction);
        const data = await postRequest('/tanzaktions', transaction);

        if (!data) {
            throw new Error('Failed to create transaction');
        }

        console.log('Transaction created:', data);
        appendTransactionToTable(data);
        document.getElementById('transactionForm').reset();
    } catch (error) {
        console.error('Ошибка:', error);
    }
};

function appendTransactionToTable(transaction) {
    const row = document.createElement('div');
    row.className = 'row';

    const idCell = document.createElement('div');
    idCell.className = 'cell';
    idCell.textContent = transaction.id;

    const walletCell = document.createElement('div');
    walletCell.className = 'cell';
    walletCell.textContent = transaction.wallet;

    const categoryCell = document.createElement('div');
    categoryCell.className = 'cell';
    categoryCell.textContent = transaction.category;

    const amountCell = document.createElement('div');
    amountCell.className = 'cell';
    amountCell.textContent = transaction.amount;

    const dateCell = document.createElement('div');
    dateCell.className = 'cell';
    dateCell.textContent = new Date(transaction.date).toLocaleString();

    row.appendChild(idCell);
    row.appendChild(walletCell);
    row.appendChild(categoryCell);
    row.appendChild(amountCell);
    row.appendChild(dateCell);

    transactionsTable.appendChild(row);
}
