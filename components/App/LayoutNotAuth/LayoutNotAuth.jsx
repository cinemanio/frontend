// @flow
import React from 'react'
import { observer, inject, PropTypes as MobxPropTypes } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import { translate, type Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'

import User from 'stores/User'
import i18nClient from 'libs/i18nClient'

import routes from '../routes'
import Layout, { type Props as LayoutProps } from '../Layout/Layout'

type Props = LayoutProps & { user: typeof User, i18n: Translator }

@translate()
@inject('user')
@observer
export default class LayoutNotAuth extends React.Component<Props> {
  static defaultProps = {
    user: User,
    i18n: i18nClient,
  }

  static propTypes = {
    user: MobxPropTypes.observableObject,
    i18n: PropTypes.object,
  }

  render() {
    const { user, ...props } = this.props
    return user.authenticated ? <Redirect to={routes.index} /> : <Layout {...props} />
  }
}
