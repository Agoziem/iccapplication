import PageTitle from '@/components/custom/PageTitle/PageTitle'
import Services from '@/components/features/configuration/services/Services'

const ServicesConfigPage = () => {
  return (
    <div style={{minHeight:"100vh"}}>
        <PageTitle pathname="Services Setting" />
        <Services />
    </div>
  )
}

export default ServicesConfigPage