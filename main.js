let gameMode = "normal";
let wrongAnswers = [];
let current;
let score=0;
let combo=0;
let timeLeft=10;
let timer;
let wrongList=[];
let reviewMode=false;
let paused=false;
let totalAnswers=0;
let selectedContinent="all";

function normalize(t){ return t.trim().toLowerCase(); }

function updateUI(){
document.getElementById("score").textContent=score;
document.getElementById("combo").textContent=combo;
document.getElementById("reviewCount").textContent=wrongList.length;
document.getElementById("accuracy").textContent=
totalAnswers?Math.floor(score/totalAnswers*100):0;
updateHighScore();
}

function updateHighScore(){
let hs=localStorage.getItem("highScore")||0;
if(score>hs){localStorage.setItem("highScore",score);}
document.getElementById("highScore").textContent=
localStorage.getItem("highScore")||0;
}

function startTimer(){
if(paused)return;
document.getElementById("time").textContent=timeLeft;
timer=setInterval(()=>{
if(!paused){
timeLeft--;
document.getElementById("time").textContent=timeLeft;
if(timeLeft<=0){clearInterval(timer);skipQuestion(true);}
}
},1000);
}

function nextQuestion(){ 
clearInterval(timer);
paused=false;
timeLeft=10;

let source = countries;

// 🔁 復習モード
if (gameMode === "review" && wrongList.length > 0) {
  source = wrongList;
}

// 🌎 大陸別モード
if (gameMode === "continent") {
  source = countries.filter(c =>
    selectedContinent === "all" || c.continent === selectedContinent
  );
}

// 🏆 1分チャレンジ
if (gameMode === "timeAttack") {
  source = countries;
}

current = source[Math.floor(Math.random()*source.length)];

document.getElementById("flag").src =
"https://flagcdn.com/w320/"+current.code+".png";

document.getElementById("answer").value="";
document.getElementById("result").textContent="";
startTimer();
}


function checkAnswer(){
clearInterval(timer);
totalAnswers++;

let input = normalize(document.getElementById("answer").value);

if(
  input === normalize(current.jp) ||
  input === normalize(current.en)
){
  score++;
  combo++;

  wrongList = wrongList.filter(c => c.code !== current.code);

  document.getElementById("correctSound").play();
  show("○ 正解！","green");

}else{
  combo = 0;
  addWrong();

  document.getElementById("wrongSound").play();
  show("× 正解:"+current.jp,"red");
}

updateUI();
setTimeout(nextQuestion,1500);
}


function skipQuestion(timeup=false){
clearInterval(timer);
combo=0;
addWrong();
show("正解:"+current.jp,"red");
updateUI();
setTimeout(nextQuestion,1500);
}

function addWrong(){
if(!wrongList.some(c=>c.code===current.code)){
wrongList.push(current);
}
}

function show(t,color){
let r=document.getElementById("result");
r.textContent=t;
r.style.color=color;
}

function togglePause(){
paused=!paused;
if(!paused)startTimer();
}

function toggleReviewMode(){
reviewMode=!reviewMode;
nextQuestion();
}

function changeContinent(){
selectedContinent=
document.getElementById("continentSelect").value;
nextQuestion();
}

function showGameScreen() {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
}

function goHome() {
  document.getElementById("homeScreen").style.display = "block";
  document.getElementById("gameScreen").style.display = "none";
}

function startNormal() {
  gameMode = "normal";
  document.getElementById("modeTitle").innerText = "通常モード";
  showGameScreen();
  nextQuestion();
}

function startContinent() {
  gameMode = "continent";
  document.getElementById("modeTitle").innerText = "大陸別モード";
  showGameScreen();
  nextQuestion();
}

function startReview() {
  gameMode = "review";
  document.getElementById("modeTitle").innerText = "復習モード";
  showGameScreen();
  nextQuestion();
}

function startTimeAttack() {
  gameMode = "timeAttack";
  document.getElementById("modeTitle").innerText = "1分チャレンジ";
  showGameScreen();
  nextQuestion();
}


updateHighScore();
nextQuestion();