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
              role {
                name
              }
            }
          }
        }      
      }
      ${PersonLink.fragments.person}      
    `
  }

  // TODO: avoid using role names for filtering
  static creatorNames = ['Director', 'Scenarist', 'Writer', 'Composer', 'Producer']
  static castNames = ['Actor']

  filterCreators(role: Object): boolean {
    return MovieCast.creatorNames.indexOf(role.name) !== -1
  }

  filterCast(role: Object): boolean {
    return MovieCast.castNames.indexOf(role.name) !== -1
  }

  filterCrew(role: Object): boolean {
    return MovieCast.creatorNames.concat(MovieCast.castNames).indexOf(role.name) === -1
  }

  /**
   * Sort creators in the order of priority, defined in creatorNames
   */
  sortCreators(edge1: Object, edge2: Object) {
    return MovieCast.creatorNames.indexOf(edge1.node.role.name)
      - MovieCast.creatorNames.indexOf(edge2.node.role.name)
  }

  renderPersons(roleFilter: Function, roleSort?: Function) {
    let roles = this.props.movie.cast.edges.filter(({ node }) => roleFilter(node.role))
    if (roleSort) {
      roles = roles.sort(roleSort)
    }
    return roles.map(({ node }) =>
      (<div key={node.id} styleName="person">
        <div styleName="image"><PersonImage person={node.person}/></div>
        <div>
          <PersonLink person={node.person}/>
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
            {this.renderPersons(this.filterCreators, this.sortCreators)}
          </div>
        </Block>
        <Block title="Cast">
          <div styleName="cast">
            {this.renderPersons(this.filterCast)}
          </div>
        </Block>
        <Block title="Crew">
          <div styleName="cast">
            {this.renderPersons(this.filterCrew)}
          </div>
        </Block>
      </div>
    )
  }
}
