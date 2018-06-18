// @flow
export default (object: Object, code: string) => {
  // eslint-disable-next-line no-underscore-dangle
  const type = object.__typename.replace('Node', '')
  const response = {
    relate: {
      relation: {
        ...object.relation,
        __typename: `${type}RelationNode`
      },
      count: {
        ...object.relationsCount,
        __typename: `${type}RelationCountNode`
      },
      __typename: 'Relate'
    }
  }
  response.relate.count[code] += !object.relation[code] ? 1 : -1
  response.relate.relation[code] = !object.relation[code]
  return response
}
