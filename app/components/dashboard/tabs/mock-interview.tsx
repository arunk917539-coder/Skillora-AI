"use client";

import React, { useEffect, useRef, useState } from 'react'
import { MockInterviewTable } from '../mock-interview-table'
import { Card, CardContent, CardHeader } from '../../ui/card'
import { Input } from '../../ui/input';
import { useQuery } from '@tanstack/react-query';
import { FetchMockInterviews } from '@/hooks/react-query/functions';
import { QueryKeys } from '@/hooks/react-query/keys';


const MockInterviewTab = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const queryResult = useQuery({
    queryKey: [QueryKeys.fetch_interview],
    queryFn: FetchMockInterviews,
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
          placeholder="Search workplace assessments"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </CardHeader>
      <CardContent className="w-full h-full py-0 px-0">
        <MockInterviewTable globalFilterValue={globalFilter} query={queryResult} />
      </CardContent>
    </Card>
  );
};

export default MockInterviewTab