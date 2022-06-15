import { motion, Variants } from 'framer-motion';
import { FC } from 'react';
import styled from 'styled-components';
import { InfoTableArr } from '../utils/format';
import { ThemedText } from './text';

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};

export const InfoTextContainer = styled.div<{ noPadding?: boolean }>`
  display: table;
  padding: 30px;
  color: ${props => props.theme.colors.text};
`;

const InfoTextRow = styled(motion.div)`
  display: table-row;
`;

const InfoTextLabel = styled(ThemedText)`
  display: table-cell;
  width: auto;
  font-size: 0.8rem;
  padding-bottom: 3px;
  padding-right: 15px;
  line-height: 1.5;
  white-space: pre;
`;

const InfoTextValue = styled(ThemedText)`
  line-height: 1.5;
  white-space: pre-wrap;
  display: table-cell;
  font-size: 1rem;
  font-weight: bold;
  padding-bottom: 3px;
`;

export type InfoTableProps = {
  infos: InfoTableArr;
  className?: string;
};

export const InfoTable: FC<
  InfoTableProps & {
    page: number;
    itemsPerPage: number;
  }
> = props => {
  const itemsStart = props.page * props.itemsPerPage;
  const items = props.infos.slice(
    itemsStart,
    Math.min(itemsStart + props.itemsPerPage, props.infos.length)
  );

  return (
    <InfoTextContainer className={props.className}>
      {items.map((info, i) => (
        <InfoTextRow
          key={(itemsStart + i).toString()}
          variants={itemVariants}
          initial='initial'
          animate='animate'
          exit='initial'
        >
          <InfoTextLabel>{info.label}</InfoTextLabel>
          <InfoTextValue>
            {info.value == null || info.value.trim().length === 0
              ? '/'
              : info.value}
          </InfoTextValue>
        </InfoTextRow>
      ))}
    </InfoTextContainer>
  );
};
