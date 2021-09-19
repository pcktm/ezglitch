import { Box, Footer, Layer, Main, Anchor, ResponsiveContext, Text } from 'grommet';
import React, { Reducer, ReducerWithoutAction, useContext, useEffect, useReducer, useState } from 'react';
import GlitchWorker from './worker?worker';
import {MatomoProvider, createInstance} from '@datapunt/matomo-tracker-react'
import save from 'save-file';
import {customAlphabet} from 'nanoid';
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import GlitchForm from './components/form';
import Questions from './components/faq';
import Header from './components/header';

const nanoid = customAlphabet('1234567890abcdef', 6)

const logReducer: Reducer<string[], {type: string, value?: string}> = (state, action) => {
  switch (action.type) {
    case 'add':
      return [...state, action.value || ''];
    case 'clear':
      return [];
    case 'updateLast':
      const temp = state.slice(0, -1);
      temp.push(action.value || '');
      return temp;
    default:
      return state;
  }
}

function App() {
  const [worker, setWorker] = useState<Worker>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [logs, dispatchLogs] = useReducer(logReducer, []);
  const size = useContext(ResponsiveContext);



  useEffect(() => {
    const w = new GlitchWorker();
    setWorker(w);
    w.onmessage = async (message) => {
      switch (message.data.type) {
        case 'result':
          await save(message.data.buffer, `out-${nanoid()}.avi`);
          setIsProcessing(false);
          dispatchLogs({type: 'clear'});
          break;
        case 'log':
          dispatchLogs({type: 'add', value: message.data.value});
          break;
        case 'log-updateLast':
          dispatchLogs({type: 'updateLast', value: message.data.value});
          break;
      }
    }
  }, [])

  function onFormSubmit(data: GlitchFormData) {
    console.log(data);
    worker?.postMessage({
      cmd: 'begin', data
    });
    setIsProcessing(true);
  }

  const instance = createInstance({
    urlBase: 'https://stats33.mydevil.net',
    siteId: 121,
  })

  return (
    <MatomoProvider value={instance}>
      <Main pad="xlarge">
        <Box flex={false}>
          <Header />
          
          <GlitchForm onSubmit={onFormSubmit} disabled={isProcessing} />

          {isProcessing && 
            <Layer
              animation="fadeIn"
            >
              <Box margin="large" css={[size !== 'small' && css`min-height: 250px; min-width: 600px`]}>
                {logs.map((log, index) => <Text key={index}>{log}</Text>)}
              </Box>
            </Layer>
          }

          <Questions />

          <Box pad={{top: 'large'}} as="footer">
            <Text size="small">get the <Anchor href="https://github.com/pcktm/ezglitch">source</Anchor></Text>
            <Text size="small">by <Anchor href="https://kopanko.com/?mtm_campaign=ezglitch&mtm_kwd=web">Jakub</Anchor></Text>
          </Box>

        </Box>
      </Main>
    </MatomoProvider>
  )
}

export default App
