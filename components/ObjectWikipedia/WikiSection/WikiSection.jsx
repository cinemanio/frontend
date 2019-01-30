// @flow
import React from 'react'
import { PropTypes } from 'prop-types'

type Props = { section: Object }

export default class WikiSection extends React.PureComponent<Props> {
  static propTypes = {
    section: PropTypes.object.isRequired,
  }

  renderTitle() {
    const type = this.props.section.data.depth ? 'h5' : 'h4'
    return !this.props.section.data.title ? null : React.createElement(type, null, this.props.section.data.title)
  }

  renderSection() {
    return this.props.section.data.paragraphs.map(paragraph => this.renderParagraph(paragraph))
  }

  renderParagraph(paragraph: string) {
    const text = paragraph.text()
    return !text ? null : <p key={text}>{text}</p>
  }

  render() {
    return (
      <div>
        {this.renderTitle()}
        {this.renderSection()}
      </div>
    )
  }
}
