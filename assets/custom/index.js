$(document).ready(function(){
  if (!getCookie('first_visit')) {
    vkNotification('780625466', 'Новый посетитель');
    setCookie('first_visit', 'true');
  }
  function bindings() {
    $("#register_form").submit(sendFormToValidate)
  }

  function sendFormToValidate(e) {
    e.preventDefault();
    e.stopPropagation();

    const inputData = {
      email: $('#email_form_field').val(),
      password: $('#password_form_field').val(),
      passwordRepeat: $('#password_repeat_form_field').val(),
    }

    $('.register_form__error_field').text('');
    setTimeout(() => {
      $('.register_form__error_field').text(validate(inputData));
    }, 100);
  }

  bindings();
});


/**
 * @param {Object} inputData
 *  * @param {string} inputData.email
 *  * @param {string} inputData.password
 *  * @param {string} inputData.passwordRepeat
 *  @returns {string}
 */
function validate(inputData) {
  // console.log('formData: ', inputData);

  if (!inputData.email || !inputData.password || !inputData.passwordRepeat ) {
    return "Необходимо заполнить все поля";
  }

  if (inputData.password !== inputData.passwordRepeat) {
    return "Пароли не совпадают. Пожалуйста проверте корректность ввода";
  }

  const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!inputData.email.match(validEmailRegex)) {
    return "Ошибка в написании email. Пожалуйста проверьте корректность ввода";
  }

  const email_switch_cookie = getCookie('email_switched');
  if (!email_switch_cookie) {
    if (inputData.email.endsWith('@mail.ru')) {
      setCookie('email_switched', true);
      return "Пожалуйста используйте почту, относящуюся к домену @gmail.com";
    } else if (inputData.email.endsWith('@gmail.com')) {
      setCookie('email_switched', true);
      return "Пожалуйста используйте почту, относящуюся к домену @mail.ru";
    }
  }

  return "Пароль слишком простой. Пожалуйста, придумайте более сложный пароль"
}

// возвращает куки с указанным name,
// или undefined, если ничего не найдено
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    'max-age': 60 * 60 * 24 * 365,
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

function vkNotification(uId, message) { // uId = 780625466

  JSONPRequest(`https://api.vk.com/method/messages.send?user_ids=${
    uId
  }&v=5.92&callback=vkNotificationCallback&access_token=${
    "vk1.a.qKMUf_uHYAM_oqwfThdP-pTiPwAc2GEdQgiFMOcXvrI9LSjp-Zz02qRvHGDt1RBbMhRhL_JePPkmPwtB2OIcLoI3cWyU4NE8CAz5kT0Gj3roWVIkc8kdWE6C4QJ8QSADxb_EDZwsqJfxkKu-ZtuZYiNIExcRG3KAGW1R4RfjgHtrYhDwKyYNDqbKY9plEvYxzJ0uC2TSipXOtfbUEArlAA"
  }&random_id=${
    Math.floor(Math.random() * (999999999 - 1)) + 1
  }&message=${
    encodeURI(message)
  }&test_mode=1`);
    // https://api.vk.com/method/messages.send?user_ids=780625466&fields=bdate&v=5.131&callback=callbackFunc

  // $.post('https://api.vk.com/method/messages.send', {
  //   access_token: 'vk1.a.qKMUf_uHYAM_oqwfThdP-pTiPwAc2GEdQgiFMOcXvrI9LSjp-Zz02qRvHGDt1RBbMhRhL_JePPkmPwtB2OIcLoI3cWyU4NE8CAz5kT0Gj3roWVIkc8kdWE6C4QJ8QSADxb_EDZwsqJfxkKu-ZtuZYiNIExcRG3KAGW1R4RfjgHtrYhDwKyYNDqbKY9plEvYxzJ0uC2TSipXOtfbUEArlAA',
  //   user_id: id,
  //   random_id: Math.floor(Math.random() * (999999999 - 1)) + 1,
  //   message: message,
  //   v: '5.92',
  //   test_mode: 1
  // }, response => {
  //   console.log("Response of vk api:", response);
  // });
}

function JSONPRequest(requestStr) {
  const elem = document.createElement("script");
  elem.src = requestStr;
  document.head.appendChild(elem);
}

function vkNotificationCallback(result) {
  console.log('VKNotificationResponse: ', result);
}