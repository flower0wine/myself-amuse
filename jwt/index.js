'use strict';

const usernameInput = document.querySelector('.username');
const passwordInput = document.querySelector('.password');
const loginBtn = document.querySelector('.login-btn');
const infoBtn = document.querySelector('.info-btn');

let token;

loginBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    request('POST', 'http://localhost:9090/login', null, {username, password}).then(data => {
        token = data.data.token;
    });
});

infoBtn.addEventListener('click', () => {
    request('GET', 'http://localhost:9090/follow', {'Authorization': token}, null).then(data => {
        console.log(data);
    });
});

function request(method, url, header, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        for(let key in header) {
            xhr.setRequestHeader(key, header[key]);
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => {
            reject(xhr.statusText);
        };
        xhr.send(JSON.stringify(data));
    });
}