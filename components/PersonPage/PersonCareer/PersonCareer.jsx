// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'
import _ from 'lodash'

import MovieLink from 'components/MovieLink/MovieLink'
import MovieImage from 'components/MovieImage/MovieImage'
import Block from 'components/Block/Block'
import i18n from 'libs/i18n'

import './PersonCareer.scss'

type Props = { person: Object, t: Function }

export default class PersonCast extends React.Component<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  }

  static fragments = {
    person: gql`
      fragment PersonCareer on PersonNode {
        career {
          edges {
            node {
              id 
              ${i18n.gql('name')}
              movie {
                ${i18n.gql('title')}
                year
                ...MovieLink
              }
              role {
                ${i18n.gql('name')}
              }
            }
          }
        }      
      }
      ${MovieLink.fragments.movie}      
    `
  }

  /**
   * Aggregate list or roles by movie and generate `roles` array will all roles
   * @returns {Array}
   */
  get aggregatedCareerEdges(): Array<Object> {
    const career = {}
    this.props.person.career.edges.forEach((edge: Object) => {
      if (!career[edge.node.movie.id]) {
        career[edge.node.movie.id] = _.cloneDeep(edge)
        career[edge.node.movie.id].node.roles = []
      }
      career[edge.node.movie.id].node.roles.push(edge.node[i18n.f('name')] || edge.node.role[i18n.f('name')])
    })
    return _.values(career)
  }

  renderCareer() {
    return this.aggregatedCareerEdges.map(({ node }) =>
      (<div key={node.id} styleName="movie">
        <div styleName="image"><MovieImage movie={node.movie} type="icon"/></div>
        <div>
          <div styleName="title">
            <MovieLink movie={node.movie}>
              {node.movie[i18n.f('title')]}
            </MovieLink>
            ({node.movie.year})
          </div>
          <div>{node.roles.join(', ')}</div>
        </div>
      </div>)
    )
  }

  render() {
    return (
      <div styleName="box">
        <Block title={this.props.t('person.career.title')}>
          <div styleName="career">
            {this.renderCareer()}
          </div>
        </Block>
      </div>
    )
  }
}
