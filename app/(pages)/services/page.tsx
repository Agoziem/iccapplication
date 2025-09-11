import BackButton from '@/components/custom/backbutton/BackButton'
import NextBreadcrumb from '@/components/custom/Breadcrumb/breadcrumb'
import Services from '@/components/features/Services/Services'

const ServicesPage = () => {
  return (
    <section className='container px-3 px-md-4 py-4 mb-5'>
        <div className="mb-3">
          <NextBreadcrumb capitalizeLinks />
          <BackButton />
        </div>
        <Services />
    </section>
  )
}

export default ServicesPage