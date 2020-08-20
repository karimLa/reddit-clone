import React from 'react';
import { Formik, Form } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button } from '@chakra-ui/core';

interface registerProps {}

function register({}: React.FC<registerProps>) {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              label="Username"
              name="username"
              placeholder="username"
              value={values.username}
              onChange={handleChange}
              color="gray.700"
            />
            <Box my={4}>
              <InputField
                label="Passowrd"
                name="password"
                placeholder="password"
                type="password"
                value={values.password}
                onChange={handleChange}
              />
            </Box>
            <Button type="submit" variantColor="teal" isLoading={isSubmitting}>
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default register;
