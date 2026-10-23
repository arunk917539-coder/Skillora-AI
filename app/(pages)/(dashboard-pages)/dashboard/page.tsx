
import DashboardTab from '@/app/components/dashboard/tabs/dashboard'
import CreateInterviewTab from '@/app/components/dashboard/tabs/create-interview'
import { TabsContent } from '@/app/components/ui/tabs'
import React from 'react'
import MockInterviewTab from '@/app/components/dashboard/tabs/mock-interview'
import InterviewHistory from '@/app/components/dashboard/tabs/interview-history'
import HrQuestionsTab from '@/app/components/dashboard/tabs/hr-questions-tab'

const page = () => {
  return (
    <div className=' z-50'>
      <TabsContent value="dashboard">
        <DashboardTab />
      </TabsContent>
      <TabsContent value="live_interviews">
        <MockInterviewTab />
      </TabsContent>
      <TabsContent className='mb-4' value="mock_interviews">
        <MockInterviewTab />
      </TabsContent>
      <TabsContent value="create_interview">
        <CreateInterviewTab />
      </TabsContent>
      <TabsContent value="interview_history">
        <InterviewHistory />
      </TabsContent>
      <TabsContent value="hr_questions">
        <HrQuestionsTab />
      </TabsContent>
    </div>
  )
}

export default page