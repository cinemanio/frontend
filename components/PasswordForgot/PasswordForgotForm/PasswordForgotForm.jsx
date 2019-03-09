// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import type { Translator } from 'react-i18next'
import { Form, Button } from 'antd'

import i18nClient from 'libs/i18nClient'
import InputWithIcon from 'components/InputWithIcon/InputWithIcon'

const FormItem = Form.Item

type Props = { form: Object, i18n: Translator, submit: Function, loading: boolean }

export default class PasswordForgotForm extends React.Component<Props> {
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

  renderEmail() {
    const options = {
      rules: [
        { type: 'email', message: this.props.i18n.t('passwordForgot.errors.emailInvalid') },
        { required: true, message: this.props.i18n.t('passwordForgot.errors.emailRequired') },
      ],
    }
    return this.props.form.getFieldDecorator('email', options)(
      <InputWithIcon iconType="mail" type="email" placeholder={this.props.i18n.t('passwordForgot.placeholders.email')} />
    )
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmitForm}>
        <FormItem>{this.renderEmail()}</FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={this.props.loading}>
            {this.props.i18n.t('passwordForgot.submit')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
