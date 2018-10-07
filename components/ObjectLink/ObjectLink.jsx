// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import { formatRoute } from 'react-router-named-routes'
import { PropTypes } from 'prop-types'
import slugify from 'slugify'

import routes from 'components/App/routes'

type Props = { type: string, children: mixed, parts: Array<string> }

export default class ObjectLink extends React.PureComponent<Props> {
  static propTypes = {
    type: PropTypes.string.isRequired,
    parts: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
  }

  get params(): { slug: string } {
    const id = this.props.parts.splice(-1, 1)
    return {
      slug: this.props.parts
        .filter(part => part)
        .map(part => slugify(part, { lower: true }))
        .concat([id])
        .join('-'),
    }
  }

  render() {
    return <Link to={formatRoute(routes[this.props.type].detail, this.params)}>{this.props.children}</Link>
  }
}

export const getIdFromSlug = (slug: string) => {
  const parts = slug.split('-')
  return decodeURIComponent(parts[parts.length - 1])
}
