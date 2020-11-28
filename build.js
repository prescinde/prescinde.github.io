!function(){"use strict";window.htmlToElement=function(t){let e=document.createElement("template");return e.innerHTML=t.trim(),e.content.firstChild},window.AuxEvent=class{constructor(){this.event=document.createElement("e"),this.aux=new Event("e")}addListener(t,e){let n=this.event;n.addEventListener("e",(function a(){document.contains(t)?e():n.removeEventListener("e",a)}))}dispatch(){this.event.dispatchEvent(this.aux)}},window.Observable=class{constructor(t){this.variable=t,this.event=new AuxEvent}get value(){return this.variable}set value(t){this.variable=t,this.event.dispatch()}subscribe(t,e){this.event.addListener(t,e)}};let t=new Promise(((t,e)=>{let n=new XMLHttpRequest;n.open("GET","data.json"),n.responseType="json",n.onload=()=>{n.status<400?t(n.response):e(n.statusText)},n.onerror=()=>e(n.statusText),n.send()}));window.drugs=t.then((t=>t.drugs)),window.goals=t.then((t=>t.goals)),window.surveys=t.then((t=>t.surveys)),window.drugSurveys=t.then((t=>t.drugSurveys)),window.appMode=new Observable("history"),window.selectedDrugs=new Observable(JSON.parse(localStorage.selectedDrugs||"[]")),selectedDrugs.subscribe(document,(()=>localStorage.selectedDrugs=JSON.stringify(selectedDrugs.value))),selectedDrugs.subscribe(document,(()=>post("drugs",{drugs:selectedDrugs.value,timestamp:timestamp()}))),window.selectedGoals=new Observable(JSON.parse(localStorage.selectedGoals||"[]")),selectedGoals.subscribe(document,(()=>localStorage.selectedGoals=JSON.stringify(selectedGoals.value))),selectedGoals.subscribe(document,(()=>post("goals",{goals:selectedGoals.value,timestamp:timestamp()})));const e="https://prescinde.herokuapp.com/";window.logged=new Observable(!1);let n=JSON.parse(localStorage.posponedPosts||"[]"),a=new Observable(!1),o=!1;window.initGoogle=()=>{window.Android||gapi.load("auth2",(function(){gapi.auth2.init({client_id:"516833862039-266jetktablfudij902s6t6hhg9fcjoa.apps.googleusercontent.com"}).then((()=>{a.value=!0})).catch((t=>{o=!0,a.value=!0,console.error(t)}))}))};let s=new Promise((t=>{if(a.value)return t();a.subscribe(document,(()=>t()))}));function i(){let t=gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();logged.value=t&&t.getEmail()}if(s.then((()=>{i(),gapi.auth2.getAuthInstance().currentUser.listen(i)})),window.signIn=async function(){if(window.Android)Android.logIn();else{if(await s,o)throw alert("Es necesario activar las cookies para poder loguearse. Este error puede deberse a navegar en modo incógnito.");await gapi.auth2.getAuthInstance().signIn()}},window.Android){let t=setInterval((()=>{let e;(e=Android.email())&&(clearInterval(t),logged.value=e)}),150)}async function l(){return window.Android?Android.token():gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token}function r(){localStorage.posponedPosts=JSON.stringify(n)}function c(t,e){n.push([t,e]),r()}function u(){if(logged.value){let t=n.length;for(let e=0;e<t;e++)post(...n.shift()),r()}}window.get=function(t,n){return new Promise(((a,o)=>{l().then((s=>{let i=new XMLHttpRequest;i.open(n?"POST":"GET",e+t+"?token="+s),i.responseType="json",i.onload=()=>{i.status<400?a(i.response):o(i.statusText)},i.onerror=()=>o(i.statusText),i.send(n&&JSON.stringify(n))})).catch(o)}))},window.post=function(t,n){l().then((a=>{let o=new XMLHttpRequest;o.open("POST",e+t+"?token="+a),o.onload=()=>{o.status>=400&&c(t,n)},o.onerror=()=>c(t,n),o.send(JSON.stringify(n))})).catch((()=>c(t,n)))},u(),logged.subscribe(document,u),setInterval(u,3e5),window.timestamp=function(){return Date.now()};async function d(){let t=new Set,e=await window.drugSurveys;for(let n of selectedDrugs.value)for(let a of e[n])finishedSurveys.value.includes(a)||t.add(a);for(let e of JSON.parse(localStorage.pendingSurveys||"[]"))finishedSurveys.value.includes(e)||t.add(e);return[...t]}window.registerHistory=new Observable(JSON.parse(localStorage.registerHistory||"[]")),registerHistory.add=function(t){registerHistory.value.unshift(t)>30&&(registerHistory.value.length=30),registerHistory.event.dispatch()},registerHistory.subscribe(document,(()=>localStorage.registerHistory=JSON.stringify(registerHistory.value))),window.sendRegister=function(t){let e={type:t.type&&t.type.value||selectedDrugs.value[0],timestamp:timestamp(),situation:t.situation.value,desire:t.desire.value};post("register",e),registerHistory.add(e)},window.finishedSurveys=new Observable(JSON.parse(localStorage.finishedSurveys||"[]")),finishedSurveys.push=function(t){finishedSurveys.value.push(t),post("survey",{survey:t,timestamp:timestamp()}),finishedSurveys.event.dispatch()},finishedSurveys.subscribe(document,(()=>localStorage.finishedSurveys=JSON.stringify(finishedSurveys.value))),window.pendingSurveys=new Observable(d()),pendingSurveys.add=async function(t){let e=await window.pendingSurveys.value,n=[...new Set([...e,...await t])];n.length>e.length&&(window.pendingSurveys.value=new Promise((t=>t(n))))},selectedDrugs.subscribe(document,(()=>pendingSurveys.add(d()))),window.surveyIndex=new Observable(0);async function p(){if(logged.value&&Date.now()-(localStorage.surveyTimestamp||0)>144e5){let t=await get("surveys"),e=t.finished.filter((t=>!finishedSurveys.value.includes(t)));finishedSurveys.value.push(...e),finishedSurveys.event.dispatch();let n=t.pending.filter((t=>!finishedSurveys.value.includes(t)));localStorage.pendingSurveys=JSON.stringify(n),n.length&&pendingSurveys.add(n),localStorage.surveyTimestamp=Date.now()}}function m(){let t=location.hash.match(/^#\/question\/(.+)/);t&&(notificationConfirmation=!0,notificationText.value=decodeURIComponent(t[1]))}if(p(),logged.subscribe(document,p),setInterval(p,3e5),window.notificationText=new Observable(null),window.notificationConfirmation=null,window.telegramActivated=new Observable(JSON.parse(localStorage.telegramActivated||"1")),telegramActivated.subscribe(document,(()=>localStorage.telegramActivated=JSON.stringify(telegramActivated.value))),window.telegramCode=function(){return(logged.value.split("").reduce(((t,e)=>Math.imul(t,31)+e.charCodeAt()>>>0),0)%1e4).toString().padStart(4,"0")},window.sendAnswer=function(t){post("answer",{text:notificationText.value,answer:t,timestamp:timestamp()}),notificationText.value=null},window.checkTelegram=async function(){let t=await get("telegram-active",{code:telegramCode()});return t!=telegramActivated.value&&(telegramActivated.value=t),localStorage.telegramTimestamp=Date.now(),t},window.Android){function g(){Android.notificationsEnabled()||alert("Prescinde sólo es efectiva si activas las notificaciones")}setInterval((()=>{let t;(t=Android.notificationText())&&(notificationConfirmation=Android.notificationConfirmation(),notificationText.value=t)}),150),g(),setInterval(g,3e5)}else{m(),window.addEventListener("popstate",m),notificationText.subscribe(document,(()=>{notificationText.value||(location.hash="")}));const t=144e5;function v(){logged.value&&Date.now()-(localStorage.telegramTimestamp||0)>t&&checkTelegram()}v(),logged.subscribe(document,v),setInterval(v,3e5)}function f(){let t=htmlToElement('<main>\n\t\t<footer class="main-footer">\n\t\t\t<a data-mode="register"><i class="fas fa-file-signature"></i></a>\n\t\t\t<a class="selected-icon"><i class="fas fa-history"></i></a>\n\t\t\t<a data-mode="settings"><i class="fas fa-cog"></i></a>\n\t\t</footer>\n\t\t<div class="footer-space"></div>\n\t</main>');t.prepend(htmlToElement('<p class="title history-title">Historial de consumo</p>'),registerHistory.value.length?function(){let t=htmlToElement("<section></section>");return t.append(...registerHistory.value.map((t=>htmlToElement(`<article class="history-item">\n\t\t<article class="history-field">\n\t\t\t<p class="name"><span>Tipo</span>:</p>\n\t\t\t<p class="content">${t.type}</p>\n\t\t</article>\n\t\t<article class="history-field">\n\t\t\t<p class="name"><span>Fecha</span>:</p>\n\t\t\t<p class="content">${new Date(t.timestamp).toLocaleString()}</p>\n\t\t</article>\n\t\t<article class="history-field">\n\t\t\t<p class="name"><span>Situación</span>:</p>\n\t\t\t<p class="content">${t.situation}</p>\n\t\t</article>\n\t\t<article class="history-field">\n\t\t\t<p class="name"><span>Deseo</span>:</p>\n\t\t\t<p class="content">${t.desire}</p>\n\t\t</article>\n\t</article>`)))),t}():function(){let t=htmlToElement('<p class="empty-history">Enhorabuena, el historial está vacío. <a>Registrar consumo</a></p>');return t.querySelector("a").onclick=()=>appMode.value="register",t}());for(let e of t.querySelectorAll("[data-mode]"))e.onclick=()=>appMode.value=e.getAttribute("data-mode");return t}function b(){return selectedDrugs.value.length>1?`<label>\n\t\t\t<select name="type" required>\n\t\t\t\t<option value="" selected>Tipo de droga</option>\n\t\t\t\t${selectedDrugs.value.map((t=>{return`<option value="${t}">${e=t,e.charAt(0).toUpperCase()+e.slice(1)}</option>`;var e})).join("")}\n\t\t\t</select>\n\t\t\t<p>Tipo de droga</p>\n\t\t</label>`:""}function h(){let t=new Date;return`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`}async function w(){let t=htmlToElement(`<main>\n\t\t<p class="title selection-title">Selecciona las adicciones para las que quieres usar la app</p>\n\t\t<form class="selection-form">\n\t\t\t${await async function(){return(await drugs).map((t=>`<label>\n\t\t<input type="checkbox" name="${t}" ${selectedDrugs.value.includes(t)?"checked":""}>\n\t\t<div class="checkbox"></div><span>${t}</span>\n\t</label>`)).join("")}()}\n\t\t\t<button class="button">Guardar</button>\n\t\t</form>\n\t\t<p class="title selection-title">Selecciona las que encajen con tu situación</p>\n\t\t<form class="selection-form">\n\t\t\t${await async function(){return(await goals).map((t=>`<label>\n\t\t<input type="checkbox" name="${t}" ${selectedGoals.value.includes(t)?"checked":""}>\n\t\t<div class="checkbox"></div><span>${t}</span>\n\t</label>`)).join("")}()}\n\t\t\t<button class="button">Guardar</button>\n\t\t</form>\n\t\t<p class="title selection-title">Activar notificaciones</p>\n\t\t<p class="info-text">Pulsa <a href="http://t.me/PrescindeBot" target="_blank" rel="noopener">aquí</a> para asociar <b>${logged.value}</b> a nuestro bot de Telegram. El código de activación es <b>${telegramCode()}</b>.</p>\n\t\t<footer class="main-footer">\n\t\t\t<a data-mode="register"><i class="fas fa-file-signature"></i></a>\n\t\t\t<a data-mode="history"><i class="fas fa-history"></i></a>\n\t\t\t<a class="selected-icon"><i class="fas fa-cog"></i></a>\n\t\t</footer>\n\t\t<div class="footer-space"></div>\n\t</main>`),e=t.querySelectorAll("form");e[0].onsubmit=t=>{t.preventDefault();let n=[...new FormData(e[0]).keys()];n.length?(selectedDrugs.value=n,alert("Guardado")):alert("Debes elegir al menos una")},e[1].onsubmit=t=>{t.preventDefault();let n=[...new FormData(e[1]).keys()];n.length?(selectedGoals.value=n,alert("Guardado")):alert("Debes elegir al menos una")};for(let e of t.querySelectorAll("[data-mode]"))e.onclick=()=>appMode.value=e.getAttribute("data-mode");return t}async function y(){let t=htmlToElement(`<main class="selection-screen">\n\t\t<p class="title selection-title">Selecciona las adicciones para las que quieres usar la app</p>\n\t\t<form class="selection-form" id="selection">\n\t\t\t${await async function(){return(await drugs).map((t=>`<label>\n\t\t<input type="checkbox" name="${t}">\n\t\t<div class="checkbox"></div><span>${t}</span>\n\t</label>`)).join("")}()}\n\t\t</form>\n\t\t<button class="button" form="selection">Continuar</button>\n\t</main>`),e=t.querySelector("form");return e.onsubmit=t=>{t.preventDefault();let n=[...new FormData(e).keys()];n.length?(selectedDrugs.value=n,loadScreen()):alert("Debes elegir al menos una")},t}async function S(){let t=htmlToElement(`<main class="selection-screen">\n\t\t<p class="title selection-title">Selecciona las que encajen con tu situación</p>\n\t\t<form class="selection-form" id="selection">\n\t\t\t${await async function(){return(await goals).map((t=>`<label>\n\t\t<input type="checkbox" name="${t}">\n\t\t<div class="checkbox"></div><span>${t}</span>\n\t</label>`)).join("")}()}\n\t\t</form>\n\t\t<button class="button" form="selection">Continuar</button>\n\t</main>`),e=t.querySelector("form");return e.onsubmit=t=>{t.preventDefault();let n=[...new FormData(e).keys()];n.length?(selectedGoals.value=n,loadScreen()):alert("Debes elegir al menos una")},t}function T(){let t=htmlToElement(`<main class="confirmation-screen">\n\t\t<section>\n\t\t\t<p class="title confirmation-title">${notificationText.value}</p>\n\t\t</section>\n\t</main>`);return t.querySelector("section").appendChild(function(){let t;return notificationConfirmation?(t=htmlToElement('<article class="confirmation-buttons">\n\t\t\t<button class="button yes-button">Sí</button>\n\t\t\t<button class="button no-button">No</button>\n\t\t</article>'),t.querySelector(".yes-button").onclick=()=>sendAnswer("Sí"),t.querySelector(".no-button").onclick=()=>sendAnswer("No")):(t=htmlToElement('<article class="confirmation-buttons">\n\t\t\t<button class="button">Entendido</button>\n\t\t</article>'),t.querySelector(".button").onclick=()=>notificationText.value=null),t}()),t}let A=0;function x(){document.querySelector(".google-form")||loadScreen()}window.loadScreen=async function(){scrollTo(0,0);let t,e=++A;t=logged.value?selectedDrugs.value.length?selectedGoals.value.length?telegramActivated.value?(await pendingSurveys.value).length>surveyIndex.value?async function(){let t=await window.pendingSurveys.value,e=t[surveyIndex.value];finishedSurveys.value.includes(e)&&surveyIndex.value++;let n=htmlToElement(`<main>\n\t\t<p class="title form-title">Rellena el siguiente formulario para continuar</p>\n\t\t<p class="form-subtitle">Formulario ${surveyIndex.value+1} de ${t.length}</p>\n\t\t<iframe class="google-form" src="${(await surveys)[e]+encodeURIComponent(logged.value)}">Cargando…</iframe>\n\t</main>`),a=0;return n.querySelector("iframe").onload=()=>{++a>1&&(finishedSurveys.push(t[surveyIndex.value]),surveyIndex.value++)},n}():notificationText.value?T():"settings"==appMode.value?w():"register"==appMode.value?function(){let t=htmlToElement(`<main>\n\t\t<p class="title register-title">Registra tu actividad <b>antes</b> de consumir</p>\n\t\t<form class="register-form">\n\t\t\t${b()}\n\t\t\t<label>\n\t\t\t\t<input type="text" placeholder="Hora" value="${h()}" readonly>\n\t\t\t\t<p>Hora</p>\n\t\t\t</label>\n\t\t\t<label>\n\t\t\t\t<input name="situation" type="text" placeholder="Situación">\n\t\t\t\t<p>Situación</p>\n\t\t\t</label>\n\t\t\t<label>\n\t\t\t\t<select name="desire" required>\n\t\t\t\t\t<option value="" selected>Grado de deseo</option>\n\t\t\t\t\t<option>0</option>\n\t\t\t\t\t<option>1</option>\n\t\t\t\t\t<option>2</option>\n\t\t\t\t\t<option>3</option>\n\t\t\t\t\t<option>4</option>\n\t\t\t\t\t<option>5</option>\n\t\t\t\t\t<option>6</option>\n\t\t\t\t\t<option>7</option>\n\t\t\t\t\t<option>8</option>\n\t\t\t\t\t<option>9</option>\n\t\t\t\t\t<option>10</option>\n\t\t\t\t</select>\n\t\t\t\t<p>Grado de deseo</p>\n\t\t\t</label>\n\t\t\t<button class="button">Registrar</button>\n\t\t</form>\n\t\t<footer class="main-footer">\n\t\t\t<a class="selected-icon"><i class="fas fa-file-signature"></i></a>\n\t\t\t<a data-mode="history"><i class="fas fa-history"></i></a>\n\t\t\t<a data-mode="settings"><i class="fas fa-cog"></i></a>\n\t\t</footer>\n\t\t<div class="footer-space"></div>\n\t</main>`),e=t.querySelector("input"),n=setInterval((()=>{document.contains(e)?e.value=h():clearInterval(n)}),3e3),a=t.querySelector("form");a.onsubmit=t=>{t.preventDefault(),sendRegister(a.elements),appMode.value="history"};for(let e of t.querySelectorAll("[data-mode]"))e.onclick=()=>appMode.value=e.getAttribute("data-mode");return t}():f():function(){let t=htmlToElement(`<main class="selection-screen">\n\t\t<p class="title">Activar notificaciones</p>\n\t\t<p class="info-text">Pulsa <a href="http://t.me/PrescindeBot" target="_blank" rel="noopener">aquí</a> para asociar <b>${logged.value}</b> a nuestro bot de Telegram. El código de activación es <b>${telegramCode()}</b>.</p>\n\t\t<button class="button confirm-button">Hecho</button>\n\t</main>`),e=t.querySelector("button");return e.onclick=async()=>{e.disabled=!0,await checkTelegram().then((t=>{t||alert("Comprueba que el bot se ha activado correctamente")})).catch((()=>alert("Error, vuelve a intentarlo más tarde"))),e.disabled=!1},t}():S():y():function(){let t=htmlToElement('<main class="welcome-screen">\n\t\t<section>\n\t\t\t<article>\n\t\t\t\t<p class="main-title">Prescinde</p>\n\t\t\t\t<img class="main-logo" src="images/logo.jpeg">\n\t\t\t</article>\n\t\t\t<article>\n\t\t\t\t<p class="main-msg">Inicia sesión para comenzar a superar tus adicciones</p>\n\t\t\t\t<a class="sign-in">\n\t\t\t\t\t<div><img src="images/google.svg"> Acceder con Google</div>\n\t\t\t\t</a>\n\t\t\t</article>\n\t\t</section>\n\t</main>');return t.querySelector(".sign-in").onclick=signIn,t}(),t=await t,e==A&&document.querySelector("main").replaceWith(t)},loadScreen(),logged.subscribe(document,loadScreen),appMode.subscribe(document,loadScreen),pendingSurveys.subscribe(document,x),surveyIndex.subscribe(document,loadScreen),notificationText.subscribe(document,x),telegramActivated.subscribe(document,x)}();
