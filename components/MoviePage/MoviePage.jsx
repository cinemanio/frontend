// @flow
import React from 'react'
import { graphql } from 'react-apollo'
import { PropTypes } from 'prop-types'
import gql from 'graphql-tag'

import MovieInfo from './MovieInfo/MovieInfo'
import MovieImage from './MovieImage/MovieImage'
import MovieRelations from './MovieRelations/MovieRelations'
import Menu from '../../components/Menu/Menu'
import PersonLink from '../../components/PersonLink/PersonLink'
import { getIdFromSlug } from '../../components/ObjectLink/ObjectLink'

import './MoviePage.scss'

type Props = { data: Object }

export class MoviePage extends React.Component<Props> {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  renderCast() {
    return this.props.data.movie.cast.edges.map(({ node }, i) =>
      (<div key={node.id}>
        <PersonLink person={node.person}/>
        ({node.role.name}: {node.name})
      </div>)
    )
  }

  render() {
    const { movie } = this.props.data
    if (!movie) return null
    return (
      <div>
        <Menu active="movie" link/>
        <MovieRelations counts={{ fav: 1, like: 10, seen: 10, dislike: 10, want: 3, have: 3, ignore: 0 }}/>
        <h1>{movie.title}</h1>
        <h2>{movie.title}</h2>
        <MovieInfo movie={movie}/>
        <MovieImage movie={movie}/>
        <div>{movie.imdb.id} - {movie.imdb.rating}</div>
        {this.renderCast()}
      </div>
    )
  }
}

const MovieQuery = gql`
  query Movie($movieId: ID!) {
    movie(id: $movieId) {
      id
      title
      imdb { id, rating }
      ...MovieInfo
      cast {
        edges {
          node {
            id 
            name
            person {
              ...PersonLink
              gender
            }
            role { name }
          }
        }
      }      
    }
  }
  ${PersonLink.fragments.person}
  ${MovieInfo.fragments.movie}
`

export const configObject = {
  options: ({ params: { slug } }: Object) => ({
    variables: {
      movieId: getIdFromSlug(slug)
    }
  })
}

export default graphql(MovieQuery, configObject)(MoviePage)
