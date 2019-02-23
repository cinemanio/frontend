// @flow
import React from 'react'
import { observer } from 'mobx-react'
import { PropTypes } from 'prop-types'
import { withTranslation } from 'react-i18next'
import type { Translator } from 'react-i18next'
import { Form, Icon, Input, Button } from 'antd'

import i18nClient from 'libs/i18nClient'

import './SignInForm.scss'

const FormItem = Form.Item

type Props = { form: Object, i18n: Translator, signin: Function, loading: boolean }

@withTranslation()
@observer
export default class SignInForm extends React.Component<Props> {
  static defaultProps = {
    i18n: i18nClient,
  }

  static propTypes = {
    i18n: PropTypes.object,
    form: PropTypes.object.isRequired,
    signin: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
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

  renderUsername() {
    return this.props.form.getFieldDecorator('username', {
      rules: [{ required: true, message: 'This field is required' }],
    })(
      <Input
        prefix={<Icon type="user" styleName="icon" />}
        placeholder={this.props.i18n.t('signin.placeholders.username')}
      />
    )
  }

  renderPassword() {
    return this.props.form.getFieldDecorator('password', {
      rules: [{ required: true, message: 'This field is required' }],
    })(
      <Input
        prefix={<Icon type="lock" styleName="icon" />}
        type="password"
        placeholder={this.props.i18n.t('signin.placeholders.password')}
      />
    )
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmitForm}>
        <FormItem>{this.renderUsername()}</FormItem>
        <FormItem>{this.renderPassword()}</FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={this.props.loading}>
            {this.props.i18n.t('signin.submit')}
          </Button>
        </FormItem>
      </Form>
    )
  }
}
