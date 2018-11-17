// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import fragment from 'components/Relation/fragment'
import mutation from 'components/Relation/mutation'
import Relation from 'components/Relation/Relation'

import './PersonRelations.scss'

const codes = ['fav', 'like', 'dislike']

type Props = { person: Object }

export default class PersonRelations extends React.Component<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired,
  }

  static codes = codes

  static fragments = {
    person: fragment('Person', codes),
    relate: mutation('Person', codes),
  }

  icons = {
    fav: { type: 'star' },
    like: { type: 'like' },
    dislike: { type: 'dislike' },
  }

  modifyOptimisticResponse = (response: Object, code: string, value: boolean) => {
    if (code === 'fav' && value) {
      response.relate.relation.like = true
    }
    return response
  }

  render(): Array<React.Fragment> {
    return codes.map(code => (
      <Relation
        key={code}
        iconProps={this.icons[code]}
        styleName={code}
        code={code}
        object={this.props.person}
        mutation={PersonRelations.fragments.relate}
        fragment={PersonRelations.fragments.person}
        modifyOptimisticResponse={this.modifyOptimisticResponse}
        {...this.props}
      />
    ))
  }
}
