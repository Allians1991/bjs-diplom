'use strict';


// Деавторизация пользователя
let logoutUser = new LogoutButton();
logoutUser.action =  () => {
    ApiConnector.logout(response => {
        if (response.success === true) {
            location.reload();
        }
    })
}

// Получение текущего ползователя
ApiConnector.current(response => {
    ProfileWidget.showProfile(response.data);
})

// Получение текущих курсов валюты
const rates = new RatesBoard();
ApiConnector.getStocks(response => {
    if(response.success === true) {
        rates.clearTable();
        rates.fillTable(response.data);
    }
})

// Операции с деньгами
const moneyOperations = new MoneyManager();
moneyOperations.addMoneyCallback = data => {
    // Пополнение баланса
    const currency = data.currency;
    const amount = data.amount;
    ApiConnector.addMoney({ currency, amount },  response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            response.done = `Баланс успешно пополнен на ${amount} ${currency}`;
            moneyOperations.setMessage(response.success, response.done);
           
        } else {
            moneyOperations.setMessage(response.success, response.error);
        }
    })
}
// Конвертирование валюты
moneyOperations.conversionMoneyCallback = data => {
    const fromCurrency = data.fromCurrency;
    const targetCurrency = data.targetCurrency;
    const fromAmount = data.fromAmount;
    ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            response.done = `Успешное конвертирование ${fromCurrency} в ${targetCurrency}`;
            moneyOperations.setMessage(response.success, response.done);
        } else {
            moneyOperations.setMessage(response.success, response.error);
        }
    })
}
// Перевод валюты
moneyOperations.sendMoneyCallback = data => {
    const to = data.to;
    const currency = data.currency;
    const amount = data.amount;
    ApiConnector.transferMoney({ to, currency, amount }, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            response.done = `Успешное перевод ${amount} ${currency}`;
            moneyOperations.setMessage(response.success, response.done);
        } else {
            moneyOperations.setMessage(response.success, response.error);
        }
    })
}

// Работа с избранным
const favorites = new FavoritesWidget();
// Начальный список избранного
ApiConnector.getFavorites(response => {
    if(response.success === true) {
        favorites.clearTable();
        favorites.fillTable(response.data);
        moneyOperations.updateUsersList(response.data);

    }
})
// Добавление пользователя в список избранных
favorites.addUserCallback = data => {
    const id = data.id;
    const name = data.name;
    ApiConnector.addUserToFavorites({id, name}, response => {
        if (response.success === true) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            moneyOperations.updateUsersList(response.data);
            response.done = `Пользователь ${name} добавлен в избранное`;
            favorites.setMessage(response.success, response.done);
        } else {
            favorites.setMessage(response.success, response.error);
        }
    })
}

// Удаление пользователя из списка избранных
favorites.removeUserCallback = data => {
    console.log(data)
    const id = data;
    ApiConnector.removeUserFromFavorites(id, response => {
        if (response.success === true) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            moneyOperations.updateUsersList(response.data);
            response.done = `Пользователь успешно удалён из избранного`;
            favorites.setMessage(response.success, response.done);
        } else {
            favorites.setMessage(response.success, response.error);
        }
    }) 
}

