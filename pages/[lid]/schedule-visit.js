import Head from 'next/head'
import Script from 'next/script'
import Footer from '../../components/footer'
import Navigation from '../../components/navigation'
import { server } from '../../config'
import styles from '../../styles/ScheduleVisit.module.css'

export default function ScheduleVisit({ urgentCareCenter, dates }) {
  return (
    <div>
      <Head>
        <title>Urgent Care Finder - Schedule Visit</title>
        <meta name="description" content="Urgent Care Finder - Schedule Visit" />
      </Head>

      <Script type="module" src="https://unpkg.com/@patternfly/pfe-datetime@latest/dist/pfe-datetime.min.js" />

      <Navigation />

      <main>
        <h1>Schedule a visit</h1>
        <h2>{urgentCareCenter.properties.NAME}</h2>
        {dates.map(date => (
          <div key={date.date}>
            <h3>
              <pfe-datetime 
                type="local"
                day="numeric"
                month="long"
                year="numeric"
                datetime={new Date(date.date)}>
              </pfe-datetime>
            </h3>
            <ul className={styles.list}>
              {date.appointmentSlots.map(appointment => (
                <li key={appointment.date}>
                  <a href="" className={styles.button}>
                    <pfe-datetime
                      type="local"
                      hour="numeric"
                      minute="numeric"
                      datetime={new Date(appointment.date)}>
                    </pfe-datetime>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch(`${server}/api/locations/${context.params.lid}`);
  const urgentCareCenter = await res.json();

  const date = new Date();
  const today = new Date().setDate(date.getDate());
  const tomorrow = new Date().setDate(date.getDate() + 1);
  const dayAfterNext = new Date().setDate(date.getDate() + 2);
  const dates = [
    { date: today, appointmentSlots: [] },
    { date: tomorrow, appointmentSlots: [] },
    { date: dayAfterNext, appointmentSlots: [] },
  ];
  const appointmentSlots = 45;

  dates.forEach(date => {
    const _date = new Date(date.date);
    let appointmentTime = new Date(_date.setHours(8, 30, 0));

    let i = 0;
    while(i < appointmentSlots) {
      const appointment = {
        date: appointmentTime.toString()
      };

      date.appointmentSlots.push(appointment);
      appointmentTime.setMinutes(appointmentTime.getMinutes() + 15);
      i++;
    }
  });

  return {
    props: {
      urgentCareCenter,
      dates,
    }
  }
}