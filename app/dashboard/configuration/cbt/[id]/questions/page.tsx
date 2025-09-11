import PageTitle from '@/components/custom/PageTitle/PageTitle'
import Test from '@/components/features/configuration/cbt/Test'
import React from 'react'

const AddingQuestionPage = ({params}) => {
  
  const testID = params.id
  return (
    <div style={{minHeight:"100vh"}}>
        <PageTitle pathname="subject-questions" />
        <div>
          <Test testID={testID}  />
        </div>
    </div>
  )
}

export default AddingQuestionPage