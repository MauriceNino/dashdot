import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Switch } from "antd";
import { FC } from "react";
import styled from "styled-components";
import ThemedText from "../components/text";
import { useSetting } from "../services/settings";

const Container = styled.div`
  flex: 1;
  max-width: 100%;

  display: flex;
  flex-direction: column;
  padding: 25px;
`;

const Heading = styled(ThemedText)`
  width: 100%;
  max-width: 100%;
  margin-top: 20px;

  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-end;
  column-gap: 15px;

  font-size: 2rem;

  > * {
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const Appendix = styled.span`
  font-size: 1.5rem;
`;

const ServerName = styled.span`
  font-weight: bold;
  text-decoration: underline;
  position: relative;
  bottom: -5px;
`;

const ThemeSwitchContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
  z-index: 2;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Link = styled(Button)`
  border: none;
  > svg {
    color: ${(props) => props.theme.colors.text};
  }
`;

const ServerWidget: FC = () => {
  const [darkMode, setDarkMode] = useSetting("darkMode");

  return (
    <Container>
      <ButtonsContainer>
        <Link
          ghost
          shape="circle"
          icon={<FontAwesomeIcon icon={faGithub} />}
          href="https://github.com/MauriceNino/dashdot"
          target="_blank"
        />
      </ButtonsContainer>

      <ThemeSwitchContainer>
        <ThemedText>Dark Mode</ThemedText>
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
      </ThemeSwitchContainer>

      <Heading>
        <Appendix>dash.</Appendix>
        <ServerName>{window.location.hostname}</ServerName>
      </Heading>
    </Container>
  );
};

export default ServerWidget;
