import React from 'react'
import { Header as GHeader, Anchor, Box, Heading, Paragraph, Text } from 'grommet';
/** @jsx jsx */
import { css, jsx } from '@emotion/react'

export default function Header() {
  return (
    <>
    <Box direction="row" align="baseline" gap="xsmall">
      <Heading>ezglitch</Heading>
      <Heading level="5" color="light-5">v1.1.3</Heading>
    </Box>
    <Paragraph css={css`max-width: 470px !important;`}>
      Blissfully easy <Text color="brand">video glitching</Text> based on the world&apos;s
      best avi index breaker. Now <Text color="brand">entirely in your browser</Text>.
    </Paragraph>
    </>
)}