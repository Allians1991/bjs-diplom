'use strict';
// Авторизация пользователя
let user = new UserForm();
user.loginFormCallback = data => {
    let login = data.login;
    let password = data.password;
    ApiConnector.login({ login, password }, response => {
        if (response.success === true) {
            location.reload()
        } else {
            user.setLoginErrorMessage(response.error)
        }
    })
};

// Авторизация пользователя
user.registerFormCallback = data => {
    let login = data.login;
    let password = data.password;
    ApiConnector.register({ login, password }, response => {
        if (response.success === true) {
            location.reload()
        } else {
            user.setRegisterErrorMessage(response.error)
        }
    })
};