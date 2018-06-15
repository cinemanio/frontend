// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import relationFragment from 'components/Relation/relationFragment'
import relationMutation from 'components/Relation/relationMutation'
import Relation from 'components/Relation/Relation'

import './PersonRelations.scss'

type Props = { person: Object }

export default class PersonRelations extends React.Component<Props> {
  static propTypes = {
    person: PropTypes.object.isRequired,
  }

  static codes = ['fav', 'like', 'dislike']
  static fragments: Object

  render(): Array<React.Fragment> {
    return PersonRelations.codes.map(code =>
      (<Relation
        key={code}
        styleName={code}
        code={code}
        object={this.props.person}
        mutation={relationMutation('Movie', PersonRelations.codes)}
        {...this.props}
      />),
    )
  }
}

PersonRelations.fragments = { person: relationFragment('Person', PersonRelations.codes) }
