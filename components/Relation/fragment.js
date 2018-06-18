// @flow
import gql from 'graphql-tag'

export default (type: string, codes: Array<string>) => gql`
  fragment ${type}Relations on ${type}Node {
    relation {
      ...${type}RelationFields
    }
    relationsCount {
      ...${type}RelationCountFields
    }
  }
  fragment ${type}RelationFields on ${type}RelationNode {
    ${codes.join(', ')}
  }
  fragment ${type}RelationCountFields on ${type}RelationCountNode {
    ${codes.join(', ')}
  }
`
