export default {
  title: {
    movies: 'Movies',
    persons: 'Persons',
  },
  menu: {
    movies: 'Movies',
    persons: 'Persons',
  },
  auth: {
    signin: 'sign in',
    logout: 'logout',
  },
  filter: {
    view: {
      sectionTitle: 'Display',
      poster: 'Posters',
      photo: 'Photos',
      short: 'Short',
      full: 'Full',
    },
    orderBy: {
      sectionTitle: 'Order by',
      new: 'Year (new higher)',
      old: 'Year (old higher)',
      like: 'Likes',
      dislike: 'Dislikes',
    },
    sectionTitle: 'Filter by',
    relations: {
      sectionTitle: 'Relation',
      authError: 'Please sign in to be able to filter by your preferences',
      fav: 'Fav',
      like: 'Like',
      seen: 'Seen',
      dislike: 'Dislike',
      want: 'Want',
      ignore: 'Ignore',
      have: 'Have',
    },
    roles: 'Roles',
    country: 'Country',
    genres: 'Genres',
    countries: 'Countries',
    yearsRange: 'Years range',
  },
  movie: {
    info: {
      language: 'language',
      language_plural: 'languages',
    },
    sites: {
      title: 'This movie on',
      imdbRating: 'IMDb rating',
      kinopoisk: 'kinopoisk.ru',
      kinopoiskRating: 'Kinopoisk.ru rating',
    },
    cast: {
      cast: 'Cast',
      crew: 'Crew',
    },
  },
  person: {
    career: {
      title: 'Filmography',
    },
    sites: {
      title: 'This person on',
    },
  },
  nothingFound: {
    persons: 'There is no such persons. Try to change search parameters.',
    movies: 'There is no such movies. Try to change search parameters.',
  },
  wikipedia: {
    title: 'On Wikipedia',
  },
  kinopoisk: {
    title: 'On Kinopoisk',
  },
  block: {
    displayMore: 'read more',
    displayLess: 'hide',
  },
  passwordForgot: {
    title: 'Password Recovery',
    trySignin: 'Try to sign in again?',
    placeholders: {
      email: 'Enter your email',
    },
    errors: {
      emailRequired: 'Email field is required',
      emailInvalid: 'The input is not valid email',
    },
    submit: 'Reset password',
    submitted: 'Instructions how to reset your password have been sent to your email.',
  },
  passwordReset: {
    title: 'Reset Password',
    placeholders: {
      password: 'Enter new password',
    },
    errors: {
      passwordRequired: 'Password field is required',
    },
    submit: 'Save password',
  },
  passwordChange: {
    title: 'Change Password',
    changeSettings: 'Change settings',
    placeholders: {
      oldPassword: 'Enter old password',
      newPassword: 'Enter new password',
    },
    errors: {
      oldPasswordRequired: 'Old password field is required',
      newPasswordRequired: 'New password field is required',
    },
    submit: 'Save password',
  },
  signin: {
    title: 'Sign In',
    needAccount: 'Need an account?',
    forgotPassword: 'Forgot password?',
    submit: 'Sign in',
    placeholders: {
      username: 'Enter your username',
      password: 'Enter your password',
    },
    errors: {
      usernameRequired: 'Username field is required',
      passwordRequired: 'Password field is required',
    },
  },
  signup: {
    title: 'Sign Up',
    done: {
      title: 'Thanks for signing up',
      message:
        'We sent message to your email address. Please, verify it using link in the message and you are ready to go!',
    },
    haveAccount: 'Have an account?',
    submit: 'Sign up',
    placeholders: {
      username: 'Enter your username',
      email: 'Enter your email',
      password: 'Enter your password',
    },
    errors: {
      usernameRequired: 'Username field is required',
      emailRequired: 'Email field is required',
      emailInvalid: 'The input is not valid email',
      passwordRequired: 'Password field is required',
    },
  },
  activation: {
    title: 'Account Activation',
    message: 'Your account has been activated successfully',
  },
  settings: {
    title: 'Account Settings',
    changePassword: 'Change password',
    submit: 'Save settings',
    placeholders: {
      username: 'Enter your username',
      email: 'Enter your email',
    },
    errors: {
      usernameRequired: 'Username field is required',
      emailRequired: 'Email field is required',
      emailInvalid: 'The input is not valid email',
    },
  },
  alert: {
    notAuthenticated: 'You need to be authenticated to access this page',
    relations: {
      authError: 'Please sign in to be able to save your preferences',
      movie: {
        fav: 'You have favorited the movie {{ titleEn }} ({{ year }})',
        like: 'You have liked the movie {{ titleEn }} ({{ year }})',
        seen: 'You have been watched the movie {{ titleEn }} ({{ year }})',
        dislike: 'You have not liked the movie {{ titleEn }} ({{ year }})',
        want: 'You want to watch the movie {{ titleEn }} ({{ year }})',
        ignore: 'You want to hide the movie {{ titleEn }} ({{ year }})',
        have: 'You have the movie {{ titleEn }} ({{ year }})',
      },
      person: {
        fav: 'You have been favorited the person {{ nameEn }}',
        like: 'You like the person {{ nameEn }}',
        dislike: "You don't like the person {{ nameEn }}",
      },
    },
  },
  search: {
    placeholder: 'Search for movies, persons and more...',
  },
  titles: {
    relations: {
      movie: {
        on: {
          fav: 'I want to favorite this movie',
          like: 'I like this movie',
          seen: 'I have watched this movie',
          dislike: "I don't like this movie",
          want: 'I want to watch this movie',
          ignore: 'I want to hide this movie',
          have: 'I have this movie',
        },
        off: {
          fav: "I don't want to favorite this movie anymore",
          like: "I don't like this movie anymore",
          seen: "I haven't watched this movie",
          dislike: "I don't dislike this movie anymore",
          want: "I don't want to watch this movie anymore",
          ignore: "I don't want to hide this movie anymore",
          have: "I don't have this movie anymore",
        },
      },
      person: {
        on: {
          fav: 'I want to favorite this person',
          like: 'I like this person',
          dislike: "I don't like this person",
        },
        off: {
          fav: "I don't want to favorite this person",
          like: "I don't like this person anymore",
          dislike: "I don't dislike this person anymore",
        },
      },
    },
  },
  password: {
    show: 'Show password',
    hide: 'Hide password',
  },
}
