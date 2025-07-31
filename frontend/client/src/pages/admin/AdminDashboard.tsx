import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Users, PlayCircle, HardDrive, Upload, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    queryFn: api.getDashboard,
    enabled: user?.role === 'ADMIN',
  });

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400">You don't have permission to access this page.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Songs',
      value: stats?.totalSongs || 0,
      icon: Music,
      color: 'text-music-primary',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-music-accent',
    },
    {
      title: 'Active Sessions',
      value: stats?.activeSessions || 0,
      icon: PlayCircle,
      color: 'text-music-success',
    },
    {
      title: 'Storage Used',
      value: stats?.storageUsed || '0 GB',
      icon: HardDrive,
      color: 'text-yellow-500',
      isText: true,
    },
  ];

  const recentActivity = [
    {
      icon: Upload,
      text: 'Song uploaded: "New Track"',
      time: '2 minutes ago',
      color: 'text-music-success',
    },
    {
      icon: UserPlus,
      text: 'New user registered: "john_doe"',
      time: '15 minutes ago',
      color: 'text-music-accent',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-music-card border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">
                    {stat.isText ? stat.value : stat.value.toLocaleString()}
                  </p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-music-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  <div>
                    <p className="text-white">{activity.text}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
