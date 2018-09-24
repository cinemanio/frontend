// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Mutation } from 'react-apollo'
import { withAlert } from 'react-alert'
import { inject, PropTypes as MobxPropTypes } from 'mobx-react'
import type { Translator } from 'react-i18next'
import { translate } from 'react-i18next'

import User from 'stores/User'
import i18nClient from 'libs/i18nClient'

import mutationResponse from './mutationResponse'

type Props = {
  className?: string,
  code: string,
  object: Object,
  displayCounts?: boolean,
  mutation: Object,
  fragment: Object,
  modifyOptimisticResponse: Function,
  alert: Object,
  i18n: Translator,
}

@withAlert
@inject('user')
@translate()
export default class Relation extends React.Component<Props> {
  static defaultProps = {
    className: '',
    displayCounts: true,
    user: User,
    i18n: i18nClient,
  }

  static propTypes = {
    className: PropTypes.string,
    object: PropTypes.object.isRequired,
    code: PropTypes.string.isRequired,
    displayCounts: PropTypes.bool,
    mutation: PropTypes.object.isRequired,
    fragment: PropTypes.object.isRequired,
    modifyOptimisticResponse: PropTypes.func.isRequired,
    alert: PropTypes.object.isRequired,
    user: MobxPropTypes.observableObject,
    i18n: PropTypes.object,
  }

  get objectType() {
    // eslint-disable-next-line no-underscore-dangle
    return this.props.object.__typename.replace('Node', '')
  }

  changeRelation = (relate: Function) => () => {
    if (this.props.user.authenticated) {
      const optimisticResponse = mutationResponse(this.props.object, this.props.code)
      const enabled = this.props.object.relation[this.props.code]
      relate({
        variables: {
          id: this.props.object.id,
          code: this.props.code,
        },
        optimisticResponse: this.props.modifyOptimisticResponse(optimisticResponse, this.props.code, enabled),
      })
      if (!enabled) {
        this.props.alert.success(
          this.props.i18n.t(`alert.relations.${this.objectType.toLowerCase()}.${this.props.code}`, this.props.object),
        )
      }
    } else {
      this.props.alert.error(this.props.i18n.t('alert.relations.authError'))
    }
  }

  updateCache = (cache: Object, { data: { relate: { relation, count } } }: Object) => {
    cache.writeFragment({
      id: `${this.objectType}Node:${this.props.object.id}`,
      fragment: this.props.fragment,
      fragmentName: `${this.objectType}Relations`,
      data: { relation, relationsCount: count, __typename: `${this.objectType}Node` },
    })
  }

  render() {
    return (
      <Mutation mutation={this.props.mutation} update={this.updateCache}>
        {(relate, { data, loading }) => {
          const params = loading ? {} : { onClick: this.changeRelation(relate) }
          return (
            <span className={this.props.className} {...params}>
              <span className={this.props.object.relation[this.props.code] ? 'active' : ''}>
                <i/>
                {this.props.displayCounts ? this.props.object.relationsCount[this.props.code] : ''}
              </span>
            </span>
          )
        }}
      </Mutation>
    )
  }
}
