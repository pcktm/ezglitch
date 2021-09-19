import { Card, Stack, Image, Heading, Video } from 'grommet';
import React, {useEffect, useRef} from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/react'

const activeStyle = `
transform: scale(1.02);
video { 
  filter: brightness(0.7);
  transform: scale(1);
}
`

export default function RecipeCard(props: {title: string, img?: string, video?: string, isSelected: boolean, onClick: () => void}) {
  const videoStyle = css`
  z-index: 0;
  filter: brightness(0.5) saturate(80%);
  transform: scale(1.02);
  transition: 100ms linear; 
  `

  const cardStyle = css`
  transition: 100ms linear; 
  :hover {
    ${activeStyle}
  }
  ${props.isSelected && activeStyle}
  ${props.isSelected && 'border-style: solid;'}
  `

  const player = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setTimeout(() => {
      console.debug('player playan')
      player?.current?.play();
    }, 650)
  }, [])

  return (
    <Card pad="none" elevation="none" css={cardStyle} onClick={props.onClick}>
      <Stack anchor="center" fill >
        {
          props.video && <Video controls={false} fit="cover" autoPlay loop mute playsInline css={videoStyle} ref={player}>
              <source key="video" src={props.video} type="video/mp4" />
          </Video>
        }
        <Heading level={3} textAlign="center" css={css`z-index: 99 !important;`}>{props.title}</Heading>
      </Stack>
    </Card>
  )
}

RecipeCard.defaultProps = {
  isSelected: false,
}