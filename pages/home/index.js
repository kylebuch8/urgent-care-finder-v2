import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import styles from '../../styles/Home.module.css'
import { server } from "../../config";
import Navigation from '../../components/navigation'
import Footer from '../../components/footer'

export default function Home({ locations }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>NC Urgent Care Finder</title>
        <meta name="description" content="Urgent Care Finder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script type="module" src="https://unpkg.com/@patternfly/pfe-cta@1.12.3/dist/pfe-cta.min.js" />

      <Navigation />

      <main className={styles.main}>
        <div className={styles.map}>
          {/* Map */}
        </div>
        <div className={styles.list}>
          <ul>
            {locations.map(urgentCareCenter => (
              <li key={urgentCareCenter.properties.ID}>
                <h2>{urgentCareCenter.properties.NAME}</h2>
                <address>
                  {urgentCareCenter.properties.ADDRESS}<br />
                  {urgentCareCenter.properties.CITY}, {urgentCareCenter.properties.STATE} {urgentCareCenter.properties.ZIP}<br />
                  <a href={"tel:" + urgentCareCenter.properties.TELEPHONE}>{urgentCareCenter.properties.TELEPHONE}</a>
                </address>
                <div>
                <pfe-cta priority="primary" class="push-right"><Link href={urgentCareCenter.properties.ID + "/schedule-visit"} passHref><a>Schedule a visit</a></Link></pfe-cta>
                <pfe-cta><Link href={urgentCareCenter.properties.ID} passHref><a>More information</a></Link></pfe-cta>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch(`${server}/api/locations`);
  const locations = await res.json();

  return {
    props: {
      locations
    },
  }
}
