(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach((form) => {
        form.addEventListener(
            'submit',
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            },
            false
        );
    });
})();


function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += '; ' + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += '=' + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

async function apiRequest(path, method, body) {
    try {
        if (method == 'GET') body = undefined;
        else body = JSON.stringify(body);
        const request = await fetch(`http://localhost${path}`, {
            method,
            headers: {
                'Content-type': 'application/json',
            },
            body,
        });
        const textResponse = await request.text();
        const response = JSON.parse(textResponse);
        if (!response.ok && response.error == 'Authentication failed') {
            window.location.href = 'http://localhost/login.html';
        }
        return response;
    } catch (e) {
        console.log(e);
        return {};
    }
}

async function login(form) {
    const email = form[0].value;
    const password = form[1].value;
    const response = await apiRequest('/authentication/login', 'POST', { email, password });
    if (response.ok) {
        setCookie('access_token', response.data.access_token, { secure: true, path: '/', 'max-age': 86400 });
        window.location.href = 'http://localhost/homepage.html';
    }
}

async function register(form) {
    const username = form[0].value;
    const email = form[1].value;
    const password = form[2].value;
    const response = await apiRequest('/authentication/register', 'POST', { username, email, password });
    if (response.ok) {
        setCookie('access_token', response.data.access_token, { secure: true, path: '/', 'max-age': 86400 });
        window.location.href = 'http://localhost/homepage.html';
    }
}

async function getAuthor(id) {
    const response = await apiRequest(`/user/public/get/${id}`, 'GET', {});
    if (response.ok) {
        return response.data.user;
    }
}

async function updateProfile(form) {
    const username = form[0].value;
    const email = form[1].value;
    const password = form[2].value;
    const response = await apiRequest('/user/protected/update', 'PUT', { username, email, password });
    if (response.ok) {
        setCookie('access_token', response.data.access_token, { secure: true, path: '/', 'max-age': 86400 });
    }
}

async function deleteProfile() {
    await apiRequest('/user/protected/delete', 'DELETE');
    logOut();
}


function logOut() {
    setCookie('access_token', '');
    window.location.href = 'http://localhost/login.html';
}

function getUrlString(params) {
    const paramPairs = Object.entries(params).filter((entrie) => entrie[1] != undefined).map((entrie) => `${entrie[0]}=${entrie[1]}`);
    return paramPairs.join('&');
}

async function getPagination(params) {
    if (!params) params = {};
    const paramsString = getUrlString(params);
    const response = await apiRequest(`/posts/public/list?${paramsString}`, 'GET', {});
    if (response.ok) {
        return response.data.posts;
    }
}

async function createPost(category_id, title, content) {
    const response = await apiRequest('/posts/protected/create', 'POST', { category_id, title, content });
    if (response.ok) {
        return response.data.post;
    }
}

async function getPost(id) {
    const response = await apiRequest(`/posts/public/get/${id}`, 'GET', {});
    if (response.ok) {
        return response.data.post;
    }
}

async function getCategories() {
    const response = await apiRequest('/categories/public/list', 'GET', {});
    if (response.ok) {
        return response.data.categories;
    }
}

async function getCategory(id) {
    const response = await apiRequest(`/categories/public/get/${id}`, 'GET', {});
    if (response.ok) {
        return response.data.category;
    }
}

async function createCategory(name) {
    await apiRequest('/categories/protected/create', 'POST', { name });
}