import PageTitle from '@/components/custom/PageTitle/PageTitle'
import SettingsForm from '@/components/features/configuration/cbt/SettingsForm'

const CbtConfigPage = () => {
  return (
    <div style={{minHeight:"100vh"}}>
        <PageTitle pathname="CBT Settings" />
        <SettingsForm />
    </div>
  )
}

export default CbtConfigPage