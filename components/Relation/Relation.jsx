// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import { Mutation } from 'react-apollo'

type Props = {
  className?: string,
  code: string,
  object: Object,
  displayCounts: boolean,
  mutation: Object,
}

export default class Relation extends React.Component<Props> {
  static defaultProps = {
    displayCounts: true
  }
  static propTypes = {
    className: PropTypes.string.isRequired,
    object: PropTypes.object.isRequired,
    code: PropTypes.string.isRequired,
    displayCounts: PropTypes.bool,
    mutation: PropTypes.object.isRequired,
  }

  changeRelation = (relate: Function) => () => {
    console.log(this.props.code)
    relate({ variables: { id: this.props.object.id, code: this.props.code } })
  }

  updateCache = (cache, { data: { addTodo } }) => {
    // const { todos } = cache.readQuery({ query: GET_TODOS });
    // cache.writeQuery({
    //   query: GET_TODOS,
    //   data: { todos: todos.concat([addTodo]) }
    // });
  }

  render() {
    return (
      <Mutation mutation={this.props.mutation} update={this.updateCache}>
        {(relate, { data }) => (
          <span className={this.props.className} onClick={this.changeRelation(relate)}>
            <span className={this.props.object.relation[this.props.code] ? 'active' : ''}>
              <i/>{this.props.displayCounts ? this.props.object.relationsCount[this.props.code] : ''}
            </span>
          </span>
        )}
      </Mutation>
    )
  }
}
