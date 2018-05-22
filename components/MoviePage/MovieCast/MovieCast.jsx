// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import PersonLink from 'components/PersonLink/PersonLink'
import PersonImage from 'components/PersonImage/PersonImage'
import Block from 'components/Block/Block'
import i18n from 'libs/i18n'

import './MovieCast.scss'

type Props = { movie: Object, t: Function }

export default class MovieCast extends React.Component<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  }

  static fragments = {
    movie: gql`
      fragment MovieCast on MovieNode {
        cast {
          edges {
            node {
              id 
              ${i18n.gql('name')}
              person {
                ${i18n.gql('name')}
                gender
                ...PersonLink
              }
              role {
                name
                ${i18n.gql('name')}
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

  getPersons(roleFilter: Function, roleSort?: Function) {
    let roles = this.props.movie.cast.edges.filter(({ node }) => roleFilter(node.role))
    if (roleSort) {
      roles = roles.sort(roleSort)
    }
    return roles
  }

  renderPersons(roles: Array<Object>): Array<React.Fragment> {
    return roles.map(({ node }) =>
      (<div key={node.id} styleName="person">
        <div styleName="image"><PersonImage person={node.person}/></div>
        <div>
          <PersonLink person={node.person}>
            {node.person[i18n.f('name')]}
          </PersonLink>
          <div>{node[i18n.f('name')] || node.role[i18n.f('name')]}</div>
        </div>
      </div>)
    )
  }

  renderBlock(title: string, persons: Array<Object>) {
    return persons.length === 0 ? '' : (
      <Block title={title}>
        <div styleName="cast">
          {this.renderPersons(persons)}
        </div>
      </Block>
    )
  }

  render() {
    return (
      <div styleName="box">
        {this.renderBlock('', this.getPersons(this.filterCreators, this.sortCreators))}
        {this.renderBlock(this.props.t('movie.cast.cast'), this.getPersons(this.filterCast))}
        {this.renderBlock(this.props.t('movie.cast.crew'), this.getPersons(this.filterCrew))}
      </div>
    )
  }
}
