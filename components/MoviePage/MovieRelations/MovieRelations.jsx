// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import './MovieRelations.scss'

type Props = { movie: Object, displayCounts: boolean }

const MovieRelationsCodes = ['fav', 'like', 'seen', 'dislike', 'want', 'ignore', 'have']

export default class MovieRelations extends React.Component<Props> {
  static defaultProps = {
    displayCounts: true,
  }
  static propTypes = {
    movie: PropTypes.object.isRequired,
    displayCounts: PropTypes.bool,
  }

  static fragments = {
    movie: gql`
      fragment MovieRelations on MovieNode {
        relation {
          ...RelationFields
        }
        relationsCount {
          ...RelationCountFields
        }
      }
      fragment RelationFields on MovieRelationNode {
        ${MovieRelationsCodes.join(', ')}
      }
      fragment RelationCountFields on MovieRelationCountNode {
        ${MovieRelationsCodes.join(', ')}
      }
    `
  }

  changeRelation = (type: string) => () => {
  }

  renderButtons(): Array<React.Fragment> {
    return MovieRelationsCodes.map(type => (
      <span key={type} styleName={type} onClick={this.changeRelation(type)}>
        <span className={this.props.movie.relation[type] ? 'active' : ''}>
          <i/>{this.props.displayCounts ? this.props.movie.relationsCount[type] : ''}
        </span>
      </span>
    ))
  }

  render() {
    return (
      <div styleName="box">
        {this.renderButtons()}
      </div>
    )
  }
}
