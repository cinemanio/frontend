import i18nClient from './i18nClient'

describe('i18n', () => {
  it('should generate right plural form for russian', async () => {
    i18nClient.changeLanguage('ru')
    expect(i18nClient.t('movie.info.language', { count: 1 })).toBe('язык')
    expect(i18nClient.t('movie.info.language', { count: 2 })).toBe('языки')
    expect(i18nClient.t('movie.info.language', { count: 5 })).toBe('языки')
  })
})
