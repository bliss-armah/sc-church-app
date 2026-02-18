import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import { fetchMembers, deleteMember } from "@/store/slices/membersSlice";

export default function MembersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { members, isLoading, pagination } = useSelector(
    (state: RootState) => state.members,
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchMembers({ page: 1, size: 10, search }));
  }, [dispatch, search]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      dispatch(deleteMember(id));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchMembers({ page: 1, size: 10, search }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground">Manage church member records</p>
        </div>
        <Link to="/members/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Members</CardTitle>
          <CardDescription>
            Find members by name, email, or phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Member List</CardTitle>
          <CardDescription>{pagination.total} total members</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading members...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No members found
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {member.first_name} {member.second_name}{" "}
                      {member.last_name}
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Email: {member.email || "N/A"}</p>
                      <p>Phone: {member.phone_number || "N/A"}</p>
                      <p>Status: {member.membership_status}</p>
                      <p>
                        Joined:{" "}
                        {new Date(member.date_joined).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/members/${member.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/members/${member.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
