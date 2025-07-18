import PageTitle from '@/components/custom/PageTitle/PageTitle'
import Services from '@/components/features/configuration/services/Services'

const ServicesConfigPage = () => {
  return (
    <div style={{minHeight:"100vh"}}>
        <PageTitle pathname="Services Setting" />
        <h4 className="my-3 mt-4">Services & Applications</h4>
        <Services />
    </div>
  )
}

export default ServicesConfigPage