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

  render() {
    return (
      <div styleName="relations">
        <span styleName="fav"><i/>{this.props.counts.fav}</span>
        <span styleName="like"><i/>{this.props.counts.like}</span>
        <span styleName="seen"><i/>{this.props.counts.seen}</span>
        <span styleName="dislike"><i/>{this.props.counts.dislike}</span>
        <span styleName="want"><i/>{this.props.counts.want}</span>
        <span styleName="ignore"><i/>{this.props.counts.ignore}</span>
        <span styleName="have"><i/>{this.props.counts.have}</span>
      </div>
    )
  }
}
