// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import MovieLink from 'components/MovieLink/MovieLink'
import MovieImage from 'components/MovieImage/MovieImage'
import Block from 'components/Block/Block'

import './PersonCareer.scss'

type Props = { person: Object }

export default class PersonCast extends React.Component<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired
  }

  static fragments = {
    person: gql`
      fragment PersonCareer on PersonNode {
        career {
          edges {
            node {
              id 
              name
              movie {
                ...MovieLink
                year
              }
              role { name }
            }
          }
        }      
      }
      ${MovieLink.fragments.movie}      
    `
  }

  renderCareer() {
    return this.props.person.career.edges.map(({ node }, i) =>
      (<div key={node.id} styleName="movie">
        <div styleName="image"><MovieImage movie={node.movie}/></div>
        <div>
          <div><MovieLink movie={node.movie}/> ({node.movie.year})</div>
          <div>{node.name || node.role.name}</div>
        </div>
      </div>)
    )
  }

  render() {
    return (
      <div styleName="box">
        <Block title="Career">
          <div styleName="career">
            {this.renderCareer()}
          </div>
        </Block>
      </div>
    )
  }
}
