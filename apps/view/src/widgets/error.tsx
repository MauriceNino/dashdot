import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Variants } from 'framer-motion';
import { FC } from 'react';
import styled, { useTheme } from 'styled-components';
import { GlassPane } from '../components/glass-pane';
import { ThemedText } from '../components/text';

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
    <GlassPane variants={itemVariants} grow={0} minWidth={500}>
      <Content>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          color={theme.colors.text}
          size='5x'
        />
        <ThemedText>{errorText}</ThemedText>
      </Content>
    </GlassPane>
  );
};
