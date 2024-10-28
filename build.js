window.htmlToElement=function(e){let t=document.createElement("template");return t.innerHTML=e.trim(),t.content.firstChild},window.AuxEvent=class{constructor(){this.event=new EventTarget,this.aux=new Event("e")}addListener(e,t){let a=this.event;e.myCallbacks?e.myCallbacks.push(t):e.myCallbacks=[t];let n=[new WeakRef(e),new WeakRef(t)];a.addEventListener("e",function e(){let[t,s]=n.map(e=>e.deref());t&&s&&(document.contains(t)?s():a.removeEventListener("e",e))})}dispatch(){this.event.dispatchEvent(this.aux)}},window.Observable=class{constructor(e){this.variable=e,this.event=new AuxEvent}get value(){return this.variable}set value(e){this.variable=e,this.event.dispatch()}subscribe(e,t){this.event.addListener(e,t)}};let e=new Promise((e,t)=>{let a=new XMLHttpRequest;a.open("GET","data.json"),a.responseType="json",a.onload=()=>{a.status<400?e(a.response):t(a.statusText)},a.onerror=()=>t(a.statusText),a.send()});window.drugs=e.then(e=>e.drugs.concat(e.activities)),window.activities=e.then(e=>e.activities),window.goals=e.then(e=>e.goals),window.surveys=e.then(e=>e.surveys),window.drugSurveys=e.then(e=>e.drugSurveys),window.appMode=new Observable("history"),window.selectedDrugs=new Observable(JSON.parse(localStorage.selectedDrugs||"[]")),selectedDrugs.subscribe(document,()=>localStorage.selectedDrugs=JSON.stringify(selectedDrugs.value)),selectedDrugs.subscribe(document,()=>post("drugs",{drugs:selectedDrugs.value,timestamp:timestamp()})),window.selectedGoals=new Observable(JSON.parse(localStorage.selectedGoals||"[]")),selectedGoals.subscribe(document,()=>localStorage.selectedGoals=JSON.stringify(selectedGoals.value)),selectedGoals.subscribe(document,()=>post("goals",{goals:selectedGoals.value,timestamp:timestamp()}));const t="https://luiscastro193.duckdns.org/prescinde/",a=import("https://cdn.jsdelivr.net/npm/jwt-decode/+esm").then(e=>e.jwtDecode);window.logged=new Observable(!1);let n=localStorage.password,s=JSON.parse(localStorage.posponedPosts||"[]"),o=new Observable(!1),i=!1;async function l(){let e=(await a)(n),t=e.exp-Date.now()/1e3;t>600?(logged.value!=e.user&&(logged.value=e.user),t<1296e3&&get("renew").then(e=>{n=e.key,localStorage.password=n})):signIn()}async function r(e,t){let a=await fetch(e,t);if(a.ok)return a;throw a}async function c(e){return r(`${t}login?google=${e.credential}`).then(async e=>(n=(await e.json()).key,localStorage.password=n,l())).catch(e=>{console.error(e),alert("Error, try again")})}n&&l(),window.initGoogle=()=>{try{google.accounts.id.initialize({client_id:"516833862039-266jetktablfudij902s6t6hhg9fcjoa.apps.googleusercontent.com",callback:c}),o.value=!0}catch(e){i=!0,o.value=!0,console.error(e)}},document.head.querySelector("[data-id=google]").addEventListener("load",initGoogle,{once:!0});let u=new Promise(e=>{if(o.value)return e();o.subscribe(document,()=>e())});async function d(){return n}function p(){localStorage.posponedPosts=JSON.stringify(s)}function m(e,t){s.push([e,t]),p()}function g(){if(logged.value){let e=s.length;for(let t=0;t<e;t++)post(...s.shift()),p()}}async function v(){let e=new Set,t=await window.drugSurveys;for(let a of selectedDrugs.value)for(let n of t[a])finishedSurveys.value.includes(n)||e.add(n);for(let t of JSON.parse(localStorage.pendingSurveys||"[]"))finishedSurveys.value.includes(t)||e.add(t);return[...e]}async function f(){if(logged.value&&Date.now()-(localStorage.surveyTimestamp||0)>144e5){let e=await get("surveys"),t=e.finished.filter(e=>!finishedSurveys.value.includes(e));finishedSurveys.value.push(...t),finishedSurveys.event.dispatch();let a=e.pending.filter(e=>!finishedSurveys.value.includes(e));localStorage.pendingSurveys=JSON.stringify(a),a.length&&pendingSurveys.add(a),localStorage.surveyTimestamp=Date.now()}}function b(){let e=location.hash.match(/^#\/question\/(.+)/);e&&(notificationConfirmation=!0,notificationText.value=decodeURIComponent(e[1]))}function y(){logged.value&&Date.now()-(localStorage.telegramTimestamp||0)>144e5&&checkTelegram()}async function w(){let e=await window.activities,t=htmlToElement("<section></section>");return t.append(...registerHistory.value.map(t=>{let a=e.includes(t.type);return htmlToElement(`<article class="history-item">
			<article class="history-field">
				<p class="name"><span>Tipo</span>:</p>
				<p class="content">${t.type}</p>
			</article>
			<article class="history-field">
				<p class="name"><span>Fecha</span>:</p>
				<p class="content">${new Date(t.timestamp).toLocaleString()}</p>
			</article>
			<article class="history-field">
				<p class="name"><span>${a?"Ejercicio":"Situaci\xf3n"}</span>:</p>
				<p class="content">${t.situation}</p>
			</article>
			<article class="history-field">
				<p class="name"><span>${a?"Satisfacci\xf3n":"Deseo"}</span>:</p>
				<p class="content">${t.desire}</p>
			</article>
		</article>`)})),t}async function h(){let e,t=htmlToElement(`<main>
		<footer class="main-footer">
			<a data-mode="register"><i class="fas fa-file-signature"></i></a>
			<a class="selected-icon"><i class="fas fa-history"></i></a>
			<a data-mode="settings"><i class="fas fa-cog"></i></a>
		</footer>
		<div class="footer-space"></div>
	</main>`);for(let a of(t.prepend(htmlToElement('<p class="title history-title">Historial de actividad</p>'),registerHistory.value.length?await w():((e=htmlToElement(`<p class="empty-history">El historial est\xe1 vac\xedo. <a>Registrar actividad</a></p>`)).querySelector("a").onclick=()=>appMode.value="register",e)),t.querySelectorAll("[data-mode]")))a.onclick=()=>appMode.value=a.getAttribute("data-mode");return t}async function S(e){let t=await window.activities;return!!selectedDrugs.value.every(e=>t.includes(e))||!!e&&t.includes(e.value)}function T(){let e=new Date;return`${e.getHours()}:${String(e.getMinutes()).padStart(2,"0")}`}async function x(){return(await drugs).map(e=>`<label>
		<input type="checkbox" name="${e}" ${selectedDrugs.value.includes(e)&&"checked"||""}>
		<div class="checkbox"></div><span>${e}</span>
	</label>`).join("")}async function k(){return(await goals).map(e=>`<label>
		<input type="checkbox" name="${e}" ${selectedGoals.value.includes(e)&&"checked"||""}>
		<div class="checkbox"></div><span>${e}</span>
	</label>`).join("")}async function D(){let e=htmlToElement(`<main>
		<p class="title selection-title">Selecciona las adicciones o actividades para las que quieres usar la app</p>
		<form class="selection-form">
			${await x()}
			<button class="button">Guardar</button>
		</form>
		<p class="title selection-title">Selecciona las que encajen con tu situaci\xf3n</p>
		<form class="selection-form">
			${await k()}
			<button class="button">Guardar</button>
		</form>
		<p class="title selection-title">Activar notificaciones</p>
		<p class="info-text">Pulsa <a href="http://t.me/PrescindeBot" target="_blank" rel="noopener">aqu\xed</a> para asociar <b>${logged.value}</b> a nuestro bot de Telegram. El c\xf3digo de activaci\xf3n es <b>${telegramCode()}</b>.</p>
		<footer class="main-footer">
			<a data-mode="register"><i class="fas fa-file-signature"></i></a>
			<a data-mode="history"><i class="fas fa-history"></i></a>
			<a class="selected-icon"><i class="fas fa-cog"></i></a>
		</footer>
		<div class="footer-space"></div>
	</main>`),t=e.querySelectorAll("form");for(let a of(t[0].onsubmit=e=>{e.preventDefault();let a=[...new FormData(t[0]).keys()];a.length?(selectedDrugs.value=a,alert("Guardado")):alert("Debes elegir al menos una")},t[1].onsubmit=e=>{e.preventDefault();let a=[...new FormData(t[1]).keys()];a.length?(selectedGoals.value=a,alert("Guardado")):alert("Debes elegir al menos una")},e.querySelectorAll("[data-mode]")))a.onclick=()=>appMode.value=a.getAttribute("data-mode");return e}async function q(){return(await drugs).map(e=>`<label>
		<input type="checkbox" name="${e}">
		<div class="checkbox"></div><span>${e}</span>
	</label>`).join("")}async function E(){let e=htmlToElement(`<main class="selection-screen">
		<p class="title selection-title">Selecciona las adicciones o actividades para las que quieres usar la app</p>
		<form class="selection-form" id="selection">
			${await q()}
		</form>
		<button class="button" form="selection">Continuar</button>
	</main>`),t=e.querySelector("form");return t.onsubmit=e=>{e.preventDefault();let a=[...new FormData(t).keys()];a.length?(selectedDrugs.value=a,loadScreen()):alert("Debes elegir al menos una")},e}async function $(){return(await goals).map(e=>`<label>
		<input type="checkbox" name="${e}">
		<div class="checkbox"></div><span>${e}</span>
	</label>`).join("")}async function O(){let e=htmlToElement(`<main class="selection-screen">
		<p class="title selection-title">Selecciona las que encajen con tu situaci\xf3n</p>
		<form class="selection-form" id="selection">
			${await $()}
		</form>
		<button class="button" form="selection">Continuar</button>
	</main>`),t=e.querySelector("form");return t.onsubmit=e=>{e.preventDefault();let a=[...new FormData(t).keys()];a.length?(selectedGoals.value=a,loadScreen()):alert("Debes elegir al menos una")},e}async function A(){let e=await window.pendingSurveys.value,t=e[surveyIndex.value];finishedSurveys.value.includes(t)&&surveyIndex.value++;let a=htmlToElement(`<main>
		<p class="title form-title">Rellena el siguiente formulario para continuar</p>
		<p class="form-subtitle">Formulario ${surveyIndex.value+1} de ${e.length}</p>
		<iframe class="google-form" src="${(await surveys)[t]+encodeURIComponent(logged.value)}">Cargando…</iframe>
	</main>`),n=0;return a.querySelector("iframe").onload=()=>{++n>1&&(finishedSurveys.push(e[surveyIndex.value]),surveyIndex.value++)},a}window.signIn=async function(){if(await u,i)throw alert("Es necesario activar las cookies para poder loguearse. Este error puede deberse a navegar en modo inc\xf3gnito.");google.accounts.id.prompt(e=>{e.isNotDisplayed()&&alert("Es necesario abrir el enlace en un navegador para poder loguearse.")})},window.get=function(e,a){return new Promise((n,s)=>{d().then(o=>{let i=new XMLHttpRequest;i.open(a?"POST":"GET",t+e+"?token="+o),i.responseType="json",i.onload=()=>{i.status<400?n(i.response):s(i.statusText)},i.onerror=()=>s(i.statusText),i.send(a&&JSON.stringify(a))}).catch(s)})},window.post=function(e,a){d().then(n=>{let s=new XMLHttpRequest;s.open("POST",t+e+"?token="+n),s.onload=()=>{s.status>=400&&m(e,a)},s.onerror=()=>m(e,a),s.send(JSON.stringify(a))}).catch(()=>m(e,a))},g(),logged.subscribe(document,g),setInterval(g,3e5),window.timestamp=function(){return Date.now()},window.registerHistory=new Observable(JSON.parse(localStorage.registerHistory||"[]")),registerHistory.add=function(e){registerHistory.value.unshift(e)>30&&(registerHistory.value.length=30),registerHistory.event.dispatch()},registerHistory.subscribe(document,()=>localStorage.registerHistory=JSON.stringify(registerHistory.value)),window.sendRegister=function(e){let t={type:e.type&&e.type.value||selectedDrugs.value[0],timestamp:timestamp(),situation:e.situation.value,desire:e.desire.value};post("register",t),registerHistory.add(t)},window.finishedSurveys=new Observable(JSON.parse(localStorage.finishedSurveys||"[]")),finishedSurveys.push=function(e){finishedSurveys.value.push(e),post("survey",{survey:e,timestamp:timestamp()}),finishedSurveys.event.dispatch()},finishedSurveys.subscribe(document,()=>localStorage.finishedSurveys=JSON.stringify(finishedSurveys.value)),window.pendingSurveys=new Observable(v()),pendingSurveys.add=async function(e){let t=await window.pendingSurveys.value,a=[...new Set([...t,...await e])];a.length>t.length&&(window.pendingSurveys.value=new Promise(e=>e(a)))},selectedDrugs.subscribe(document,()=>pendingSurveys.add(v())),window.surveyIndex=new Observable(0),f(),logged.subscribe(document,f),setInterval(f,3e5),window.notificationText=new Observable(null),window.notificationConfirmation=null,window.telegramActivated=new Observable(JSON.parse(localStorage.telegramActivated||"1")),telegramActivated.subscribe(document,()=>localStorage.telegramActivated=JSON.stringify(telegramActivated.value)),window.telegramCode=function(){return(logged.value.split("").reduce((e,t)=>Math.imul(e,31)+t.charCodeAt()>>>0,0)%1e4).toString().padStart(4,"0")},window.sendAnswer=function(e){post("answer",{text:notificationText.value,answer:e,timestamp:timestamp()}),notificationText.value=null},window.checkTelegram=async function(){let e=await get("telegram-active",{code:telegramCode()});return e!=telegramActivated.value&&(telegramActivated.value=e),localStorage.telegramTimestamp=Date.now(),e},b(),window.addEventListener("popstate",b),notificationText.subscribe(document,()=>{notificationText.value||(location.hash="")}),y(),logged.subscribe(document,y),setInterval(y,3e5);let G=0;function H(){document.querySelector(".google-form")||loadScreen()}window.loadScreen=async function(){let e;scrollTo(0,0);let t=++G;if(logged.value){if(selectedDrugs.value.length){if(selectedGoals.value.length){if(telegramActivated.value){if((await pendingSurveys.value).length>surveyIndex.value)e=A();else if(notificationText.value){let t,a;(t=htmlToElement(`<main class="confirmation-screen">
		<section>
			<p class="title confirmation-title">${notificationText.value}</p>
		</section>
	</main>`)).querySelector("section").appendChild((notificationConfirmation?((a=htmlToElement(`<article class="confirmation-buttons">
			<button class="button yes-button">S\xed</button>
			<button class="button no-button">No</button>
		</article>`)).querySelector(".yes-button").onclick=()=>sendAnswer("S\xed"),a.querySelector(".no-button").onclick=()=>sendAnswer("No")):(a=htmlToElement(`<article class="confirmation-buttons">
			<button class="button">Entendido</button>
		</article>`)).querySelector(".button").onclick=()=>notificationText.value=null,a)),e=t}else"settings"==appMode.value?e=D():"register"==appMode.value?e=function(){let e=htmlToElement(`<main>
		<p class="title register-title"></p>
		<form class="register-form">
			${selectedDrugs.value.length>1?`<label>
			<select name="type" required>
				<option value="" selected>Tipo de droga o actividad</option>
				${selectedDrugs.value.map(e=>`<option value="${e}">${e.charAt(0).toUpperCase()+e.slice(1)}</option>`).join("")}
			</select>
			<p>Tipo de droga o actividad</p>
		</label>`:""}
			<label>
				<input type="text" placeholder="Hora" value="${T()}" readonly>
				<p>Hora</p>
			</label>
			<label>
				<input name="situation" type="text">
				<p></p>
			</label>
			<label>
				<select name="desire" required>
					<option value="" selected></option>
					<option>0</option>
					<option>1</option>
					<option>2</option>
					<option>3</option>
					<option>4</option>
					<option>5</option>
					<option>6</option>
					<option>7</option>
					<option>8</option>
					<option>9</option>
					<option>10</option>
				</select>
				<p></p>
			</label>
			<button class="button">Registrar</button>
		</form>
		<footer class="main-footer">
			<a class="selected-icon"><i class="fas fa-file-signature"></i></a>
			<a data-mode="history"><i class="fas fa-history"></i></a>
			<a data-mode="settings"><i class="fas fa-cog"></i></a>
		</footer>
		<div class="footer-space"></div>
	</main>`),t=e.querySelector("[name=type]");async function a(){let a=await S(t);e.querySelector(".register-title").innerHTML=a?"Registra tu actividad <b>antes</b> o <b>despu\xe9s</b> de realizarla":"Registra tu actividad <b>antes</b> de consumir",e.querySelector("[name=situation]").placeholder=a?"Tipo de ejercicio":"Situaci\xf3n",e.querySelector("[name=situation] + p").textContent=a?"Tipo de ejercicio":"Situaci\xf3n",e.querySelector("[name=desire] > option").innerHTML=a?"Grado de satisfacci\xf3n":"Grado de deseo",e.querySelector("[name=desire] + p").textContent=a?"Grado de satisfacci\xf3n":"Grado de deseo"}a(),t&&t.addEventListener("change",a);let n=e.querySelector("input"),s=setInterval(()=>{document.contains(n)?n.value=T():clearInterval(s)},3e3),o=e.querySelector("form");for(let t of(o.onsubmit=e=>{e.preventDefault(),sendRegister(o.elements),appMode.value="history"},e.querySelectorAll("[data-mode]")))t.onclick=()=>appMode.value=t.getAttribute("data-mode");return e}():e=h()}else{let t,a;(a=(t=htmlToElement(`<main class="selection-screen">
		<p class="title">Activar notificaciones</p>
		<p class="info-text">Pulsa <a href="http://t.me/PrescindeBot" target="_blank" rel="noopener">aqu\xed</a> para asociar <b>${logged.value}</b> a nuestro bot de Telegram. El c\xf3digo de activaci\xf3n es <b>${telegramCode()}</b>.</p>
		<button class="button confirm-button">Hecho</button>
	</main>`)).querySelector("button")).onclick=async()=>{a.disabled=!0,await checkTelegram().then(e=>{e||alert("Comprueba que el bot se ha activado correctamente")}).catch(()=>alert("Error, vuelve a intentarlo m\xe1s tarde")),a.disabled=!1},e=t}}else e=O()}else e=E()}else{let t;(t=htmlToElement(`<main class="welcome-screen">
		<section>
			<article>
				<p class="main-title">Prescinde</p>
				<img class="main-logo" src="images/logo.jpeg">
			</article>
			<article>
				<p class="main-msg">Inicia sesi\xf3n para comenzar a superar tus adicciones</p>
				<a class="sign-in">
					<div><img src="images/google.svg"> Acceder con Google</div>
				</a>
			</article>
		</section>
	</main>`)).querySelector(".sign-in").onclick=signIn,e=t}e=await e,t==G&&document.querySelector("main").replaceWith(e)},loadScreen(),logged.subscribe(document,loadScreen),appMode.subscribe(document,loadScreen),pendingSurveys.subscribe(document,H),surveyIndex.subscribe(document,loadScreen),notificationText.subscribe(document,H),telegramActivated.subscribe(document,H);