// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Mutation } from 'react-apollo'
import _ from 'lodash'

type Props = {
  className?: string,
  code: string,
  object: Object,
  displayCounts: boolean,
  mutation: Object,
  fragment: Object,
  modifyOptimisticResponse: Function,
}

export default class Relation extends React.Component<Props> {
  static defaultProps = {
    displayCounts: true,
  }
  static propTypes = {
    className: PropTypes.string.isRequired,
    object: PropTypes.object.isRequired,
    code: PropTypes.string.isRequired,
    displayCounts: PropTypes.bool,
    mutation: PropTypes.object.isRequired,
    fragment: PropTypes.object.isRequired,
    modifyOptimisticResponse: PropTypes.func.isRequired,
  }

  changeRelation = (relate: Function) => () => {
    const { code } = this.props
    const relation = _.clone(this.props.object.relation)
    const count = _.clone(this.props.object.relationsCount)
    count[code] += !relation[code] ? 1 : -1
    relation[code] = !relation[code]
    const optimisticResponse = { relate: { relation, count, __typename: 'Relate' } }
    return relate({
      variables: { id: this.props.object.id, code },
      optimisticResponse: this.props.modifyOptimisticResponse(optimisticResponse, code, relation[code]),
    })
  }

  updateCache = (cache, { data: { relate: { relation, count } } }) => {
    cache.writeFragment({
      id: `MovieNode:${this.props.object.id}`,
      fragment: this.props.fragment,
      fragmentName: 'MovieRelations',
      data: { relation, relationsCount: count, __typename: 'MovieNode' },
    })
  }

  render() {
    return (
      <Mutation mutation={this.props.mutation} update={this.updateCache}>
        {(relate, { data, loading }) => {
          // console.log(loading)
          return (
            <span className={this.props.className} onClick={this.changeRelation(relate)}>
              <span className={this.props.object.relation[this.props.code] ? 'active' : ''}>
                <i/>{this.props.displayCounts ? this.props.object.relationsCount[this.props.code] : ''}
              </span>
            </span>
          )
        }}
      </Mutation>
    )
  }
}
