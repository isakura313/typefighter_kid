const symbol_colors = [
  "is-primary", //стиль для легкой зеленой кнопки
  "is-info", // стиль для синей кнопки
  "is-link", // стиль для синей вроде кнопки
  "is-warning", // стиль для красной кнопки
  "is-success", // стиль для успешной синей кнопки
  "is-danger", // для прям такой очень красной
  "is-primary is-light is-outlined", // вносим небольшое разнообразие
  "is-link is-light is-outlined", // светлая кнопка только обведенная
  "is-success is-light is-outlined", // белый шрифт обведенная
]; // здесь у нас просто находится набор стилей из bulma, который можно использовать, чтобы у нас кнопку были различных стилей

// здесь у нас представлена наша информация в виде объекта, который состоит из массивов
const level_info = [
  {
    symbols: ["j", "f", "k", "d", " "],
  },
  {
    symbols: ["f", "d", "s", " ", "j", "k", "l", ";"],
  },
  {
    symbols: ["v", "i", "d", ";", " ", "d", "e", "f"],
  },
];

//получаем все звуки, которые нам нужны
var number_of_level = 0; // по дефолту нас будет запускаться уровень номер 0
var error_sound = new Audio("sounds/error_sound.wav"); //здесь у нас просто будет звук ошибки
var fail_sound = new Audio("sounds/fail_sound.wav"); //звук неудачи в нашей игре
var press_sound = new Audio("sounds/press_sound.wav"); //звук, который издается при нажатии на клавиши
var succes_sound = new Audio("sounds/success_sound.mp3"); // звук успешного прохождения уровни
var main_theme = new Audio("sounds/Main_theme_2.mp3"); //звук игры, который играет в главном меню

let modal = document.querySelector(".modal"); //модальное окно, которое у нас появляется в конце игры, чтобы продемонстрировать нам результаты
var target_error = document.querySelector(".target_error"); //ряд в таблице, в котором мы будем писать наши данные о том, кто у нас что смог достигнуть в навыких печати
let error_panel = document.querySelector(".error-panel"); // панель, в которую мы будем добалять значение, если кто-то будет ошибаться
let promo = document.querySelector(".promo"); // промо надпись, которая нам в игре самой не нужна, нужна только, чтобы игрок сам понял, что происходит в игре
let begin = document.querySelector(".begin"); // здесь у нас надпись, которая приглашает пользователя нажать enter для начала игры. Потом она у нас должна пропасть
let progress = document.getElementById("prog"); // здесь прогресс ошибок пользователя
let buttons = document.querySelector(".buttons"); // элемент в который мы будем писать наши буковки
let modal_close = document.querySelector(".modal-close"); //кнопка, при нажатии на которую у нас будет закрываться модальное окно

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max)); // функция, которая указывает от какого до какого она будет выкидывать рандомные целые числа
}

//теперь нужно отрисовать наши буковки

document.addEventListener("keydown", StartGame, {
  once: true, //после одного нажатия удалется слушатель
});

function StartGame(e) {
  if ((e.key = "Enter")) {
    error_panel.classList.remove("is-hidden"); // показываем панель ошибок сверху
    press_sound.play();
    begin.remove();
    mainGame(); //запуск функции основной игры
  }

  function drawBoard(info) {
    main_theme.play(); // запускаем основной саундтрек игры
    let str_arr = level_info[number_of_level].symbols; // получаем информацию, какие буквы рисовать
    let col_arr = symbol_colors;

    for (let i = 0; i < 20; i++) {
      let rand = getRandomInt(str_arr.length); //получаем случайных индекс буквы

      buttons.insertAdjacentHTML(
        "afterbegin",
        `<button class="game-button button is-large ${col_arr[rand]}" id='${str_arr[rand]}'> ${str_arr[rand]}  </button> `
      );
    }
  }

  function mainGame() {
    drawBoard(level_info);
    document.addEventListener("keydown", press);
  }
  var all_try = 0;
  var errors_count = 0;
  var count = 0;

  function press(e) {
    //получаем нагенерированный набор
    //после этого, если нажатая клавиши совпадает с нулевым элементом
    //удаляем его и прибавляем правильный ответ и играем звук и добавляем в общием попытки

    let elements_arr = document.querySelectorAll(".game-button"); // превращает в массив
    if (e.key == elements_arr[0].id) {
      elements_arr[0].remove();
      counts_right++;
      press_sound.play();
      all_try++;
    } else {
      errors_count++;
      error_sound.play();
      progress.value = errors_count;
      if (errors_count > 20) {
        main_theme.pause();
        main_theme.currentTime = 0;
        fail_sound.play();
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    }
    if (counts_right == 20) {
      counts_right = 0;
      number_of_level++;
      if (number_of_level == 3) {
        modal.classList.add("is-active");
        showResult(target_error, errors_count);
        modal_close.onclick = () =>{
          modal.classList.remove('is-active');
          window.location.reload();
        };
      }
      mainGame();
    }
  }


function showResult(target_El, content) {
  main_theme.pause();
  main_theme.currentTime = 0;
  succes_sound.play();
  // функция для того, чтобы можно было показывать результаты нашей печати
  //мы просто получаем данные из LocalStorage, после этого мы их фильтруем соответсвующим образом и потом передаем в отрисовку. Звучит как что-то слишком сложное
  localStorage.setItem(+new Date(), content); //функция для того, чтобы можно было показывать результаты любого их участников
  (function drawOnLoad() {
    let temp_arr = []; //создаем временный массив для того, чтобы разместить наши результаты
    for (let i = 0; i < localStorage.length; i++) {
      temp_arr.push(+localStorage.key(i));
    }
    temp_arr.sort(); // отсортировать наш массив результатов
    for (let i = 0; i < temp_arr.length; i++) {
      let item_time = new Date(temp_arr[i]); // получаем время, в которое у нас был получен результат
      target_El.insertAdjacentHTML(
        "afterend",
        `<th>${item_time.getDate()} /${item_time.getMonth()}  ${item_time.getHours()} : ${item_time.getMinutes()} </th>
              <th> ${localStorage.getItem(String(temp_arr[i]))}</th>
              `
      );
    }
  })();
}}
