// @flow
import * as React from 'react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'

import fragment from 'components/Relation/fragment'
import mutation from 'components/Relation/mutation'
import Relation from 'components/Relation/Relation'

import './PersonRelations.scss'
import i18nClient from 'libs/i18nClient'

const codes = ['fav', 'like', 'dislike']

type Props = { person: Object, i18n: Translator }

@translate()
export default class PersonRelations extends React.PureComponent<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    person: PropTypes.object.isRequired,
    i18n: PropTypes.object,
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

  render(): React.Node {
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
        titleOn={this.props.i18n.t(`titles.relations.person.on.${code}`)}
        titleOff={this.props.i18n.t(`titles.relations.person.off.${code}`)}
        {...this.props}
      />
    ))
  }
}
