async function setRenderBackground(){
    const result = await axios.get("https://picsum.photos/3840/2160?grayscale&blur=2",{
        responseType : "blob" //타입을 blob으로 변경
    });

    const data = URL.createObjectURL(result.data); //객체 상테인 blob을 url로 변경
    document.querySelector("body").style.backgroundImage = `url(${data})`; //url을 background에 적용
    //위에 문장은 background-image : url()과 같다.
}

function setTime() {

    const timer = document.querySelector(".timer");

    setInterval(() => {
        const date = new Date();
        timer.textContent = `${('0'+date.getHours()).slice(-2)} : ${('0'+date.getMinutes()).slice(-2)} : ${('0'+date.getSeconds()).slice(-2)}`;
        const timecontent = document.querySelector(".timer-content");
        if (date.getHours() >= 0 && date.getHours() < 9) {
            timecontent.textContent = "Good Morning, Moo Chang!";  
        }
        else if (date.getHours() >= 9 && date.getHours() < 12) {
            timecontent.textContent = "Good Day, Moo Chang!"; 
        }
        else if (date.getHours() >= 12 && date.getHours() < 20) {
            timecontent.textContent = "Good Afternoon, Moo Chang!"; 
        }
        else if(date.getHours() >= 20 && date.getHours() <= 23){
            timecontent.textContent = "Good evening, Moo Chang!"; 
        }
        
    }, 1000);

}

function getMemo(){
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo"); //local을 불러오기
    memo.textContent = memoValue; //출력
}

function setMemo(){
        const memoInput = document.querySelector(".memo-input");
        memoInput.addEventListener("keyup",function(e){
            if(e.code === "Enter" && e.currentTarget.value){
                localStorage.setItem("todo",e.currentTarget.value); //local에 저장
                getMemo();
                memoInput.value = ""; //작성칸은 비우기
            }
        })
}

function deleteMemo(){
    document.addEventListener("click",function(e){
        if (e.target.classList.contains("memo")) {
            localStorage.removeItem("todo");
            e.target.textContent = "";
        }
    })
}



function getPosition(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve,reject,options)
    })
}

async function getWeather(lat,lon) {

    if (lat && lon) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=2719e331e07a6af0547cfe7df2754c8c`)
        return data;
    }

    const data = await axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Gwangju&appid=2719e331e07a6af0547cfe7df2754c8c");
    return data;
}

async function renderWeather() {
    let latitude = "";
    let longitude = "";

    try {
        const position = await getPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    }
    catch {
        
    }

    const result = await getWeather(latitude, longitude);
    const weatherData = result.data;
    
    
    //배열이 너무 많아서 오전, 오후만 남길 수 있는 로직
    const weatherList = weatherData.list.reduce((acc, cur) => {
        if (cur.dt_txt.indexOf("18:00:00") > 0) { //결과가 1이면 있다 -1은 없다
            acc.push(cur);
        }
        return acc;
    }, [])
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = weatherList.map((e) => {
        return weatherWrapperComponent(e);
    }).join(" ")


    const modaltext = document.querySelector(".modal-button-text");
    const celsius = weatherList[0].main.temp;
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1);
    const changecelsius = changeToCelsius(celsius);
    modaltext.textContent = `${ changecelsius}º`;

    const modalbutton = document.querySelector(".modal-button");
    modalbutton.style.backgroundImage = `url(${matchIcon(weatherList[0].weather[0].main)})`;

    
}

function weatherWrapperComponent(e) {
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1);
    return `
    <div class="card border-dark" style="width: 20rem;">
    <div class="card-header text-white text-center fw-bold bg-secondary">${e.dt_txt.split(" ")[0]}</div>
        <div class="card-body text-white text-center fw-bold bg-dark">
            <h5>${e.weather[0].main}</h5>
            <img src="${matchIcon(e.weather[0].main)}" class="card-img-top" alt="...">
            <p class="card-text">${changeToCelsius(e.main.temp)}º</p>
        </div>
    </div>
    `
}

function matchIcon(weatherData) {
    if (weatherData === "Clear") return "./images/039-sun.png"
    if (weatherData === "Clouds") return "./images/001-cloud.png"
    if (weatherData === "Rain") return "./images/003-rainy.png"
    if (weatherData === "Snow") return "./images/006-snowy.png"
    if (weatherData === "Thunderstorm") return "./images/008-storm.png"
    if (weatherData === "Drizzle") return "./images/031-snowflake.png"
    if (weatherData === "Atomsphere") return "./images/033-hurricane.png"
}

function setInputbar() {
    const Inputbar = document.querySelector(".inputbar");
    Inputbar.addEventListener("keyup", function (e) {
        if (e.code === "Enter" && e.currentTarget.value) {
            window.open(`https://www.google.com/search?q=${e.currentTarget.value}`)
            Inputbar.value = ""; //작성칸은 비우기
        }
    })
}


async function renderStory() {
    const figureBody = document.querySelector(".footertext");
    const selectStory = StoryWrapperComponent();
    console.log(selectStory);
    figureBody.innerHTML = `
    <blockquote class="blockquote">
                <p>${selectStory.stories}</p>
            </blockquote>
            <figcaption class="blockquote-footers">
                <cite title="Source Title">${selectStory.author}</cite>
            </figcaption>
    `;
}

function StoryWrapperComponent() {
    const random = randomStory();
    return random;
}

const story = [
    { stories: "Time is an illusion. Lunchtime doubly so.", author: "Douglas Adams" },
    { stories: "Employ thy time well, if thou meanest to get leisure.", author: "Benjamin Franklin" },
    { stories: "Study the past if you would define the future.", author: "Confucius" },
    { stories: "The wisest men follow their own direction.", author: "Euripides" },
    { stories:"It is only the ignorant who despise education.",author:"Publilius Syrus"}
];

function randomStory() {
    return todayStory = story[Math.floor(Math.random() * story.length)];

}


setInputbar();


renderStory();


renderWeather();

deleteMemo();

getMemo(); //초기 렌더링 시에 작동을 한다.
setMemo();

setTime();

setRenderBackground();
setInterval(() => {
    setRenderBackground();
},5000);