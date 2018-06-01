// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import './PersonRelations.scss'

type Props = { counts: ?Object }

export default class PersonRelations extends React.Component<Props> {
  static defaultProps = {
    counts: undefined
  }
  static propTypes = {
    counts: PropTypes.object
  }

  static fragments = {
    movie: gql`
      fragment PersonRelations on MovieNode {
        title
      }
    `
  }

  type = ['fav', 'like', 'familiar', 'dislike']

  changeRelation = (type: string) => () => {
  }

  renderButtons(): Array<React.Fragment> {
    return this.type.map(type => (
      <span key={type} styleName={type} onClick={this.changeRelation(type)}>
        <i/>{this.props.counts && this.props.counts[type]}
      </span>
    ))
  }

  render() {
    return (
      <div styleName="box">
        {this.renderButtons()}
      </div>
    )
  }
}
