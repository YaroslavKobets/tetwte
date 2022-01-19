var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
	},
};
function isIE() {
	ua = navigator.userAgent;
	var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
	return is_ie;
}
if (isIE()) {
	document.querySelector("html").classList.add("ie");
}
if (isMobile.any()) {
	document.querySelector("html").classList.add("_touch");
}

// Получить цифры из строки

function ibg() {
	if (isIE()) {
		let ibg = document.querySelectorAll("._ibg");
		for (var i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelector("img") && ibg[i].querySelector("img").getAttribute("src") != null) {
				ibg[i].style.backgroundImage = "url(" + ibg[i].querySelector("img").getAttribute("src") + ")";
			}
		}
	}
}
ibg();


//=================
//ActionsOnHash
if (location.hash) {
	const hsh = location.hash.replace("#", "");
	if (document.querySelector(".popup_" + hsh)) {
		popup_open(hsh);
	} else if (document.querySelector("div." + hsh)) {
		_goto(document.querySelector("." + hsh), 500, "");
	}
}
//=================
//Menu
let iconMenu = document.querySelector(".icon-menu");
if (iconMenu != null) {
	let delay = 500;
	let menuBody = document.querySelector(".menu__body");
	iconMenu.addEventListener("click", function (e) {
		if (unlock) {
			body_lock(delay);
			iconMenu.classList.toggle("_active");
			menuBody.classList.toggle("_active");
		}
	});
}
function menu_close() {
	let iconMenu = document.querySelector(".icon-menu");
	let menuBody = document.querySelector(".menu__body");
	iconMenu.classList.remove("_active");
	menuBody.classList.remove("_active");
}
//=================
//BodyLock
function body_lock(delay) {
	let body = document.querySelector("body");
	if (body.classList.contains("_lock")) {
		body_lock_remove(delay);
	} else {
		body_lock_add(delay);
	}
}
function body_lock_remove(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = "0px";
			}
			body.style.paddingRight = "0px";
			body.classList.remove("_lock");
		}, delay);

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}
function body_lock_add(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
		}
		body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
		body.classList.add("_lock");

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}
//=================
//Tabs
let tabs = document.querySelectorAll("._tabs");
for (let index = 0; index < tabs.length; index++) {
	let tab = tabs[index];
	let tabs_items = tab.querySelectorAll("._tabs-item");
	let tabs_blocks = tab.querySelectorAll("._tabs-block");
	for (let index = 0; index < tabs_items.length; index++) {
		let tabs_item = tabs_items[index];
		tabs_item.addEventListener("click", function (e) {
			for (let index = 0; index < tabs_items.length; index++) {
				let tabs_item = tabs_items[index];
				tabs_item.classList.remove("_active");
				tabs_blocks[index].classList.remove("_active");
			}
			tabs_item.classList.add("_active");
			tabs_blocks[index].classList.add("_active");
			e.preventDefault();
		});
	}
}
//=================
/*
Для родителя слойлеров пишем атрибут data-spollers
Для заголовков слойлеров пишем атрибут data-spoller
Если нужно включать\выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например: 
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
*/

// SPOLLERS
const spollersArray = document.querySelectorAll("[data-spollers]");
if (spollersArray.length > 0) {
	// Получение обычных слойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	// Инициализация обычных слойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	// Получение слойлеров с медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	// Инициализация слойлеров с медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach((item) => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		// Работаем с каждым брейкпоинтом
		mediaQueries.forEach((breakpoint) => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			// Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			// Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	// Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach((spollersBlock) => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add("_init");
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove("_init");
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	// Работа с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
		if (spollerTitles.length > 0) {
			spollerTitles.forEach((spollerTitle) => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute("tabindex");
					if (!spollerTitle.classList.contains("_active")) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute("tabindex", "-1");
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute("data-spoller") || el.closest("[data-spoller]")) {
			const spollerTitle = el.hasAttribute("data-spoller") ? el : el.closest("[data-spoller]");
			const spollersBlock = spollerTitle.closest("[data-spollers]");
			const oneSpoller = spollersBlock.hasAttribute("data-one-spoller") ? true : false;
			if (!spollersBlock.querySelectorAll("._slide").length) {
				if (oneSpoller && !spollerTitle.classList.contains("_active")) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle("_active");
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._active");
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove("_active");
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}
//=================
//Popups
let popup_link = document.querySelectorAll("._popup-link");
let popups = document.querySelectorAll(".popup");
for (let index = 0; index < popup_link.length; index++) {
	const el = popup_link[index];
	el.addEventListener("click", function (e) {
		if (unlock) {
			let item = el.getAttribute("href").replace("#", "");
			let video = el.getAttribute("data-video");
			popup_open(item, video);
		}
		e.preventDefault();
	});
}
for (let index = 0; index < popups.length; index++) {
	const popup = popups[index];
	popup.addEventListener("click", function (e) {
		if (!e.target.closest(".popup__body")) {
			popup_close(e.target.closest(".popup"));
		}
	});
}
function popup_open(item, video = "") {
	let activePopup = document.querySelectorAll(".popup._active");
	if (activePopup.length > 0) {
		popup_close("", false);
	}
	let curent_popup = document.querySelector(".popup_" + item);
	if (curent_popup && unlock) {
		if (video != "" && video != null) {
			let popup_video = document.querySelector(".popup_video");
			popup_video.querySelector(".popup__video").innerHTML =
				'<iframe src="https://www.youtube.com/embed/' + video + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
		}
		if (!document.querySelector(".menu__body._active")) {
			body_lock_add(500);
		}
		curent_popup.classList.add("_active");
		history.pushState("", "", "#" + item);
	}
}
function popup_close(item, bodyUnlock = true) {
	if (unlock) {
		if (!item) {
			for (let index = 0; index < popups.length; index++) {
				const popup = popups[index];
				let video = popup.querySelector(".popup__video");
				if (video) {
					video.innerHTML = "";
				}
				popup.classList.remove("_active");
			}
		} else {
			let video = item.querySelector(".popup__video");
			if (video) {
				video.innerHTML = "";
			}
			item.classList.remove("_active");
		}
		if (!document.querySelector(".menu__body._active") && bodyUnlock) {
			body_lock_remove(500);
		}
		history.pushState("", "", window.location.href.split("#")[0]);
	}
}
let popup_close_icon = document.querySelectorAll(".popup__close,._popup-close");
if (popup_close_icon) {
	for (let index = 0; index < popup_close_icon.length; index++) {
		const el = popup_close_icon[index];
		el.addEventListener("click", function () {
			popup_close(el.closest(".popup"));
		});
	}
}
document.addEventListener("keydown", function (e) {
	if (e.code === "Escape") {
		popup_close();
	}
});

//=================







const writesSwiper = new Swiper('.writes-slider', {
  loop: true,
  
  navigation: {
    nextEl: '.writes-slider-next',
    prevEl: '.writes-slider-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1001: {
      slidesPerView: 2,
  spaceBetween: 30,
    },
    1475: {
      slidesPerView: 3,
  spaceBetween: 60,
    },
  },
});

const introSwiper = new Swiper('.intro-slider', {
  loop: true,
  speed: 1300,
  navigation: {
    nextEl: '.intro-slider-next',
    prevEl: '.intro-slider-prev',
  }

});

