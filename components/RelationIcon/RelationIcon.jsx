// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

type Props = { className?: string, code: string, object: Object, displayCounts: boolean }

export default class RelationIcon extends React.Component<Props> {
  static defaultProps = {
    displayCounts: true,
  }
  static propTypes = {
    className: PropTypes.string.isRequired,
    object: PropTypes.object.isRequired,
    code: PropTypes.string.isRequired,
    displayCounts: PropTypes.bool,
  }

  changeRelation = () => {
    console.log(this.props.code)
  }

  render() {
    return (
      <span className={this.props.className} onClick={this.changeRelation}>
        <span className={this.props.object.relation[this.props.code] ? 'active' : ''}>
          <i/>{this.props.displayCounts ? this.props.object.relationsCount[this.props.code] : ''}
        </span>
      </span>
    )
  }
}
