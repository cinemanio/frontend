// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import type { Translator } from 'react-i18next'
import { Form, Button } from 'antd'

import i18nClient from 'libs/i18nClient'
import InputPassword from 'components/InputPassword/InputPassword'

const FormItem = Form.Item

type Props = { form: Object, i18n: Translator, submit: Function, loading: boolean, match: Object }

export default class PasswordResetForm extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    form: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
  }

  componentWillUnmount() {
    this.props.form.resetFields()
  }

  handleSubmitForm = (e: Event) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const variables = { ...values, ...this.props.match.params }
        this.props.submit({ variables })
      }
    })
  }

  renderPassword() {
    const options = { rules: [{ required: true, message: this.props.i18n.t('passwordReset.errors.passwordRequired') }] }
    return this.props.form.getFieldDecorator('password', options)(
      <InputPassword placeholder={this.props.i18n.t('passwordReset.placeholders.password')} />
    )
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmitForm}>
        <FormItem>{this.renderPassword()}</FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={this.props.loading}>
            {this.props.i18n.t('passwordReset.submit')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
