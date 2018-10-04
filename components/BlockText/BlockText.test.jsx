import React from 'react'
import { mount } from 'enzyme'
import faker from 'faker'

import i18nClient from 'libs/i18nClient'
import { mountOptions } from 'tests/helpers'

import BlockText from './BlockText'

describe('BlockText Component', () => {
  let element
  let wrapper
  let title
  let contentSmall
  let contentBig

  beforeAll(() => i18nClient.changeLanguage('en'))
  beforeEach(() => {
    title = faker.lorem.sentence()
    contentSmall = faker.lorem.paragraphs(4).substring(0, BlockText.symbolsLimit - 10)
    contentBig = faker.lorem.paragraphs(4).substring(0, BlockText.symbolsLimit + 10)
  })

  it('should render title and content', () => {
    element = <BlockText title={title} content={contentSmall}/>
    wrapper = mount(element, mountOptions)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain(contentSmall)
    expect(wrapper.find('button')).toHaveLength(0)
  })

  it('should cut content and render more button', () => {
    element = <BlockText title={title} content={contentBig}/>
    wrapper = mount(element, mountOptions)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).not.toContain(contentBig)
    expect(wrapper.find('button')).toHaveLength(1)
  })

  it('should cut content and render more button with special renderer in children prop', () => {
    element = <BlockText title={title} content={contentBig}>{text => text}</BlockText>
    wrapper = mount(element, mountOptions)
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).not.toContain(contentBig)
    expect(wrapper.find('button')).toHaveLength(1)
  })
})
