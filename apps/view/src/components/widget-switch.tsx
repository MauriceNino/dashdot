import { Switch } from 'antd';
import styled from 'styled-components';
import ThemedText from './text';

const SwitchContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
  z-index: 2;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;

type WidgetSwitchProps = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const WidgetSwitch = ({
  label,
  checked,
  onChange,
}: WidgetSwitchProps) => (
  <SwitchContainer>
    <ThemedText>{label}</ThemedText>
    <Switch checked={checked} onChange={onChange} />
  </SwitchContainer>
);
