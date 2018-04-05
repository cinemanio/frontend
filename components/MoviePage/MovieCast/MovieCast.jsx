// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import _ from 'lodash'

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
              role {
                id 
                name 
              }
            }
          }
        }      
      }
      ${PersonLink.fragments.person}      
    `
  }

  // TODO: avoid using id
  get creators(): Array<number> {
    return [7, 12, 14, 16, 18];
  }

  get cast(): Array<number> {
    return [1];
  }

  get crew(): Array<number> {
    return _.difference(_.difference(_.range(24), this.cast), this.creators)
  }

  renderPersons(roles: Array<number>) {
    return this.props.movie.cast.edges
      .filter(({ node }) => roles.indexOf(Number(node.role.id)) !== -1)
      .map(({ node }, i) =>
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
        <Block title="">
          <div styleName="cast">
            {this.renderPersons(this.creators)}
          </div>
        </Block>
        <Block title="Cast">
          <div styleName="cast">
            {this.renderPersons(this.cast)}
          </div>
        </Block>
        <Block title="Crew">
          <div styleName="cast">
            {this.renderPersons(this.crew)}
          </div>
        </Block>
      </div>
    )
  }
}
