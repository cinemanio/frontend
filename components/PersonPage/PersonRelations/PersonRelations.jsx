// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

import relationFragment from 'components/RelationIcon/relationFragment'
import RelationIcon from 'components/RelationIcon/RelationIcon'

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
      (<RelationIcon
        key={code}
        styleName={code}
        code={code}
        object={this.props.person}
        {...this.props}
      />),
    )
  }
}

PersonRelations.fragments = { person: relationFragment('Person', PersonRelations.codes) }
