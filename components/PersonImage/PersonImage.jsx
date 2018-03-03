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
      <div styleName="image">
        <a href="/"><img
          src="http://movister.ru/media/cache/bd/54/bd54669b63e31cdc1dc5a2958a0388e6.jpg"
          alt={this.props.person.name}
          title={this.props.person.name}
        /></a>
      </div>
    )
  }
}
