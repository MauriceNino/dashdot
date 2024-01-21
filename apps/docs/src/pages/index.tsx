import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import dedent from 'dedent';
import React from 'react';
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
        {dedent.withOptions({ escapeSpecialCharacters: false })`
          docker container run -it \
            -p 80:3001 \
            -v /:/mnt/host:ro \
            --privileged \
            mauricenino/dashdot
        `}
      </CodeBlock>

      <div className={styles.buttons}>
        <Link
          className='button button--secondary button--lg'
          to='/docs/installation'
        >
          Installation
        </Link>
        <Link
          className='button button--secondary button--lg'
          to='/docs/configuration/basic'
        >
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
          <img src='./img/screenshot_darkmode.png' alt='Dark-Mode' />
        ) : (
          <img src='./img/screenshot_lightmode.png' alt='Light-Mode' />
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
