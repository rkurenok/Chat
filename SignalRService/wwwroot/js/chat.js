"use strict"
let interval1,
    interval2,
    push = false;
let hubUrl = "http://chatik.somee.com/chat";
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl)
    .configureLogging(signalR.LogLevel.Information)
    .build();
let userName = "";
// получение сообщения от сервера
hubConnection.on("Receive", function (userName, message, time) {
    // создаем элемент <b> для имени пользователя
    let userNameElem = document.createElement("b");
    userNameElem.appendChild(document.createTextNode(userName + ": "));

    // создает элемент <p> для сообщения пользователя
    let elem = document.createElement("p");
    elem.appendChild(userNameElem);
    // ищем ссылки в тексте
    findLink(elem, message);

    var firstElem = document.getElementById("chatroom").firstChild;
    document.getElementById("chatroom").insertBefore(elem, firstElem);

    // добавляем время отправки сообщения
    let sendTime = document.createElement("span");
    sendTime.classList.add('time');
    sendTime.appendChild(document.createTextNode(time));
    elem.appendChild(sendTime);

    // включаем уведомление о новом сообщении
    if (document.hidden && !push) {
        interval1 = setInterval(function () { document.title = 'Новое сообщение' }, 1000);
        interval2 = setInterval(function () { document.title = 'SignalR Chat' }, 2000);
        push = true;
    }
});

// установка имени пользователя
document.getElementById("userName").addEventListener("keyup", function (event) {
    // Число 13 в "Enter" и клавиши на клавиатуре
    if (event.keyCode === 13) {
        // При необходимости отмените действие по умолчанию
        event.preventDefault();
        // Вызов элемента button одним щелчком мыши
        document.getElementById("loginBtn").click();
    }
});
document.getElementById("loginBtn").addEventListener("click", function (e) {
    userName = document.getElementById("userName").value;
    document.getElementById("header").innerHTML = "<h3>Welcom " + userName + "</h3>";
});
// отправка сообщения на сервер
document.getElementById("message").addEventListener("keyup", function (event) {
    // Число 13 в "Enter" и клавиши на клавиатуре
    if (event.keyCode === 13) {
        // При необходимости отмените действие по умолчанию
        event.preventDefault();
        // Вызов элемента button одним щелчком мыши
        document.getElementById("sendBtn").click();
    }
});
document.getElementById("sendBtn").addEventListener("click", function (e) {
    let message = document.getElementById("message").value;
    let time = new Date().toLocaleTimeString();
    setTimeout(hubConnection.invoke("Send", userName, message, time));
});

hubConnection.start();
// hubConnection.start().catch(function (e) {
// })

// отключаем уведомление о новом сообщении
window.onfocus = function () {
    clearInterval(interval1);
    clearInterval(interval2);
    document.title = 'SignalR Chat';
    push = false;
}

// функция для поика ссылки
function findLink(elem, message) {
    var RegExp = /(https?:\/\/[^\s]+)/g;
    var RegExp1 = /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;
    let arr = message.split(RegExp);
    arr.forEach(function (item, i, arr) {
        if (RegExp1.test(item)) {
            item = `<a href="` + item + `" target="_blank">` + item + `</a>`;
            elem.insertAdjacentHTML('beforeend', item);
            return;
        }
        elem.appendChild(document.createTextNode(item));
    });
}