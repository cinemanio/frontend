// @flow
import React from 'react'
import { observer, inject, PropTypes as MobxPropTypes } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import { withAlert } from 'react-alert'
import { translate, type Translator } from 'react-i18next'
import { PropTypes } from 'prop-types'

import User from 'stores/User'
import i18nClient from 'libs/i18nClient'

import routes from '../routes'
import Layout, { type Props as LayoutProps } from '../Layout/Layout'

type Props = LayoutProps & { user: typeof User, i18n: Translator, alert: Object }

@withAlert
@translate()
@inject('user')
@observer
export default class LayoutAuth extends React.Component<Props> {
  static defaultProps = {
    user: User,
    i18n: i18nClient,
    alert: {},
  }

  static propTypes = {
    user: MobxPropTypes.observableObject,
    i18n: PropTypes.object,
    alert: PropTypes.object,
  }

  componentDidMount() {
    if (!this.props.user.authenticated) {
      this.props.alert.error(this.props.i18n.t('alert.notAuthenticated'))
    }
  }

  render() {
    const { user, ...props } = this.props
    return user.authenticated ? <Layout {...props} /> : <Redirect to={routes.signin} />
  }
}
