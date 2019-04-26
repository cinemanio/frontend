export default {
  title: {
    movies: 'Фильмы',
    persons: 'Персоны',
  },
  menu: {
    movies: 'Фильмы',
    persons: 'Персоны',
  },
  auth: {
    signin: 'войти',
    logout: 'выйти',
  },
  filter: {
    view: {
      sectionTitle: 'Показывать',
      poster: 'Постеры',
      photo: 'Фото',
      short: 'Кратко',
      full: 'Полно',
    },
    orderBy: {
      sectionTitle: 'Сортировать по',
      new: 'Году (новые выше)',
      old: 'Году (старые выше)',
      like: 'Популярности',
      dislike: 'Неприязни',
    },
    sectionTitle: 'Фильтровать по',
    relations: {
      sectionTitle: 'Отношению',
      authError: 'Пожалуйста войдите чтобы фильтровать по вашим предпочтениям',
      fav: 'Любимые',
      like: 'Нравятся',
      seen: 'Видел',
      dislike: 'Не нравятся',
      want: 'Хочу посмотреть',
      ignore: 'Не хочу смотреть',
      have: 'Есть в колекции',
    },
    roles: 'Ролям',
    country: 'Стране',
    genres: 'Жанрам',
    countries: 'Странам',
    yearsRange: 'Годам',
  },
  movie: {
    info: {
      language_0: 'язык',
      language_1: 'языки',
      language_2: 'языки',
    },
    sites: {
      title: 'Этот фильм на',
      imdbRating: 'Рейтинг IMDb',
      kinopoisk: 'Кинопоиск',
      kinopoiskRating: 'Рейтинг Кинопоиска',
    },
    cast: {
      cast: 'Актеры',
      crew: 'Команда',
    },
  },
  person: {
    career: {
      title: 'Фильмография',
    },
    sites: {
      title: 'Эта персона на',
    },
  },
  nothingFound: {
    persons: 'Персоны не найдены. Попробуйте изменить условия поиска.',
    movies: 'Фильмы не найдены. Попробуйте изменить условия поиска.',
  },
  wikipedia: {
    title: 'На Википедии',
  },
  kinopoisk: {
    title: 'На Кинопоиске',
  },
  block: {
    displayMore: 'узнать больше',
    displayLess: 'свернуть',
  },
  passwordForgot: {
    title: 'Восстановление пароля',
    trySignin: 'Попробовать войти снова?',
    placeholders: {
      email: 'Введите email',
    },
    errors: {
      emailRequired: 'Поле email обязательное',
      emailInvalid: 'Введенное значение не является правильным email',
    },
    submit: 'Сбросить пароль',
    submitted: 'Инструкции как сбросить пароль были отосланы на ваш email.',
  },
  passwordReset: {
    title: 'Сбросить пароль',
    placeholders: {
      password: 'Введите новый пароль',
    },
    errors: {
      passwordRequired: 'Поле пароль обязательное',
    },
    submit: 'Сохранить пароль',
  },
  passwordChange: {
    title: 'Поменять пароль',
    changeSettings: 'Поменять настройки',
    placeholders: {
      oldPassword: 'Введите старый пароль',
      newPassword: 'Введите новый пароль',
    },
    errors: {
      oldPasswordRequired: 'Поле старый пароль обязательное',
      newPasswordRequired: 'Поле новый пароль обязательное',
    },
    submit: 'Сохранить пароль',
  },
  signin: {
    title: 'Войти',
    needAccount: 'Нужна регистрация?',
    forgotPassword: 'Забыли пароль?',
    submit: 'Войти',
    placeholders: {
      username: 'Введите логин',
      password: 'Введите пароль',
    },
    errors: {
      usernameRequired: 'Поле логин обязательное',
      passwordRequired: 'Поле пароль обязательное',
    },
  },
  signup: {
    title: 'Зарегистрироваться',
    done: {
      title: 'Спасибо за регистрацию',
      message: 'Мы отправили сообщение на ваш email. Пожалуйста, подтвердите его, используя ссылку в письме.',
    },
    haveAccount: 'Есть аккаунт?',
    submit: 'Зарегистрироваться',
    placeholders: {
      username: 'Введите логин',
      email: 'Введите email',
      password: 'Введите пароль',
    },
    errors: {
      usernameRequired: 'Поле логин обязательное',
      emailRequired: 'Поле email обязательное',
      emailInvalid: 'Введенное значение не является правильным email',
      passwordRequired: 'Поле пароль обязательное',
    },
  },
  activation: {
    title: 'Активация аккаунта',
    message: 'Ваш аккаунт был успешно активирован',
  },
  settings: {
    title: 'Настройки аккаунта',
    changePassword: 'Поменять пароль',
    submit: 'Сохранить настройки',
    placeholders: {
      username: 'Введите логин',
      email: 'Введите email',
    },
    errors: {
      usernameRequired: 'Поле логин обязательное',
      emailRequired: 'Поле email обязательное',
      emailInvalid: 'Введенное значение не является правильным email',
    },
  },
  alert: {
    notAuthenticated: 'Вам нужно быть авторизоваться для доступа к этой странице',
    relations: {
      authError: 'Пожалуйста войдите чтобы мы могли сохранить ваши предпочтения',
      movie: {
        fav: 'Вы добавили в избранное фильм {{ titleRu }} ({{ year }})',
        like: 'Вам понравился фильм {{ titleRu }} ({{ year }})',
        seen: 'Вы посмотрели фильм {{ titleRu }} ({{ year }})',
        dislike: 'Вам не понравился фильм {{ titleRu }} ({{ year }})',
        want: 'Вы хотите посмотреть фильм {{ titleRu }} ({{ year }})',
        ignore: 'Вы не хотите смотреть фильм {{ titleRu }} ({{ year }})',
        have: 'У вас есть фильм {{ titleRu }} ({{ year }})',
      },
      person: {
        fav: 'Вы добавили в избранное персону {{ nameRu }}',
        like: 'Вам нравится персона {{ nameRu }}',
        dislike: 'Вам не нравится персона {{ nameRu }}',
      },
    },
  },
  search: {
    placeholder: 'Поиск по фильмам, персонам и т.д.',
  },
  titles: {
    relations: {
      movie: {
        on: {
          fav: 'Я хочу добавить в избранное этот фильм',
          like: 'Мне нравится этот фильм',
          seen: 'Я смотрел этот фильм',
          dislike: 'Мне не нравится этот фильм',
          want: 'Я хочу посмотреть этот фильм',
          ignore: 'Я не хочу смотреть этот фильм',
          have: 'У меня есть этот фильм',
        },
        off: {
          fav: 'Я не хочу добавлять в избранное этот фильм',
          like: 'Я не думаю, что мне нравится этот фильм',
          seen: 'Я не смотрел этот фильм',
          dislike: 'Я не думаю, что мне не нравится этот фильм',
          want: 'Я больше не хочу смотреть этот фильм',
          ignore: 'Я не думаю, что я больше не хочу смотреть этот фильм',
          have: 'У меня больше нет этого фильма',
        },
      },
      person: {
        on: {
          fav: 'Я хочу добавить в избранное эту персону',
          like: 'Мне нравится эта персона',
          dislike: 'Мне не нравится эта персона',
        },
        off: {
          fav: 'Я не хочу добавить в избранное эту персону',
          like: 'Я не думаю, что мне нравится эта персона',
          dislike: 'Я не думаю, что мне не нравится эта персона',
        },
      },
    },
  },
  password: {
    show: 'Показать пароль',
    hide: 'Спрятать пароль',
  },
}
