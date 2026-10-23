import React from 'react'
import { TabsList, TabsTrigger } from '../../ui/tabs'

const baseTabItems = [
    { value: "Dashboard", key: "dashboard" },
    { value: "Workplace Assessments", key: "mock_interviews" },
    { value: "Create Assessment", key: "create_interview" },
    { value: "Assessment History", key: "interview_history" },
];

const TabBar = ({ isHr }: { isHr?: boolean }) => {
    const tabItems = isHr
        ? [...baseTabItems, { value: "Manage Scenarios", key: "hr_questions" }]
        : baseTabItems;

    return (
        <TabsList className='gap-2.5 px-1 bg-white py-6 rounded-r-full rounded-l-full'>
            {
                tabItems.map((item, index) => <TabsTrigger className='py-5 text-sm px-3 duration-300 rounded-full hover:scale-105 hover:bg-[#e7e9fb]' key={index} value={item.key}>{item.value}</TabsTrigger>)
            }
        </TabsList>
    )
}

export default TabBar