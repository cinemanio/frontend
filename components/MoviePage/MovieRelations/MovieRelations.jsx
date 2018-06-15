// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import relationFragment from 'components/Relation/relationFragment'
import relationMutation from 'components/Relation/relationMutation'
import Relation from 'components/Relation/Relation'

import './MovieRelations.scss'

type Props = { movie: Object }

export default class MovieRelations extends React.Component<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired,
  }

  static codes = ['fav', 'like', 'seen', 'dislike', 'want', 'ignore', 'have']
  static fragments: Object

  modifyOptimisticResponse = (response: Object, code: string, value: boolean) => {
    if (code === 'fav' && value) {
      response.relate.relation.like = true
      response.relate.relation.seen = true
    }
    return response;
  }

  render(): Array<React.Fragment> {
    return MovieRelations.codes.map(code =>
      (<Relation
        key={code}
        styleName={code}
        code={code}
        object={this.props.movie}
        mutation={relationMutation('Movie', MovieRelations.codes)}
        fragment={relationFragment('Movie', MovieRelations.codes)}
        modifyOptimisticResponse={this.modifyOptimisticResponse}
        {...this.props}
      />),
    )
  }
}

MovieRelations.fragments = { movie: relationFragment('Movie', MovieRelations.codes) }
