async function getMyProfile() {
    try {
        const req = await fetch('http://localhost/user/protected/myprofile', {
            method: 'GET'
        });
        const textRes = await req.text();
        const response = JSON.parse(textRes);
        if (!response.ok && response.error == 'Authentication error') return undefined;
        return response.data.user;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

async function loadNavbar() {
    const myProfile = await getMyProfile();
    const navbarHTML = `
        <nav class="navbar navbar-expand-lg bg-light">
            <div class="container-fluid">
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="./homepage.html">Публикации</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="./categories.html">Категории</a>
                        </li>
                        <li class="nav-item" ${myProfile ? '' : 'display="none"'}>
                            <a class="nav-link active" aria-current="page" href="./myProfile.html">Профиль</a> 
                        </li>
                    </ul>
                    <a class="d-${myProfile ? 'inline' : 'none'} btn btn-outline-primary mx-2" href="./createPost.html">Написать новую публикацию</a>
                    <div class="d-${myProfile ? 'none' : 'flex'} mx-2">
                        <a class="btn btn-outline-primary mx-1" href="./login.html">Войти</a>
                        <a class="btn btn-outline-secondary mx-1" href="./registration.html">Зарегистрироваться</a>
                    </div>
                </div>
            </div>
        </nav>
    `;
    document.body.innerHTML = navbarHTML + document.body.innerHTML;
}

loadNavbar();