import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserPlus, Calendar, TrendingUp } from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import { fetchMembers } from "@/store/slices/membersSlice";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { members } = useSelector((state: RootState) => state.members);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchMembers({ page: 1, size: 100 }));
  }, [dispatch]);

  const activeMembers = members.filter(
    (m) => m.membershipStatus === "active",
  ).length;
  const inactiveMembers = members.filter(
    (m) => m.membershipStatus === "inactive",
  ).length;
  const visitors = members.filter(
    (m) => m.membershipStatus === "visitor",
  ).length;

  const stats = [
    {
      title: "Total Members",
      value: members.length,
      description: "All registered members",
      icon: Users,
    },
    {
      title: "Active Members",
      value: activeMembers,
      description: "Currently active members",
      icon: UserPlus,
    },
    {
      title: "Visitors",
      value: visitors,
      description: "Registered visitors",
      icon: Calendar,
    },
    {
      title: "Inactive Members",
      value: inactiveMembers,
      description: "Inactive members",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName || user?.username}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest member registrations and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(member.dateJoined).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="/members/new"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="font-medium">Add New Member</div>
                <div className="text-sm text-muted-foreground">
                  Register a new church member
                </div>
              </a>
              <a
                href="/members"
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="font-medium">View All Members</div>
                <div className="text-sm text-muted-foreground">
                  Browse and manage member records
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
