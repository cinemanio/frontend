// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import type { Translator } from 'react-i18next'
import { Form, Button } from 'antd'

import i18nClient from 'libs/i18nClient'
import InputWithIcon from 'components/InputWithIcon/InputWithIcon'
import InputPassword from 'components/InputPassword/InputPassword'

const FormItem = Form.Item

type Props = { form: Object, i18n: Translator, submit: Function, loading: boolean }

export default class SignUpForm extends React.Component<Props> {
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
      rules: [{ required: true, message: this.props.i18n.t('signup.errors.usernameRequired') }],
    }
    return this.props.form.getFieldDecorator('username', options)(
      <InputWithIcon iconType="user" placeholder={this.props.i18n.t('signup.placeholders.username')} />
    )
  }

  renderEmail() {
    const options = {
      rules: [
        { type: 'email', message: this.props.i18n.t('signup.errors.emailInvalid') },
        { required: true, message: this.props.i18n.t('signup.errors.emailRequired') },
      ],
    }
    return this.props.form.getFieldDecorator('email', options)(
      <InputWithIcon iconType="mail" placeholder={this.props.i18n.t('signup.placeholders.email')} />
    )
  }

  renderPassword() {
    const options = {
      rules: [{ required: true, message: this.props.i18n.t('signup.errors.passwordRequired') }],
    }
    return this.props.form.getFieldDecorator('password', options)(
      <InputPassword placeholder={this.props.i18n.t('signup.placeholders.password')} />
    )
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmitForm}>
        <FormItem>{this.renderUsername()}</FormItem>
        <FormItem>{this.renderEmail()}</FormItem>
        <FormItem>{this.renderPassword()}</FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={this.props.loading}>
            {this.props.i18n.t('signup.submit')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
