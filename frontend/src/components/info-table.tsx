import { FC } from 'react';
import styled from 'styled-components';
import ThemedText from './text';

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
  padding-bottom: 10px;
  padding-right: 15px;
  white-space: nowrap;
`;

const InfoTextValue = styled(ThemedText)`
  display: table-cell;
  font-size: 1rem;
  font-weight: bold;
  padding-bottom: 10px;
`;

export type InfoTableProps = {
  infos: {
    label: string;
    value?: string;
  }[];
  className?: string;
};

const InfoTable: FC<InfoTableProps> = props => {
  return (
    <InfoTextContainer className={props.className}>
      {props.infos.map((info, i) => (
        <InfoTextRow key={i.toString() + info.label}>
          <InfoTextLabel>{info.label}</InfoTextLabel>
          <InfoTextValue>{info.value}</InfoTextValue>
        </InfoTextRow>
      ))}
    </InfoTextContainer>
  );
};

export default InfoTable;
