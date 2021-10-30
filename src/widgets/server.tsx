import {
  faApple,
  faCentos,
  faFedora,
  faGithub,
  faLinux,
  faRedhat,
  faSuse,
  faUbuntu,
  faWindows,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { faServer } from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { Button, Switch } from "antd";
import { FC } from "react";
import styled, { useTheme } from "styled-components";
import InfoTable from "../components/info-table";
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
  text-decoration-color: ${(props) => props.theme.colors.primary};
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

  &:active {
    > svg {
      color: ${(props) => props.theme.colors.primary};
    }
  }
  > svg {
    color: ${(props) => props.theme.colors.text};
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  column-gap: 40px;

  flex-grow: 1;
`;

const StyledInfoTable = styled(InfoTable)`
  padding: 0;
  max-width: 400px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const ServerIcon: FC<{ os: string } & Omit<FontAwesomeIconProps, "icon">> = ({
  os,
  ...iconProps
}) => {
  const theme = useTheme();

  let icon: IconDefinition = faServer;

  if (os.includes("ubuntu")) {
    icon = faUbuntu;
  } else if (os.includes("suse")) {
    icon = faSuse;
  } else if (os.includes("redhat")) {
    icon = faRedhat;
  } else if (os.includes("fedora")) {
    icon = faFedora;
  } else if (os.includes("centos")) {
    icon = faCentos;
  } else if (os.includes("linux")) {
    icon = faLinux;
  } else if (os.includes("win")) {
    icon = faWindows;
  } else if (
    os.includes("mac") ||
    os.includes("osx") ||
    os.includes("darwin") ||
    os.includes("apple")
  ) {
    icon = faApple;
  }

  return (
    <FontAwesomeIcon
      color={theme.colors.text}
      style={{
        marginLeft: 20,
      }}
      {...iconProps}
      icon={icon}
    />
  );
};

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

      <ContentContainer>
        <ServerIcon os="ubuntu" size="7x" />

        <StyledInfoTable
          infos={[
            {
              label: "Name",
              value: "Testserver",
            },
            {
              label: "OS",
              value: "Ubuntu 21.0",
            },
            {
              label: "Uptime",
              value: "127 days",
            },
            {
              label: "",
              value: "21 hours",
            },
            {
              label: "",
              value: "5 minutes",
            },
            {
              label: "",
              value: "21 seconds",
            },
          ]}
        />
      </ContentContainer>
    </Container>
  );
};

export default ServerWidget;
