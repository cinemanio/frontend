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
          src="https://st.kp.yandex.net/images/actor_iphone/iphone360_2286874.jpg"
          alt={this.props.person.name}
          title={this.props.person.name}
        /></a>
      </div>
    )
  }
}
