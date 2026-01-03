import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import styled, { useTheme } from 'styled-components';
import { ThemedText } from '../components/text';

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  padding: 30px;
`;

type ErrorWidgetProps = {
  errorText: string;
};
export const ErrorWidget: FC<ErrorWidgetProps> = ({ errorText }) => {
  const theme = useTheme();

  return (
    <Content>
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        color={theme.colors.text}
        size="5x"
      />
      <ThemedText>{errorText}</ThemedText>
    </Content>
  );
};
