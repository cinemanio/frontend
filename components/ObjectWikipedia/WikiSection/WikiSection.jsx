// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

type Props = { section: Object }

export default class WikiSection extends React.PureComponent<Props> {
  static propTypes = {
    section: PropTypes.object.isRequired,
  }

  renderTitle() {
    return !this.props.section.data.title ? null : <p><strong>{this.props.section.data.title}</strong></p>
  }

  renderContent() {
    return !this.props.section.wiki ? null : <p>{this.props.section.wiki}</p>
  }

  render() {
    return (
      <div>
        {this.renderTitle()}
        {this.renderContent()}
      </div>
    )
  }
}
