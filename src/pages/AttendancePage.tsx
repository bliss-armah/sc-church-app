import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, RefreshCw } from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import { fetchAttendance } from "@/store/slices/attendanceSlice";

export default function AttendancePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { records, isLoading, pagination, error } = useSelector(
    (state: RootState) => state.attendance
  );
  
  const [filterDate, setFilterDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  });

  const loadData = () => {
    dispatch(fetchAttendance({ page: 1, size: 50, attendance_date: filterDate }));
  };

  useEffect(() => {
    loadData();
  }, [dispatch, filterDate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">View service check-in records</p>
        </div>
        <Button variant="outline" onClick={loadData} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Daily Check-ins</CardTitle>
            <CardDescription>
              Showing attendance records for {filterDate}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input 
              type="date" 
              className="w-auto h-9" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}
          
          <div className="rounded-md border">
            {isLoading && records.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Loading records...</div>
            ) : records.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No check-ins recorded for this date.</div>
            ) : (
              <div className="divide-y">
                {records.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-background">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">
                        {record.memberName || "Unknown Member"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID: {record.memberId?.split('-')[0] || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        {new Date(record.checkInTime || record.createdAt || record.attendanceDate).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                        {record.status?.toUpperCase() || "PRESENT"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground flex justify-between">
            <span>Total Check-ins: {pagination.total}</span>
            <span>Page {pagination.page} of {Math.max(1, pagination.pages)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
