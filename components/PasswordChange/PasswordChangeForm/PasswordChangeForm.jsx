// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import type { Translator } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Form, Button } from 'antd'

import i18nClient from 'libs/i18nClient'
import InputPassword from 'components/InputPassword/InputPassword'
import InputWithIcon from 'components/InputWithIcon/InputWithIcon'
import routes from 'components/App/routes'

import './PasswordChangeForm.scss'

const FormItem = Form.Item

type Props = { form: Object, i18n: Translator, submit: Function, loading: boolean }

export default class PasswordChangeForm extends React.Component<Props> {
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

  renderOldPassword() {
    const options = {
      rules: [{ required: true, message: this.props.i18n.t('passwordChange.errors.oldPasswordRequired') }],
    }
    return this.props.form.getFieldDecorator('oldPassword', options)(
      <InputWithIcon iconType="lock" placeholder={this.props.i18n.t('passwordChange.placeholders.oldPassword')} />
    )
  }

  renderNewPassword() {
    const options = {
      rules: [{ required: true, message: this.props.i18n.t('passwordChange.errors.newPasswordRequired') }],
    }
    return this.props.form.getFieldDecorator('newPassword', options)(
      <InputPassword placeholder={this.props.i18n.t('passwordChange.placeholders.newPassword')} />
    )
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmitForm}>
        <FormItem>{this.renderOldPassword()}</FormItem>
        <FormItem>{this.renderNewPassword()}</FormItem>
        <FormItem>
          <Link to={routes.settings} styleName="settings">
            {this.props.i18n.t('passwordChange.changeSettings')}
          </Link>
          <Button type="primary" htmlType="submit" disabled={this.props.loading}>
            {this.props.i18n.t('passwordChange.submit')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
