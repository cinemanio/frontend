// @flow
import React from 'react'
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'
import { Form, Icon, Input, Button } from 'antd'

import ListErrors from 'components/ListErrors/ListErrors'
import i18nClient from 'libs/i18nClient'
// import Auth from 'stores/Auth'

const FormItem = Form.Item

type Props = { // auth: typeof Auth,
  i18n: Translator, signin: Function }

@translate()
// @inject('auth')
@observer
class SignInForm extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
    // auth: Auth,
  }

  static propTypes = {
    i18n: PropTypes.object,
    // auth: MobxPropTypes.observableObject,
    signin: PropTypes.func.isRequired,
  }

  componentWillUnmount() {
    this.props.form.resetFields()
  }

  handleSubmitForm = (e: Event) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.signin({
          variables: {
            username: values.username,
            password: values.password,
          },
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmitForm}>
        <ListErrors errors={this.props.errors} />
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'This field is required' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              placeholder={this.props.i18n.t('signin.placeholders.username')}
              // value={this.props.auth.values.username}
              // onChange={this.handleUsernameChange}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'This field is required' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder={this.props.i18n.t('signin.placeholders.password')}
              // value={this.props.auth.values.password}
              // onChange={this.handlePasswordChange}
            />,
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary" htmlType="submit" className="login-form-button"
            // disabled={this.props.auth.submitDisabled}
          >
            {this.props.i18n.t('signin.submit')}
          </Button>
        </FormItem>
      </Form>
      // <form onSubmit={this.handleSubmitForm}>
      //   <ListErrors errors={this.props.auth.errors} />
      //
      //   <fieldset>
      //     <fieldset className="form-group">
      //       <input
      //         className="form-control form-control-lg"
      //         type="text"
      //         placeholder={this.props.i18n.t('signin.placeholders.username')}
      //         value={this.props.auth.values.username}
      //         onChange={this.handleUsernameChange}
      //       />
      //     </fieldset>
      //
      //     <fieldset className="form-group">
      //       <input
      //         className="form-control form-control-lg"
      //         type="password"
      //         placeholder={this.props.i18n.t('signin.placeholders.password')}
      //         value={this.props.auth.values.password}
      //         onChange={this.handlePasswordChange}
      //       />
      //     </fieldset>
      //
      //     <button
      //       className="btn btn-lg btn-primary pull-xs-right"
      //       type="submit"
      //       disabled={this.props.auth.submitDisabled}
      //     >
      //       {this.props.i18n.t('signin.submit')}
      //     </button>
      //   </fieldset>
      // </form>
    )
  }
}

export default Form.create()(SignInForm)
