// components/forms/ControlledInput.jsx
// Wraps components/ui/Input with react-hook-form's Controller so screens
// don't repeat the same Controller/render/error-wiring boilerplate for every
// field. Use this instead of ui/Input directly whenever the field is part of
// a useForm() — see LoginScreen/RegisterScreen for the pattern this replaces.
//
// Usage:
//   <ControlledInput control={control} name="email" label="Email" icon={<Mail .../>} />
import React from 'react';
import { Controller } from 'react-hook-form';
import Input from '../ui/Input';

export default function ControlledInput({ control, name, rules, ...inputProps }) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...inputProps}
        />
      )}
    />
  );
}
