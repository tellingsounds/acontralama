import { Form, FormikFormProps } from 'formik';
import React, { FC } from 'react';

import { Lockdown, LockdownProps } from '../Lockdown';

export const CustomForm: FC<FormikFormProps & LockdownProps> = ({
  locked = false,
  lockedMessage = 'Please finish your other edits...',
  ...props
}) => (
  <Form style={{ minWidth: '100%' }} noValidate {...props}>
    {/*Prevent implicit submission of the form:
       https://stackoverflow.com/questions/895171/prevent-users-from-submitting-a-form-by-hitting-enter/51507806#51507806
    */}
    <button
      type="submit"
      disabled
      style={{ display: 'none' }}
      aria-hidden="true"
    />
    <Lockdown locked={locked} lockedMessage={lockedMessage} />
    {props.children}
  </Form>
);

export { CustomForm as Form };
