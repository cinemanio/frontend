// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Mutation } from 'react-apollo'

import mutationResponse from './mutationResponse'

type Props = {
  className: string,
  code: string,
  object: Object,
  displayCounts?: boolean,
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
    const optimisticResponse = mutationResponse(this.props.object, this.props.code)
    return relate({
      variables: {
        id: this.props.object.id,
        code: this.props.code,
      },
      optimisticResponse: this.props.modifyOptimisticResponse(optimisticResponse,
        this.props.code, this.props.object.relation[this.props.code]),
    })
  }

  updateCache = (cache: Object, { data: { relate: { relation, count } } }: Object) => {
    // eslint-disable-next-line no-underscore-dangle
    const type = this.props.object.__typename.replace('Node', '')
    cache.writeFragment({
      id: `${type}Node:${this.props.object.id}`,
      fragment: this.props.fragment,
      fragmentName: `${type}Relations`,
      data: { relation, relationsCount: count, __typename: `${type}Node` },
    })
  }

  render() {
    return (
      <Mutation mutation={this.props.mutation} update={this.updateCache}>
        {(relate, { data, loading }) => {
          const params = loading ? {} : { onClick: this.changeRelation(relate) }
          return (
            <span className={this.props.className} {...params}>
              <span className={this.props.object.relation[this.props.code] ? 'active' : ''}>
                <i/>
                {this.props.displayCounts ? this.props.object.relationsCount[this.props.code] : ''}
              </span>
            </span>
          )
        }}
      </Mutation>
    )
  }
}
