import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import styled from 'styled-components';

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  background-color: var(--ifm-color-primary);

  .code {
    width: 500px;
    max-width: calc(100% - 20px);
  }
`;

const Heading = styled.div`
  text-align: center;

  > h1 {
    font-size: 3rem;
  }
  > p {
    font-size: 1.5rem;
    font-style: italic;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;

  &:first-child {
    background-color: var(--ifm-color-primary);
  }
`;

const HomepageHeader = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Banner>
      <Heading>
        <h1>{siteConfig.title}</h1>
        <p>{siteConfig.tagline}</p>
      </Heading>

      <CodeBlock className='language-bash code'>
        {`docker container run -it \\
  -p 80:3001 \\
  -v /etc/os-release:/etc/os-release:ro \\
  -v /proc/1/ns/net:/mnt/host_ns_net:ro \\
  -v /media:/mnt/host_media:ro \\
  -v /mnt:/mnt/host_mnt:ro \\
  --privileged \\
  mauricenino/dashdot`}
      </CodeBlock>

      <Buttons>
        <Link
          className='button button--secondary button--lg'
          to='/docs/install'
        >
          Installation
        </Link>
        <Link className='button button--secondary button--lg' to='/docs/config'>
          Configuration
        </Link>
      </Buttons>
    </Banner>
  );
};

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
  padding: 4rem 0;
`;

const InfoSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 20px);
  max-width: 600px;

  img {
    width: 100%;
    border-radius: 15px;
  }
  ul {
    text-align: center;
    list-style: inside;

    li {
      margin-left: -30px;
    }
  }
`;

const Images = styled.div``;

const HomePageInfo = () => {
  return (
    <InfoContainer>
      <InfoSection>
        <h2>dash. is beautiful</h2>

        <Zoom overlayBgColorEnd={'#000'}>
          <img
            src='./img/screenshot_darkmode.png'
            alt='Dark-Mode'
            className='dark'
          />
        </Zoom>
      </InfoSection>

      <InfoSection>
        <h2>dash. is feature-rich</h2>

        <ul style={{ width: '100%' }}>
          <li>Dark/Light-Mode</li>
          <li>Customizable Widgets</li>
          <li>Beautiful Animations and Styles</li>
          <li>Support for multiple architectures</li>
          <li>A lot of personalization options</li>
        </ul>
      </InfoSection>
    </InfoContainer>
  );
};

export default function Home(): JSX.Element {
  return (
    <Layout
      title={`Home`}
      description='dash. is a modern and responsive dashboard for your server'
    >
      <HomepageHeader />
      <HomePageInfo />
    </Layout>
  );
}
