// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import PersonLink from '../../../components/PersonLink/PersonLink'
import Block from '../../../components/Block/Block'

import './MovieCast.scss'

type Props = { movie: Object }

export default class MovieCast extends React.Component<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired
  }

  static fragments = {
    movie: gql`
      fragment MovieCast on MovieNode {
        cast {
          edges {
            node {
              id 
              name
              person {
                ...PersonLink
                gender
              }
              role { name }
            }
          }
        }      
      }
      ${PersonLink.fragments.person}      
    `
  }

  renderCast() {
    return this.props.movie.cast.edges.map(({ node }, i) =>
      (<div key={node.id}>
        <PersonLink person={node.person}/>
        ({node.role.name}: {node.name})
      </div>)
    )
  }

  render() {
    return (
      <Block title="Cast" styleName="container">
        {this.renderCast()}
      </Block>
    )
  }
}
