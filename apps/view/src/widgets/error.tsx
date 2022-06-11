import {
  faExclamationTriangle,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';
import { Variants } from 'framer-motion';
import { FC } from 'react';
import { SwapSpinner } from 'react-spinners-kit';
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

const ReloadButton = styled(Button)`
  position: absolute;
  top: 30px;
  right: 30px;
  height: 45px;
  width: 45px;
  > svg {
    font-size: 22px;
  }
`;

type ErrorWidgetProps = {
  errorText: string;
  onReload: () => void;
  loading: boolean;
};
export const ErrorWidget: FC<ErrorWidgetProps> = ({
  errorText,
  onReload,
  loading,
}) => {
  const theme = useTheme();

  return (
    <GlassPane variants={itemVariants} grow={0} minWidth={500}>
      <Content>
        {loading ? (
          <SwapSpinner size={100} color={theme.colors.primary} loading={true} />
        ) : (
          <>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              color={theme.colors.text}
              size='5x'
            />
            <ThemedText>{errorText}</ThemedText>
            {onReload && (
              <ReloadButton
                shape='circle'
                icon={
                  <FontAwesomeIcon
                    icon={faRotateRight}
                    color={theme.colors.text}
                  />
                }
                onClick={onReload}
              />
            )}
          </>
        )}
      </Content>
    </GlassPane>
  );
};
