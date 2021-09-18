import { Box, Heading, Grid, FileInput, Collapsible, ResponsiveContext, Form, Button, CheckBox, FormField, TextInput, } from 'grommet';
import React, { useContext, useEffect, useState } from 'react';
import { FormClock, FormRefresh } from 'grommet-icons';
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import RecipeCard from './recipecard';
import effects from '../worker/effects';

export default function GlitchForm(props: {onSubmit: (data: GlitchFormData) => void}) {
  const size = useContext(ResponsiveContext);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedEffect, setSelectedEffect] = useState<Effect>();

  function onFormSubmit(value: {keepFirstFrame?: boolean, interval?: number, count?: number}) {
    if(!(selectedFile && selectedEffect)) return;

    props.onSubmit({
      keepFirstFrame: value.keepFirstFrame === undefined ? true : value.keepFirstFrame,
      interval: +(value.interval || 15),
      count: +(value.count || 30),
      effect: selectedEffect.name,
      file: selectedFile,
    });
  }

  return (
    <>
      <Box css={css`max-width: 430px !important;`} pad={{bottom: 'none', top: 'small'}}>
        <FileInput
          accept="video/avi"
          name="file"
          onChange={event => {
            const fileList = event.target.files;
            if(!fileList) {
              setSelectedFile(undefined);
              setSelectedEffect(undefined);
              return;
            };
            setSelectedFile(fileList[0]);
          }}
        />
      </Box>
      <Collapsible open={!!selectedFile}>
        <Box pad={{bottom: 'small'}} css={css`min-height: 236.33px; user-select: none;`}>
          <Heading level={3} margin={{top: "medium", bottom: "small"}}>Pick an effect</Heading>
          <Grid columns={size !== 'small' ? 'small' : '100%'} gap="small">
            {effects.map((effect, index) => {
              return <RecipeCard
                title={effect.displayName}
                video={effect.backgroundVideo}
                onClick={() => {setSelectedEffect(effect)}}
                key={effect.name}
                isSelected={selectedEffect?.name === effect.name}
              ></RecipeCard>
            })}
          </Grid>
        </Box>
      </Collapsible>

      <Collapsible open={!!selectedEffect}>
        <Box pad={{bottom: 'small'}} css={css`user-select: none;`}>
          <Heading level={3} margin={{top: "medium", bottom: "small"}}>Tune it</Heading>

          <Form onSubmit={({value}) => onFormSubmit(value as any)} >
            {(selectedEffect?.usesCount || selectedEffect?.usesInterval) && 
              <Box direction={size !== 'small' ? 'row' : 'column'} gap="small" margin="small">
                {selectedEffect?.usesInterval && 
                  <FormField label="How often to glitch?" name="interval">
                      <Box align="center" direction="row" gap="small" margin="small">
                        <FormRefresh />
                        every
                        <TextInput name="interval" placeholder={15}/>
                        frames
                      </Box>
                  </FormField>
                }
                {selectedEffect?.usesCount && 
                  <FormField label="Sustain for?" name="count">
                    <Box align="center" direction="row" gap="small" margin="small">
                      <FormClock />
                      for
                      <TextInput name="count" placeholder={30} />
                      frames
                    </Box>
                  </FormField>
                }
              </Box>
              }
            <FormField name="keepFirstFrame" contentProps={{border: false}}>
              <CheckBox
                label="Keep first video frame?"
                name="keepFirstFrame"
                defaultChecked
              />
            </FormField>

            <Button primary type="submit" size="large" label="Nuke it!" css={css`max-width: 350px !important; border-radius: 4px !important;`} />

          </Form>
        </Box>
      </Collapsible>
    </>
  )
}