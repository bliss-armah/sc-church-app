import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppDispatch, RootState } from "@/store/store";
import { fetchMemberById, updateMember } from "@/store/slices/membersSlice";

export default function EditMemberPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentMember, isLoading } = useSelector(
    (state: RootState) => state.members,
  );
  const [formData, setFormData] = useState({
    first_name: "",
    second_name: "",
    other_names: "",
    last_name: "",
    date_of_birth: "",
    gender: "male" as "male" | "female" | "other",
    phone_number: "",
    email: "",
    address: "",
    membership_status: "active" as "active" | "inactive" | "visitor",
    date_joined: "",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchMemberById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentMember) {
      setFormData({
        first_name: currentMember.first_name,
        second_name: currentMember.second_name || "",
        other_names: currentMember.other_names || "",
        last_name: currentMember.last_name,
        date_of_birth: currentMember.date_of_birth.split("T")[0],
        gender: currentMember.gender,
        phone_number: currentMember.phone_number || "",
        email: currentMember.email || "",
        address: currentMember.address || "",
        membership_status: currentMember.membership_status,
        date_joined: currentMember.date_joined.split("T")[0],
        notes: currentMember.notes || "",
      });
    }
  }, [currentMember]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await dispatch(updateMember({ id, data: formData })).unwrap();
      navigate(`/members/${id}`);
    } catch (error) {
      console.error("Failed to update member:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading member details...</div>;
  }

  if (!currentMember) {
    return <div className="text-center py-8">Member not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Member</h1>
        <p className="text-muted-foreground">
          Update {currentMember.first_name} {currentMember.last_name}'s
          information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
          <CardDescription>Update the member's details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="second_name">Second Name</Label>
                <Input
                  id="second_name"
                  name="second_name"
                  value={formData.second_name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_names">Other Names</Label>
                <Input
                  id="other_names"
                  name="other_names"
                  value={formData.other_names}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="membership_status">Membership Status</Label>
                <select
                  id="membership_status"
                  name="membership_status"
                  value={formData.membership_status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="visitor">Visitor</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_joined">Date Joined</Label>
                <Input
                  id="date_joined"
                  name="date_joined"
                  type="date"
                  value={formData.date_joined}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Additional notes about the member..."
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Member"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/members/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
