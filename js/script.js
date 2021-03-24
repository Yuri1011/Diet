'use strict'
window.addEventListener('DOMContentLoaded', () => {
//Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        })
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        })
    }

    function showTabcontent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabcontent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabcontent(i);
                }
            })
        }
    });

    //Timer
    const deadline = '2021-04-16';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        return {
            'totalMls': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num > 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = document.querySelector('#days'),
            hours = document.querySelector('#hours'),
            minutes = document.querySelector('#minutes'),
            seconds = document.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {

            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.totalMls <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    //ModalWindow
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearTimeout(modalTimerId);
    }


    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.getAttribute('data-close') == '') {
            closeModal();
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    })

    const modalTimerId = setTimeout(openModal, 3000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Используем classes для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.title = title;
            this.descr = descr;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.alt = alt;
            this.price = price;
            this.converter = 2
            this.changeToBYN();
        }

        changeToBYN() {
            this.price = this.price * this.converter;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                element.classList.add("menu__item");
            } else {
                this.classes.forEach(c => element.classList.add(c));
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> BYN/день</div>
                </div>`;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return res.json();
    }

    getResource('http://localhost:3000/menu').then(data => {
        data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        })
    })

///Forms
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/spiner/spinner.svg',
        success: 'Спасибо!Мы скоро с Вами свяжемся',
        failure: 'Что-то пошло не так'
    }
    forms.forEach(item => {
        bindPostData(item);
    })
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: data
        });
        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();//отменяте стандартное поведение браузера.

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;
            `;
            // form.append(statusMessage);//добавляем к форме сообщение о загрузке.
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            // const object = {};
            // formData.forEach(function (value, key) { //преобразуем в объект
            //     object[key] = value;
            // })
            const json = JSON.stringify(Object.fromEntries(formData.entries())); // также преобразуем в объект и затем в json

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            })


            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         form.reset();//очистка формы.
            //         statusMessage.remove();//очистка сообщения.
            //     } else {
            //         showThanksModal(message.failure);
            //     }
            // })

        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `<div class="modal__content">
                                    <div class="modal__close" data-close>×</div>
                                    <div class="modal__title">${message}</div>
                                 </div>`;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

// Sliders
    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),//общая обертка над каруселью.
        slidesField = document.querySelector('.offer__slider-inner'),//выстраивает внутри себя слайды.
        width = window.getComputedStyle(slidesWrapper).width; // вытаскиваем из slidesWrapper свойство с его шириной.
    let slideIndex = 1;
    let offset = 0;

//variant hard 2
    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }
    slidesField.style.width = 100 * slides.length + '%';//умножаем 100% на количество слайдов тем самым выстраиваем нужную ширину строки в которой помещаются все наши слайды.
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden'; //убираем всё что за пределами обёртки.


    slides.forEach(slide => {//устанавливаем каждому слайдеру равную ширину,чтобы они четко помещались в slidesField.
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');//используем регулярное выражение свойство replace.
    }

    function dotsOpacity() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    function slideFieldTransform() {
        slidesField.style.transform = `translateX(-${offset}px)`;
    }

    function checkOnLength() {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    next.addEventListener('click', () => {
        if (offset == deleteNotDigits(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNotDigits(width);
        }
        slideFieldTransform();

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        checkOnLength();
        dotsOpacity();
    })
    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = deleteNotDigits(width) * (slides.length - 1)
        } else {
            offset -= deleteNotDigits(width);
        }
        slideFieldTransform();

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        checkOnLength();
        dotsOpacity();
    })
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            slideIndex = slideTo;
            offset = deleteNotDigits(width);

            slideFieldTransform();
            checkOnLength();
            dotsOpacity();
        })
    })

//variant easy 1
    // showSlides(slideIndex);
    //
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }
    //
    // function showSlides(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }
    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }
    //     slides.forEach(slid => slid.style.display = 'none');
    //     slides[slideIndex - 1].style.display = 'block';
    //
    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }
    //
    // function plusSlides(n) {
    //     showSlides(slideIndex += n);
    // }
    //
    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // })
    // next.addEventListener('click', () => {
    //     plusSlides(1);
    // })
})



