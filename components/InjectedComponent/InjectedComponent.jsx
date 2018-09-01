/* eslint-disable flowtype/no-types-missing-file-annotation */
// Taken from here https://gist.github.com/vonovak/29c972c6aa9efbb7d63a6853d021fba9#gistcomment-2340034 UNFINISHED
// some hacked generic type
// $FlowFixMe - TODO how define props without "Property `props` is incompatible: InjectedProps.
// This type is incompatible with Props" ?!
import React from 'react'

export default class InjectedComponent<Props, InjectedProps, State = void> extends React.Component<Props, State> {
  props: Props & InjectedProps
  state: State
}
