// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import './PersonImage.scss'

type Props = { person: Object }

export default class PersonImage extends React.Component<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired
  }

  static fragments = {
    movie: gql`
      fragment PersonImage on PersonNode {
        name
      }
    `
  }

  render() {
    return (
      <div>
        <a href="/"><img
          src="http://movister.ru/media/cache/ca/70/ca70184d3b3b7916cdf86d3056c486c1.jpg"
          alt={this.props.person.name}
          title={this.props.person.name}
        /></a>
      </div>
    )
  }
}
