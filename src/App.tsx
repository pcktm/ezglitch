import { Box, Main, Paragraph, Text } from 'grommet';
import React, { useEffect, useState } from 'react';
import GlitchWorker from './worker?worker';
import save from 'save-file';
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import GlitchForm from './components/form';
import Questions from './components/faq';
import Header from './components/header';

function App() {
  const [worker, setWorker] = useState<Worker>();

  useEffect(() => {
    const w = new GlitchWorker();
    setWorker(w);
    w.onmessage = (message) => {
      if (message.data.status === 'done') {
        save(message.data.buffer, 'out.avi');
      }
    }
  }, [])

  function onFormSubmit(data: GlitchFormData) {
    console.log(data);
    worker?.postMessage({
      cmd: 'begin', data
    });
  }

  return (
    <Main pad="xlarge">
      <Box flex={false}>
        <Header />
        
        <GlitchForm onSubmit={onFormSubmit} />

        <Questions />

      </Box>
    </Main>
  )
}

export default App
