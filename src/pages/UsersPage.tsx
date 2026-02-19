import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Plus, Pencil, Trash2, RotateCcw, Search } from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  clearError,
  SystemUser,
  UserRole,
  ROLE_LABELS,
  ROLE_COLORS,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/store/slices/usersSlice";

// ─── Role badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

// ─── Modal base ───────────────────────────────────────────────────────────────
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

const ROLES: UserRole[] = ["super_admin", "calling_team", "texting_team"];

// ─── Create User Modal ────────────────────────────────────────────────────────
function CreateUserModal({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((s: RootState) => s.users);
  const [form, setForm] = useState<CreateUserPayload>({
    email: "",
    username: "",
    fullName: "",
    password: "",
    role: "calling_team",
  });

  const set =
    (k: keyof CreateUserPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(createUser(form));
    if (!result.type.endsWith("/rejected")) onClose();
  };

  return (
    <Modal title="Add New User" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="cu-fullName">Full Name *</Label>
            <Input
              id="cu-fullName"
              value={form.fullName}
              onChange={set("fullName")}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cu-username">Username *</Label>
            <Input
              id="cu-username"
              value={form.username}
              onChange={set("username")}
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="cu-email">Email *</Label>
          <Input
            id="cu-email"
            type="email"
            value={form.email}
            onChange={set("email")}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cu-password">Initial Password *</Label>
          <Input
            id="cu-password"
            type="password"
            value={form.password}
            onChange={set("password")}
            required
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">
            Min 8 chars, uppercase, lowercase, number. User must change on first
            login.
          </p>
        </div>
        <div className="space-y-1">
          <Label htmlFor="cu-role">Role *</Label>
          <select
            id="cu-role"
            value={form.role}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value as UserRole }))
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Edit User Modal ──────────────────────────────────────────────────────────
function EditUserModal({
  user,
  onClose,
}: {
  user: SystemUser;
  onClose: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((s: RootState) => s.users);
  const [form, setForm] = useState<UpdateUserPayload>({
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
  });

  const set =
    (k: keyof UpdateUserPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateUser({ id: user.id, data: form }));
    if (!result.type.endsWith("/rejected")) onClose();
  };

  return (
    <Modal title={`Edit — ${user.fullName}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="eu-fullName">Full Name</Label>
          <Input
            id="eu-fullName"
            value={form.fullName}
            onChange={set("fullName")}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="eu-email">Email</Label>
          <Input
            id="eu-email"
            type="email"
            value={form.email}
            onChange={set("email")}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="eu-role">Role</Label>
          <select
            id="eu-role"
            value={form.role}
            onChange={(e) =>
              setForm((f) => ({ ...f, role: e.target.value as UserRole }))
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <input
            id="eu-active"
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm((f) => ({ ...f, isActive: e.target.checked }))
            }
            className="h-4 w-4"
          />
          <Label htmlFor="eu-active">Account Active</Label>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Reset Password Modal ─────────────────────────────────────────────────────
function ResetPasswordModal({
  user,
  onClose,
}: {
  user: SystemUser;
  onClose: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((s: RootState) => s.users);
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      resetUserPassword({ id: user.id, newPassword }),
    );
    if (!result.type.endsWith("/rejected")) onClose();
  };

  return (
    <Modal title={`Reset Password — ${user.fullName}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="rp-password">New Password *</Label>
          <Input
            id="rp-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">
            User will be required to change password on next login.
          </p>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type ModalState =
  | { type: "create" }
  | { type: "edit"; user: SystemUser }
  | { type: "reset"; user: SystemUser }
  | null;

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, error, pagination } = useSelector(
    (s: RootState) => s.users,
  );
  const [modal, setModal] = useState<ModalState>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUsers({ role: roleFilter || undefined }));
  }, [dispatch, roleFilter]);

  const handleDelete = async (user: SystemUser) => {
    if (window.confirm(`Delete ${user.fullName}? This cannot be undone.`)) {
      dispatch(deleteUser(user.id));
    }
  };

  const closeModal = () => {
    dispatch(clearError());
    setModal(null);
    // Refresh the list after any mutation
    dispatch(fetchUsers({ role: roleFilter || undefined }));
  };

  const filtered = search
    ? users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.username.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage system users and their roles
          </p>
        </div>
        <Button onClick={() => setModal({ type: "create" })}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name, email or username…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(["", ...ROLES] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r as UserRole | "")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    roleFilter === r
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-input hover:bg-accent"
                  }`}
                >
                  {r === "" ? "All Roles" : ROLE_LABELS[r as UserRole]}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>{pagination.total} users</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground">
              Loading users…
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Username
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3 px-2">
                        <div className="font-medium">{user.fullName}</div>
                        {user.mustChangePassword && (
                          <span className="text-xs text-amber-600">
                            ⚠ Must change password
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        @{user.username}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="py-3 px-2">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            title="Edit user"
                            onClick={() => setModal({ type: "edit", user })}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Reset password"
                            onClick={() => setModal({ type: "reset", user })}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Delete user"
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {modal?.type === "create" && <CreateUserModal onClose={closeModal} />}
      {modal?.type === "edit" && (
        <EditUserModal user={modal.user} onClose={closeModal} />
      )}
      {modal?.type === "reset" && (
        <ResetPasswordModal user={modal.user} onClose={closeModal} />
      )}
    </div>
  );
}
