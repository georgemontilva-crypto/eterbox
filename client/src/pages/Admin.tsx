import { useState, useEffect } from "react";
import { trpc } from "../lib/trpc";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Shield,
  TrendingUp,
  Search,
  Edit2,
  Trash2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export default function Admin() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
    planId: 1,
    emailVerified: false,
  });

  // Queries
  const { data: stats, refetch: refetchStats } = trpc.admin.getStats.useQuery();
  const { data: usersData, refetch: refetchUsers } = trpc.admin.listUsers.useQuery({
    page: currentPage,
    pageSize: 10,
    search: searchQuery || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
  });
  const { data: plans } = trpc.admin.getPlans.useQuery();

  // Mutations
  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      refetchUsers();
      refetchStats();
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        email: "",
        password: "",
        role: "user",
        planId: 1,
        emailVerified: false,
      });
    },
  });

  const updatePlanMutation = trpc.admin.updateUserPlan.useMutation({
    onSuccess: () => {
      refetchUsers();
      setShowEditModal(false);
    },
  });

  const updateRoleMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      refetchUsers();
      refetchStats();
      setShowEditModal(false);
    },
  });

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      refetchUsers();
      refetchStats();
      setShowDeleteModal(false);
    },
  });

  const verifyEmailMutation = trpc.admin.verifyUserEmail.useMutation({
    onSuccess: () => {
      refetchUsers();
    },
  });

  const handleCreateUser = () => {
    createUserMutation.mutate(createForm);
  };

  const handleUpdatePlan = (planId: number) => {
    if (selectedUser) {
      updatePlanMutation.mutate({ userId: selectedUser.id, planId });
    }
  };

  const handleUpdateRole = (role: "user" | "admin") => {
    if (selectedUser) {
      updateRoleMutation.mutate({ userId: selectedUser.id, role });
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate({ userId: selectedUser.id });
    }
  };

  const handleVerifyEmail = (userId: number) => {
    verifyEmailMutation.mutate({ userId });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#00f0ff]/30 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#00f0ff]" />
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] rounded-[15px] hover:bg-[#00f0ff]/20 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] border border-[#00f0ff]/30 rounded-[15px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="w-12 h-12 text-[#00f0ff]" />
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#00f0ff]/30 rounded-[15px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Administrators</p>
                <p className="text-3xl font-bold mt-2">{stats?.adminUsers || 0}</p>
              </div>
              <Shield className="w-12 h-12 text-[#00f0ff]" />
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#00f0ff]/30 rounded-[15px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Plans</p>
                <div className="mt-2 space-y-1">
                  {stats?.planStats.map((stat: any) => (
                    <div key={stat.planId} className="text-sm">
                      <span className="text-gray-400">{stat.planName}:</span>{" "}
                      <span className="font-bold">{stat.userCount}</span>
                    </div>
                  ))}
                </div>
              </div>
              <TrendingUp className="w-12 h-12 text-[#00f0ff]" />
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-[#1a1a1a] border border-[#00f0ff]/30 rounded-[15px] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black border border-[#00f0ff]/30 rounded-[15px] text-white placeholder-gray-400 focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-4 py-2 bg-black border border-[#00f0ff]/30 rounded-[15px] text-white focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>

            {/* Create User Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-[#00f0ff] text-black font-semibold rounded-[15px] hover:bg-[#00d0dd] transition-all flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Create User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1a1a1a] border border-[#00f0ff]/30 rounded-[15px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Verified
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00f0ff]/10">
                {usersData?.users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-black/30 transition-colors">
                    <td className="px-6 py-4 text-sm">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-[#00f0ff]/20 text-[#00f0ff]"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.planName}</td>
                    <td className="px-6 py-4 text-sm">
                      {user.emailVerified ? (
                        <span className="text-green-400">✓ Verified</span>
                      ) : (
                        <button
                          onClick={() => handleVerifyEmail(user.id)}
                          className="text-[#00f0ff] hover:underline"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="p-2 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] rounded-[10px] hover:bg-[#00f0ff]/20 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 bg-red-500/10 border border-red-500 text-red-500 rounded-[10px] hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {usersData && usersData.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#00f0ff]/10">
              <p className="text-sm text-gray-400">
                Page {usersData.page} of {usersData.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] rounded-[10px] hover:bg-[#00f0ff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(usersData.totalPages, p + 1))}
                  disabled={currentPage === usersData.totalPages}
                  className="p-2 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] rounded-[10px] hover:bg-[#00f0ff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#00f0ff]/30 rounded-[15px] p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create New User</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-white/10 rounded-[10px] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#00f0ff]/30 rounded-[15px] text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#00f0ff]/30 rounded-[15px] text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#00f0ff]/30 rounded-[15px] text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, role: e.target.value as "user" | "admin" })
                  }
                  className="w-full px-4 py-2 bg-black border border-[#00f0ff]/30 rounded-[15px] text-white focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Plan</label>
                <select
                  value={createForm.planId}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, planId: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-black border border-[#00f0ff]/30 rounded-[15px] text-white focus:outline-none focus:border-[#00f0ff]"
                >
                  {plans?.map((plan: any) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="emailVerified"
                  checked={createForm.emailVerified}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, emailVerified: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="emailVerified" className="text-sm">
                  Email Verified
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-[15px] hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={createUserMutation.isPending}
                className="flex-1 px-4 py-2 bg-[#00f0ff] text-black font-semibold rounded-[15px] hover:bg-[#00d0dd] transition-all disabled:opacity-50"
              >
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#00f0ff]/30 rounded-[15px] p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit User</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-white/10 rounded-[10px] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-lg font-semibold">{selectedUser.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg font-semibold">{selectedUser.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  defaultValue={selectedUser.role}
                  onChange={(e) => handleUpdateRole(e.target.value as "user" | "admin")}
                  className="w-full px-4 py-2 bg-black border border-[#00f0ff]/30 rounded-[15px] text-white focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Plan</label>
                <select
                  defaultValue={selectedUser.planId}
                  onChange={(e) => handleUpdatePlan(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-black border border-[#00f0ff]/30 rounded-[15px] text-white focus:outline-none focus:border-[#00f0ff]"
                >
                  {plans?.map((plan: any) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowEditModal(false)}
              className="w-full mt-6 px-4 py-2 bg-[#00f0ff] text-black font-semibold rounded-[15px] hover:bg-[#00d0dd] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-red-500/30 rounded-[15px] p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-500">Delete User</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-white/10 rounded-[10px] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-bold">{selectedUser.name}</span>{" "}
              ({selectedUser.email})? This action cannot be undone and will delete all their data
              including credentials and folders.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-[15px] hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleteUserMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-[15px] hover:bg-red-600 transition-all disabled:opacity-50"
              >
                {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
