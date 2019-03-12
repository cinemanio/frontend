// @flow
describe('Movies', () => {
  const total = 910
  const moviesSelector = '.ReactVirtualized__Grid.ReactVirtualized__List'
  const alertSelector = '.ant-alert'
  const filtersSelector = '.ant-tag'
  const dropdownSelector = '.ant-select'
  const paginationSelector = '.Pagination__box__27vNB'
  const movieYearsSelector = '.MovieInfo__box__2C79v > span:first-child'
  const movieGenresSelector = '.MovieInfo__box__2C79v > span:last-child'
  const inputYearSelector = {
    from: '.YearsFilter__values__1KkC0 > div:first-child .ant-input-number-input',
    to: '.YearsFilter__values__1KkC0 > div:last-child .ant-input-number-input',
  }
  const expectYears = (converterCallback: Function) => {
    cy.get(movieYearsSelector).should(($year: Object) => {
      const getYears = () =>
        $year
          .map((i, el) => Cypress.$(el).text())
          .get()
          .map(value => parseInt(value, 10))
      expect(getYears()).to.eql(converterCallback(getYears()))
    })
  }
  const expectSelectValue = (selectName: string, defaultOption: string) =>
    cy
      .get(`:contains("${selectName}")`)
      .next()
      .should('contain', defaultOption)
  const selectValue = value => cy.get(`.ant-select-dropdown-menu-item:contains("${value}")`).click()
  const selectDropdownValue = (selectName: string, value: string) => {
    cy.get(`:contains("${selectName}")`)
      .next(dropdownSelector)
      .click()
    selectValue(value)
    expectSelectValue(selectName, value)
  }
  const selectFilterValue = (selectName: string, value: string) => {
    cy.get(`${dropdownSelector}:contains("${selectName}")`).click()
    selectValue(value)
  }
  const expectSortedByYear = (order: 'desc' | 'asc') =>
    expectYears(years => years.sort((prev, next) => (order === 'desc' ? next - prev : prev - next)))
  const expectFilteredByYears = (min: number, max: ?number) =>
    expectYears(years => years.filter(year => min <= year <= (max || 999999)))
  const expectFilteredByGenres = (genres: Array<string>) => {
    cy.get(movieGenresSelector).should(($genres: Object) => {
      $genres
        .map((i, el) => Cypress.$(el).text())
        .get()
        .forEach((movieGenres: string) => expect(movieGenres.split(', ')).to.include.members(genres))
    })
  }
  const expectPage = (page: string) => {
    cy.get(paginationSelector).should(($container: Object) => {
      const values = $container[0].innerText.split(' / ').map(value => parseInt(value, 10))
      expect(values).to.eql([page, total])
    })
  }
  const expectAlert = (text: string) =>
    cy.get(alertSelector).should(($container: Object) => expect($container[0].innerText).to.contain(text))
  const expectFilters = (filters: Array<string>) => {
    cy.get(filtersSelector).should(($filter: Object) => {
      const getFilters = () => $filter.map((i, el) => Cypress.$(el).text()).get()
      expect(getFilters()).to.eql(filters)
    })
  }
  const filterByInputYear = (type: string, year: number) => {
    // TODO: enter is not currently working, do focus instead
    cy.get(inputYearSelector[type])
      .clear()
      .type(`${year}{enter}`)
    cy.get('input')
      .first()
      .focus()
  }

  beforeEach(() => {
    cy.lang('en')
    cy.visit('/movies')
  })

  describe('By default', () => {
    ;[['Display', 'Short'], ['Order by', 'Likes']].forEach(([selectName, defaultOption]) => {
      it(`should have selected option '${defaultOption}' of '${selectName}'`, () =>
        expectSelectValue(selectName, defaultOption))
    })
  })

  it('should display movies as big posters', () => {
    selectDropdownValue('Display', 'Posters')
  })

  it('should order by year desc', () => {
    selectDropdownValue('Order by', 'Year (new higher)')
    expectSortedByYear('desc')
  })

  it('should order by year asc', () => {
    selectDropdownValue('Order by', 'Year (old higher)')
    expectSortedByYear('asc')
  })

  it('should scroll movies to the bottom and display correct page', () => {
    expectPage(4)
    cy.get(moviesSelector).scrollTo('bottom')
    expectPage(102)
  })

  it('should filter by relation and get alert', () => {
    selectFilterValue('Relation', 'Like')
    expectAlert('Please sign in to be able to filter')
  })

  it('should filter by genre', () => {
    selectFilterValue('Genres', 'Action')
    expectFilters(['Action'])
    expectFilteredByGenres(['Action'])
  })

  it('should filter by country', () => {
    selectFilterValue('Countries', 'USA')
    expectFilters(['USA'])
  })

  it('should filter year range', () => {
    filterByInputYear('from', 2015)
    expectFilteredByYears(2015)
    expectFilters(['2015…'])
    filterByInputYear('to', 2019)
    expectFilteredByYears(2015, 2019)
    expectFilters(['2015…', '…2019'])
    filterByInputYear('to', 2015)
    expectFilteredByYears(2015, 2015)
    expectFilters(['2015'])
    cy.get('.ant-slider-handle-2').type('{rightarrow}{rightarrow}{rightarrow}{rightarrow}')
    cy.get('input')
      .first()
      .focus()
    expectFilteredByYears(2015, 2019)
    expectFilters(['2015…', '…2019'])
  })
})
