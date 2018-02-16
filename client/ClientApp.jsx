import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Router, browserHistory } from 'react-router'

export default class ClientApp extends React.PureComponent {
  render() {
    return (
      <ApolloProvider client={this.props.client}>
        <Router history={browserHistory} routes={this.props.routes}/>
      </ApolloProvider>
    )
  }
}
