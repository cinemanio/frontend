// @flow
import React from 'react'
import { observer } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { translate } from 'react-i18next'
import type { Translator } from 'react-i18next'
import { Form, Icon, Input, Button } from 'antd'

import i18nClient from 'libs/i18nClient'

import './SignUpForm.scss'

const FormItem = Form.Item

type Props = { form: Object, i18n: Translator, signup: Function, loading: boolean }
type State = { confirmDirty: boolean }

@translate()
@observer
export default class SignUpForm extends React.Component<Props, State> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    form: PropTypes.object.isRequired,
    signup: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  }

  state = {
    confirmDirty: false,
  }

  componentWillUnmount() {
    this.props.form.resetFields()
  }

  handleSubmitForm = (e: Event) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.signup({
          variables: {
            username: values.username,
            email: values.email,
            password: values.password,
          },
        })
      }
    })
  }

  handleConfirmBlur = e => this.setState({ confirmDirty: this.state.confirmDirty || !!e.target.value })

  compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== this.props.form.getFieldValue('password')) {
      callback(this.props.i18n.t('signup.errors.passwordsNotMatch'))
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    if (value && this.state.confirmDirty) {
      this.props.form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  renderUsername() {
    return this.props.form.getFieldDecorator('username', {
      rules: [{ required: true, message: this.props.i18n.t('signup.errors.usernameRequired') }],
    })(
      <Input
        prefix={<Icon type="user" styleName="icon" />}
        placeholder={this.props.i18n.t('signup.placeholders.username')}
      />
    )
  }

  renderEmail() {
    return this.props.form.getFieldDecorator('email', {
      rules: [
        { type: 'email', message: this.props.i18n.t('signup.errors.emailInvalid') },
        { required: true, message: this.props.i18n.t('signup.errors.emailRequired') },
      ],
    })(
      <Input
        prefix={<Icon type="mail" styleName="icon" />}
        placeholder={this.props.i18n.t('signup.placeholders.email')}
      />
    )
  }

  renderPassword() {
    return this.props.form.getFieldDecorator('password', {
      rules: [
        { required: true, message: this.props.i18n.t('signup.errors.passwordRequired') },
        { validator: this.validateToNextPassword },
      ],
    })(
      <Input
        prefix={<Icon type="lock" styleName="icon" />}
        type="password"
        placeholder={this.props.i18n.t('signup.placeholders.password')}
      />
    )
  }

  renderPasswordConfirm() {
    return this.props.form.getFieldDecorator('confirm', {
      rules: [
        { required: true, message: this.props.i18n.t('signup.errors.passwordConfirmRequired') },
        { validator: this.compareToFirstPassword },
      ],
    })(
      <Input
        prefix={<Icon type="lock" styleName="icon" />}
        type="password"
        placeholder={this.props.i18n.t('signup.placeholders.passwordConfirm')}
        onBlur={this.handleConfirmBlur}
      />
    )
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmitForm}>
        <FormItem>{this.renderUsername()}</FormItem>
        <FormItem>{this.renderEmail()}</FormItem>
        <FormItem>{this.renderPassword()}</FormItem>
        <FormItem>{this.renderPasswordConfirm()}</FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={this.props.loading}>
            {this.props.i18n.t('signup.submit')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
