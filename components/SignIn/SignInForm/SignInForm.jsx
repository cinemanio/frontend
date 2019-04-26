// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import type { Translator } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Form, Button } from 'antd'

import i18nClient from 'libs/i18nClient'
import routes from 'components/App/routes'
import InputWithIcon from 'components/InputWithIcon/InputWithIcon'

import './SignInForm.scss'

const FormItem = Form.Item

type Props = { form: Object, i18n: Translator, submit: Function, loading: boolean }

export default class SignInForm extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    form: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  }

  componentWillUnmount() {
    this.props.form.resetFields()
  }

  handleSubmitForm = (e: Event) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submit({ variables: values })
      }
    })
  }

  renderUsername() {
    const options = {
      rules: [{ required: true, message: this.props.i18n.t('signin.errors.usernameRequired') }],
    }
    return this.props.form.getFieldDecorator('username', options)(
      <InputWithIcon iconType="user" placeholder={this.props.i18n.t('signin.placeholders.username')} />
    )
  }

  renderPassword() {
    const options = {
      rules: [{ required: true, message: this.props.i18n.t('signin.errors.passwordRequired') }],
    }
    return this.props.form.getFieldDecorator('password', options)(
      <InputWithIcon iconType="lock" type="password" placeholder={this.props.i18n.t('signin.placeholders.password')} />
    )
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmitForm}>
        <FormItem>{this.renderUsername()}</FormItem>
        <FormItem>{this.renderPassword()}</FormItem>
        <FormItem>
          <Link to={routes.password.forgot} styleName="forgot">
            {this.props.i18n.t('signin.forgotPassword')}
          </Link>
          <Button type="primary" htmlType="submit" disabled={this.props.loading}>
            {this.props.i18n.t('signin.submit')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
