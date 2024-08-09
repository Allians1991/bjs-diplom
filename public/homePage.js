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

function getCurrentRates() {
    ApiConnector.getStocks(response => {
        if(response.success === true) {
            rates.clearTable();
            rates.fillTable(response.data);
        }
    })
}
getCurrentRates();
setInterval(getCurrentRates, 2000);



// Операции с деньгами
const moneyOperations = new MoneyManager();
moneyOperations.addMoneyCallback = data => {
    // Пополнение баланса
    ApiConnector.addMoney(data,  response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyOperations.setMessage(response.success, `Баланс успешно пополнен на ${data.amount} ${data.currency}`);
           
        } else {
            moneyOperations.setMessage(response.success, response.error);
        }
    })
}
// Конвертирование валюты
moneyOperations.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyOperations.setMessage(response.success, `Успешное конвертирование ${data.fromCurrency} в ${data.targetCurrency}`);
        } else {
            moneyOperations.setMessage(response.success, response.error);
        }
    })
}
// Перевод валюты
moneyOperations.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyOperations.setMessage(response.success, `Успешное перевод ${data.amount} ${data.currency}`);
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
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success === true) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            moneyOperations.updateUsersList(response.data);
            favorites.setMessage(response.success, `Пользователь ${data.name} добавлен в избранное`);
        } else {
            favorites.setMessage(response.success, response.error);
        }
    })
}

// Удаление пользователя из списка избранных
favorites.removeUserCallback = data => {
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

