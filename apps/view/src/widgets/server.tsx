import { Config, OsInfo } from '@dash/common';
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
} from '@fortawesome/free-brands-svg-icons';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { Button, Switch } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import InfoTable from '../components/info-table';
import ThemedText from '../components/text';
import { useIsMobile } from '../services/mobile';
import { useSetting } from '../services/settings';

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
  margin-top: 45px;
  margin-bottom: 15px;

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
  text-decoration-color: ${props => props.theme.colors.primary};
  position: relative;
  bottom: -3px;
  margin-top: 15px;
`;

const StandaloneAppendix = styled(ServerName)`
  font-size: 3rem;
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
      color: ${props => props.theme.colors.primary};
    }
  }
  > svg {
    color: ${props => props.theme.colors.text};
  }
`;

const StyledInfoTable = styled(InfoTable)<{ mobile: boolean }>`
  width: 100%;
  padding: 30px 5px ${({ mobile }) => (mobile ? 20 : 5)}px 5px;
`;

const SFontAwesomeIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 17rem;
  opacity: 0.05;
  z-index: -5;
`;

const ServerIcon: FC<{ os: string } & Omit<FontAwesomeIconProps, 'icon'>> = ({
  os,
  ...iconProps
}) => {
  const theme = useTheme();

  let icon: IconDefinition = faServer;

  if (os.includes('ubuntu')) {
    icon = faUbuntu;
  } else if (os.includes('suse')) {
    icon = faSuse;
  } else if (os.includes('redhat')) {
    icon = faRedhat;
  } else if (os.includes('fedora')) {
    icon = faFedora;
  } else if (os.includes('centos')) {
    icon = faCentos;
  } else if (os.includes('linux')) {
    icon = faLinux;
  } else if (
    os.includes('mac') ||
    os.includes('osx') ||
    os.includes('darwin') ||
    os.includes('apple')
  ) {
    icon = faApple;
  } else if (os.includes('win')) {
    icon = faWindows;
  }

  return (
    <SFontAwesomeIcon color={theme.colors.text} {...iconProps} icon={icon} />
  );
};

type ServerWidgetProps = {
  data?: OsInfo;
  config?: Config;
};

export const ServerWidget: FC<ServerWidgetProps> = ({ data, config }) => {
  const isMobile = useIsMobile();
  const [darkMode, setDarkMode] = useSetting('darkMode');
  const [uptime, setUptime] = useState(0);

  const override = config?.override;
  const days = Math.floor(uptime / (24 * 60 * 60));
  const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  const seconds = Math.floor(uptime % 60);

  // Client-side calculation of uptime
  useEffect(() => {
    const uptime = data?.uptime ?? 0;

    let interval: any;
    if (uptime > 0) {
      const startTime = Date.now();

      setUptime(uptime);
      interval = setInterval(() => {
        const passedTime = (Date.now() - startTime) / 1000;
        setUptime(uptime + passedTime);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [data?.uptime]);

  const domain = useMemo(
    () => window.location.hostname.split('.').slice(-2).join('.'),
    []
  );
  const distro = data?.distro ?? '';
  const platform = data?.platform ?? '';
  const os = override?.os ?? `${distro} ${data?.release ?? ''}`;

  const dateInfos = [
    {
      label: '',
      value: `${days} days`,
      amount: days,
    },
    {
      label: '',
      value: `${hours} hours`,
      amount: hours,
    },
    {
      label: '',
      value: `${minutes} minutes`,
      amount: minutes,
    },
    {
      label: '',
      value: `${seconds} seconds`,
      amount: seconds,
    },
  ].reduce((acc, cur) => {
    if (acc.length > 0) {
      acc.push(cur);
    } else if (cur.amount > 0) {
      acc.push(cur);
    }

    return acc;
  }, [] as { label: string; value: string }[]);

  if (dateInfos[0]) {
    dateInfos[0].label = 'Up since';
  } else {
    dateInfos[0] = {
      label: 'Up since',
      value: '',
    };
  }

  return (
    <Container>
      <ButtonsContainer>
        <Link
          ghost
          shape='circle'
          icon={<FontAwesomeIcon icon={faGithub} />}
          href='https://github.com/MauriceNino/dashdot'
          target='_blank'
        />
      </ButtonsContainer>

      <ThemeSwitchContainer>
        <ThemedText>Dark Mode</ThemedText>
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
      </ThemeSwitchContainer>

      <Heading>
        {config?.disable_host ? (
          <StandaloneAppendix>dash.</StandaloneAppendix>
        ) : (
          <>
            <Appendix>dash.</Appendix>
            <ServerName>{domain}</ServerName>
          </>
        )}
      </Heading>

      <StyledInfoTable
        mobile={isMobile}
        infos={[
          {
            label: 'OS',
            value: os,
          },
          {
            label: 'Arch',
            value: override?.arch ?? data?.arch,
          },
          ...dateInfos,
        ]}
      />

      <ServerIcon
        os={(override?.os ?? distro + platform).toLowerCase()}
        size='2x'
      />
    </Container>
  );
};
