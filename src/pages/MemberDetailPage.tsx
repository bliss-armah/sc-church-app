import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, ArrowLeft } from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import { fetchMemberById } from "@/store/slices/membersSlice";

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentMember, isLoading } = useSelector(
    (state: RootState) => state.members,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchMemberById(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return <div className="text-center py-8">Loading member details...</div>;
  }

  if (!currentMember) {
    return <div className="text-center py-8">Member not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/members">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Members
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {currentMember.first_name} {currentMember.last_name}
            </h1>
            <p className="text-muted-foreground">Member Details</p>
          </div>
        </div>
        <Link to={`/members/${currentMember.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Member
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <p className="text-sm">
                {currentMember.first_name} {currentMember.second_name}{" "}
                {currentMember.other_names} {currentMember.last_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date of Birth
              </label>
              <p className="text-sm">
                {new Date(currentMember.date_of_birth).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Gender
              </label>
              <p className="text-sm capitalize">{currentMember.gender}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-sm">{currentMember.email || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Phone Number
              </label>
              <p className="text-sm">{currentMember.phone_number || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Address
              </label>
              <p className="text-sm">{currentMember.address || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <p className="text-sm capitalize">
                {currentMember.membership_status}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Date Joined
              </label>
              <p className="text-sm">
                {new Date(currentMember.date_joined).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {currentMember.notes || "No additional notes"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
