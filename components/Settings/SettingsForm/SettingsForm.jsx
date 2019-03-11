// @flow
import React from 'react'
import { PropTypes } from 'prop-types'
import type { Translator } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Form, Button } from 'antd'

import i18nClient from 'libs/i18nClient'
import InputWithIcon from 'components/InputWithIcon/InputWithIcon'
import routes from 'components/App/routes'

import './SettingsForm.scss'

const FormItem = Form.Item

type Props = { form: Object, i18n: Translator, submit: Function, loading: boolean, data: Object }

export default class SettingsForm extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    data: PropTypes.object.isRequired,
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
      initialValue: this.props.data.username,
      rules: [{ required: true, message: this.props.i18n.t('settings.errors.usernameRequired') }],
    }
    return this.props.form.getFieldDecorator('username', options)(
      <InputWithIcon iconType="user" placeholder={this.props.i18n.t('settings.placeholders.username')} />
    )
  }

  renderEmail() {
    const options = {
      initialValue: this.props.data.email,
      rules: [
        { type: 'email', message: this.props.i18n.t('settings.errors.emailInvalid') },
        { required: true, message: this.props.i18n.t('settings.errors.emailRequired') },
      ],
    }
    return this.props.form.getFieldDecorator('email', options)(
      <InputWithIcon iconType="mail" placeholder={this.props.i18n.t('settings.placeholders.email')} />
    )
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmitForm}>
        <FormItem>{this.renderUsername()}</FormItem>
        <FormItem>{this.renderEmail()}</FormItem>
        <FormItem>
          <Link to={routes.password.change} styleName="password">
            {this.props.i18n.t('settings.changePassword')}
          </Link>
          <Button type="primary" htmlType="submit" disabled={this.props.loading}>
            {this.props.i18n.t('settings.submit')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
