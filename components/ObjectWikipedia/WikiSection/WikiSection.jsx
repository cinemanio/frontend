// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

type Props = { section: Object }

export default class WikiSection extends React.PureComponent<Props> {
  static propTypes = {
    section: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div>
        <p><strong>{this.props.section.data.title}</strong></p>
        <p>{this.props.section.wiki}</p>
      </div>
    )
  }
}
