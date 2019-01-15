// @flow
import * as React from 'react'
import { PropTypes } from 'prop-types'

import fragment from 'components/Relation/fragment'
import mutation from 'components/Relation/mutation'
import Relation from 'components/Relation/Relation'

import './MovieRelations.scss'

const codes = ['fav', 'like', 'seen', 'dislike', 'want', 'ignore', 'have']

type Props = { movie: Object }

export default class MovieRelations extends React.Component<Props> {
  static propTypes = {
    movie: PropTypes.object.isRequired,
  }

  static codes = codes

  static fragments = {
    movie: fragment('Movie', codes),
    relate: mutation('Movie', codes),
  }

  icons = {
    fav: { type: 'star' },
    like: { type: 'like' },
    seen: { type: 'eye' },
    dislike: { type: 'dislike' },
    want: { type: 'check-circle' },
    ignore: { type: 'stop' },
    have: { type: 'save' },
  }

  modifyOptimisticResponse = (response: Object, code: string, value: boolean) => {
    if (code === 'fav' && value) {
      response.relate.relation.like = true
      response.relate.relation.seen = true
    }
    return response
  }

  render(): Array<React.Node> {
    return codes.map(code => (
      <Relation
        key={code}
        styleName={code}
        iconProps={this.icons[code]}
        code={code}
        object={this.props.movie}
        mutation={MovieRelations.fragments.relate}
        fragment={MovieRelations.fragments.movie}
        modifyOptimisticResponse={this.modifyOptimisticResponse}
        {...this.props}
      />
    ))
  }
}
