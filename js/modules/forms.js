///Forms

function forms() {
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
}

module.exports = forms;