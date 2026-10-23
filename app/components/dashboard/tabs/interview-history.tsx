"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../ui/card'
import { Input } from '../../ui/input'
import { InterviewHistoryTable } from '../interview-history-table'
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { QueryKeys } from '@/hooks/react-query/keys';
import { FetchInterviewHistory } from '@/hooks/react-query/functions';



const InterviewHistory = () => {
    const [globalFilter, setglobalFilter] = useState("");

    const queryResult = useQuery({
        queryKey: [QueryKeys.fetch_interview_history],
        queryFn: FetchInterviewHistory,
        staleTime: 15 * 1000,
        gcTime: 10 * 60 * 1000, 
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: false,
    });

    return (
        <Card className="flex border-none h-full gap-0 bg-[#c1cbef] z-10 pt-0 px-0 rounded-4xl pb-0 w-full">
            <CardHeader className="flex py-4 justify-end flex-row">
                <Input
                    className="p-5 bg-white rounded-full text-sm max-w-sm active:outline-none active:ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
                    placeholder="Search completed assessments"
                    value={globalFilter}
                    onChange={(e) => setglobalFilter(e.target.value)}
                />
            </CardHeader>
            <CardContent className="w-full h-full py-0 px-0">
                <InterviewHistoryTable globalFilterValue={globalFilter} query={queryResult} />
            </CardContent>
        </Card>
    );
}

export default InterviewHistory


