import Navbar from '@/components/nav/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import Head from 'next/head'
import { authenticate } from '@/utils/authenticate';
import FeeByAmount from '@/components/analytics/FeeByAmount';

export default function Analytics() {
  

  return (
    <>
      <Head>
        <title>Analytics - {process.env.NEXT_PUBLIC_SCHOOL_TITLE}</title>
        <meta name="description" content={'Powered by '+process.env.NEXT_PUBLIC_SCHOOL_TITLE} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=''>

        <Navbar />
        <div className="flex">
          <Sidebar currentPage='Analytics' />
          <div className="flex-1 p-3">

            <div className="flex flex-col">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FeeByAmount />
              </div>


            </div>

          </div>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  authenticate(context)

  return {
    props: {}
  }
}