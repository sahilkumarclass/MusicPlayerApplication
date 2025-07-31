import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatTimeAgo } from '@/lib/utils';
import { UserX, Trash2, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { queryClient } from '@/lib/queryClient';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: api.getUsers,
    enabled: currentUser?.role === 'ADMIN',
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: number; isActive: boolean }) =>
      api.toggleUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Success",
        description: "User status updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const handleToggleStatus = (userId: number, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ userId, isActive: !currentStatus });
  };

  const handleDelete = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(userId);
    }
  };

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Manage Users</h1>

      {/* Users Table */}
      <div className="bg-music-card rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-gray-400 text-sm font-medium">
          <div className="col-span-3">User</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Join Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Actions</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading users...</div>
        ) : users && users.length > 0 ? (
          <div className="space-y-0">
            {users.map((user: any) => (
              <div key={user.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-music-gray transition-colors">
                <div className="col-span-3 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-music-primary rounded-full flex items-center justify-center">
                    <User className="text-white w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{user.username}</p>
                    <p className="text-gray-400 text-sm truncate">ID: {user.id}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center text-gray-300 truncate">{user.email}</div>
                <div className="col-span-2 flex items-center">
                  <Badge
                    variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}
                    className={user.role === 'ADMIN' ? 'bg-music-primary' : 'bg-gray-700 text-gray-300'}
                  >
                    {user.role}
                  </Badge>
                </div>
                <div className="col-span-2 flex items-center text-gray-300">
                  {formatTimeAgo(new Date(user.createdAt))}
                </div>
                <div className="col-span-2 flex items-center">
                  <Badge
                    variant={user.isActive ? 'default' : 'destructive'}
                    className={user.isActive
                      ? 'bg-music-success bg-opacity-20 text-music-success'
                      : 'bg-music-error bg-opacity-20 text-music-error'
                    }
                  >
                    {user.isActive ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
                <div className="col-span-1 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                    className="text-yellow-500 hover:text-yellow-400 p-1 h-auto"
                    title={user.isActive ? 'Disable User' : 'Enable User'}
                    disabled={toggleStatusMutation.isPending}
                  >
                    <UserX className="w-4 h-4" />
                  </Button>
                  {user.id !== currentUser?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="text-music-error hover:text-red-400 p-1 h-auto"
                      title="Delete User"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">No users found.</div>
        )}
      </div>
    </div>
  );
}
