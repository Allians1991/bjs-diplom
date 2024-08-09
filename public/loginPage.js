'use strict';
// Авторизация пользователя
let user = new UserForm();
user.loginFormCallback = data => {
    ApiConnector.login(data, response => {
        if (response.success === true) {
            location.reload()
        } else {
            user.setLoginErrorMessage(response.error)
        }
    })
};

// Авторизация пользователя
user.registerFormCallback = data => {
    ApiConnector.register(data, response => {
        if (response.success === true) {
            location.reload()
        } else {
            user.setRegisterErrorMessage(response.error)
        }
    })
};