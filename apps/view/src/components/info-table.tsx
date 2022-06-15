import { FC } from 'react';
import styled from 'styled-components';
import { InfoTableArr } from '../utils/format';
import { ThemedText } from './text';

export const InfoTextContainer = styled.div<{ noPadding?: boolean }>`
  display: table;
  padding: 30px;
  color: ${props => props.theme.colors.text};
`;

const InfoTextRow = styled.div`
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

export const InfoTable: FC<InfoTableProps> = props => {
  return (
    <InfoTextContainer className={props.className}>
      {props.infos.map((info, i) => (
        <InfoTextRow key={i.toString() + info.label}>
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
