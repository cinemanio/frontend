// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import PersonLink from 'components/PersonLink/PersonLink'
import PersonImage from 'components/PersonImage/PersonImage'
import Block from 'components/Block/Block'

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
      (<div key={node.id} styleName="person">
        <div styleName="image"><PersonImage person={node.person}/></div>
        <div>
          <div><PersonLink person={node.person}/></div>
          <div>{node.name || node.role.name}</div>
        </div>
      </div>)
    )
  }

  render() {
    return (
      <div styleName="box">
        <Block title="Cast">
          <div styleName="cast">
            {this.renderCast()}
          </div>
        </Block>
      </div>
    )
  }
}
