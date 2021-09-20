import { Box, Footer, Layer, Main, Anchor, ResponsiveContext, Text, Button } from 'grommet';
import React, { Reducer, ReducerWithoutAction, useContext, useEffect, useReducer, useState } from 'react';
import GlitchWorker from './worker?worker';
import {useMatomo} from '@datapunt/matomo-tracker-react'
import save from 'save-file';
import {customAlphabet} from 'nanoid';
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import GlitchForm from './components/form';
import Questions from './components/faq';
import Header from './components/header';

const nanoid = customAlphabet('1234567890abcdef', 6)

type LogLine = {line: string, color: string}
const logReducer: Reducer<LogLine[], {type: string, value?: string}> = (state, {type, value = ''}) => {
  switch (type) {
    case 'log':
      return [...state, {line: value, color: 'light-1'}];
    case 'clear':
      return [];
    case 'error':
      return [...state, {line: 'error: ' + value, color: 'status-error'}];
    case 'success':
      return [...state, {line: value, color: 'status-ok'}];
    case 'warning':
      return [...state, {line: value, color: 'status-warning'}];
    default:
      return state;
  }
}

function App() {
  const [worker, setWorker] = useState<Worker>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [logsOpen, setLogsOpen] = useState<boolean>(false);
  const [logs, dispatchLogs] = useReducer(logReducer, []);
  const size = useContext(ResponsiveContext);
  const {trackPageView, trackEvent} = useMatomo()

  useEffect(() => {
    trackPageView();
    const w = new GlitchWorker();
    setWorker(w);
    w.onmessage = async (message) => {
      switch (message.data.type) {
        case 'result':
          dispatchLogs({type: 'success', value: 'saving...'});
          trackEvent({category: 'app', action: 'glitching finished'});
          await save(message.data.buffer, `out-${nanoid()}.avi`);
          hideLogs();
          setIsProcessing(false);
          break;
        case 'log':
          dispatchLogs({type: 'log', value: message.data.value});
          break;
        case 'warning':
          dispatchLogs({type: 'warning', value: message.data.value});
          break;
        case 'error':
          dispatchLogs({type: 'error', value: message.data.value});
          trackEvent({category: 'app', action: 'error', name: message.data.value});
          break;
      }
    }
  }, []);

  function hideLogs() {
    dispatchLogs({type: 'clear'});
    setLogsOpen(false);
  }

  function onFormSubmit(data: GlitchFormData) {
    trackEvent({category: 'app', action: 'glitching start', name: data.effect});
    worker?.postMessage({
      cmd: 'begin', data
    });
    setIsProcessing(true);
    setLogsOpen(true);
  }

  return (
    <Main pad="xlarge">
      <Box flex={false}>
        <Header />
        
        <GlitchForm onSubmit={onFormSubmit} disabled={isProcessing} />

        {logsOpen && 
          <Layer
            animation="fadeIn"
          >
            <Box margin="large" css={[size !== 'small' && css`min-height: 265px; min-width: 600px`]}>
              {logs.map((log, index) => <Text key={index} color={log.color}>{log.line}</Text>)}
              {logs.some(log => log.color === 'status-error') &&
                <Box direction="row" margin={{top: 'medium'}}>
                  <Button color="#FF4040" primary label="Close logs" fill={false} onClick={() => {hideLogs(), setIsProcessing(false)}}/>
                </Box>
              }
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
  )
}

export default App
