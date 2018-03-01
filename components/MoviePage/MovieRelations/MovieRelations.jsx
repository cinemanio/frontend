// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import './MovieRelations.scss'

type Props = { counts: Object }

export default class MovieRelations extends React.Component<Props> {
  static propTypes = {
    counts: PropTypes.object.isRequired
  }

  static fragments = {
    movie: gql`
      fragment MovieRelations on MovieNode {
        title
      }
    `
  }

  type = ['fav', 'like', 'seen', 'dislike', 'want', 'ignore', 'have']

  changeRelation = (type: string) => () => {
    console.log(type)
  }

  renderButtons() {
    return this.type.map(type => (
      <span key={type} styleName={type} onClick={this.changeRelation(type)}>
        <i/>{this.props.counts[type]}
      </span>
    ))
  }

  render() {
    return (
      <div styleName="relations">
        {this.renderButtons()}
      </div>
    )
  }
}
