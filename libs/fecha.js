// @flow
import fecha from 'fecha'

export default (lang: string) => {
  if (lang === 'ru') {
    fecha.i18n = {
      monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    }
  } else if (lang === 'en') {
    fecha.i18n = {
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    }
  }
  return fecha
}
