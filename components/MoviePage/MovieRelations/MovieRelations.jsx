// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import relationFragment from 'components/RelationIcon/relationFragment'
import RelationIcon from 'components/RelationIcon/RelationIcon'

import './MovieRelations.scss'

type Props = { movie: Object }

export default class MovieRelations extends React.Component<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired,
  }

  static codes = ['fav', 'like', 'seen', 'dislike', 'want', 'ignore', 'have']
  static fragments: Object

  render(): Array<React.Fragment> {
    return MovieRelations.codes.map(code =>
      (<RelationIcon
        key={code}
        styleName={code}
        code={code}
        object={this.props.movie}
        {...this.props}
      />),
    )
  }
}

MovieRelations.fragments = { movie: relationFragment('Movie', MovieRelations.codes) }
