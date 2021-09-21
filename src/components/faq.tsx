import { Anchor, Box, Text, Heading, Main, Paragraph, FileInput } from 'grommet';
import React from 'react';

export default function Questions() {
  return (
    <Box margin={{top: 'xlarge'}} flex={false}>
      <Box margin={{bottom: 'medium'}}>
        <Heading level="4" margin="none">
          How does this work?
        </Heading>
        <Paragraph margin="none">
          In short, we reorder or duplicate the actual frames inside the video. Since compressed frames are freaky, weird results ensure.
        </Paragraph>
      </Box>

      <Box margin={{bottom: 'medium'}}>
        <Heading level="4" margin="none">
          What video formats are supported?
        </Heading>
        <Paragraph margin="none">
          For the time being, we only support avi files. This is pretty much self-explanatory since this is an avi index breaker.
        </Paragraph>
      </Box>

      <Box margin={{bottom: 'medium'}}>
        <Heading level="4" margin="none">
          Is it free?
        </Heading>
        <Paragraph margin="none">
          You bet! Mainly due to all the processing being done locally, in your browser.
          You can still <Anchor href="https://ko-fi.com/pcktm" label="buy me a coffee" />, though no pressure.
        </Paragraph>
      </Box>
    </Box>
  )
}