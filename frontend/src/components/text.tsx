import styled from 'styled-components';

const ThemedText = styled.p`
  color: ${props => props.theme.colors.text};
  display: inline-block;
`;

export default ThemedText;
