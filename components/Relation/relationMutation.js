// @flow
import gql from 'graphql-tag'

export default (type: string, codes: Array<string>) => gql`
  mutation Relate($id: ID!, $code: String!) {
    relate(id: $id, code: $code) {
      relation {
        ...${type}RelationFields
      }
      count {
        ...${type}RelationCountFields
      }
    }
  }
  fragment ${type}RelationFields on ${type}RelationNode {
    ${codes.join(', ')}
  }
  fragment ${type}RelationCountFields on ${type}RelationCountNode {
    ${codes.join(', ')}
  }
`
