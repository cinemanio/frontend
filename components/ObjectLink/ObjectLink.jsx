// @flow
import React from 'react'
import { Link } from 'react-router-named-routes'
import { PropTypes } from 'prop-types'
import slugify from 'slugify'

type Props = { to: string, children: mixed, parts: Array<string> }

export default class ObjectLink extends React.PureComponent<Props> {
  static propTypes = {
    to: PropTypes.string.isRequired,
    parts: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
  }

  get params(): {slug: string} {
    const id = this.props.parts.splice(-1, 1)
    return {
      slug: this.props.parts
        .filter(part => part)
        .map(part => slugify(part, { lower: true }))
        .concat([id])
        .join('-')
    }
  }

  render() {
    return (
      <Link to={this.props.to} params={this.params}>
        {this.props.children}
      </Link>
    )
  }
}

export const getIdFromSlug = (slug: string) => {
  const parts = slug.split('-')
  return parts[parts.length - 1]
}
