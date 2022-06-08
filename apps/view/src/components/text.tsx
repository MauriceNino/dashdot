import styled from 'styled-components';

export const ThemedText = styled.p`
  color: ${props => props.theme.colors.text};
  display: inline-block;
`;
