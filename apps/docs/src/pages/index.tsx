import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import styles from './index.module.scss';

const HomepageHeader = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={styles.banner}>
      <div className={styles.header}>
        <h1>{siteConfig.title}</h1>
        <p>{siteConfig.tagline}</p>
      </div>

      <CodeBlock className={`language-bash ${styles.bannerCode}`}>
        {`docker container run -it \\
  -p 80:3001 \\
  -v /etc/os-release:/etc/os-release:ro \\
  -v /proc/1/ns/net:/mnt/host_ns_net:ro \\
  -v /media:/mnt/host_media:ro \\
  -v /mnt:/mnt/host_mnt:ro \\
  --privileged \\
  mauricenino/dashdot`}
      </CodeBlock>

      <div className={styles.buttons}>
        <Link
          className='button button--secondary button--lg'
          to='/docs/install'
        >
          Installation
        </Link>
        <Link className='button button--secondary button--lg' to='/docs/config'>
          Configuration
        </Link>
      </div>
    </div>
  );
};

const HomePageInfo = () => {
  const { colorMode } = useColorMode();

  return (
    <div className={styles.infoContainer}>
      <div className={styles.infoSection}>
        <h2>dash. is beautiful</h2>
        {colorMode === 'dark' ? (
          <Zoom overlayBgColorEnd={'#000'}>
            <img src='./img/screenshot_darkmode.png' alt='Dark-Mode' />
          </Zoom>
        ) : (
          <Zoom overlayBgColorEnd={'#fff'}>
            <img src='./img/screenshot_lightmode.png' alt='Light-Mode' />
          </Zoom>
        )}
      </div>

      <div className={styles.infoSection}>
        <h2>dash. is feature-rich</h2>

        <ul style={{ width: '100%' }}>
          <li>Dark/Light-Mode</li>
          <li>Customizable Widgets</li>
          <li>Beautiful Animations and Styles</li>
          <li>Support for multiple architectures</li>
          <li>A lot of personalization options</li>
        </ul>
      </div>
    </div>
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
