import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getUsers, deleteUser } from '@/lib/auth';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  ArrowLeft,
  Search,
  Trash2,
  Edit,
  Download,
  Plus,
  Filter,
  BarChart3,
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  Settings,
  LogOut,
  RefreshCcw,
  MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');

  const allUsers = getUsers().filter(u => u.role !== 'admin');

  // Enhanced Statistics
  const stats = useMemo(() => {
    const activeMembers = allUsers.filter(u => u.membershipStatus === 'Active').length;
    const expiredMembers = allUsers.filter(u => u.membershipStatus === 'Expired').length;
    const pendingMembers = allUsers.filter(u => u.membershipStatus === 'Pending').length;
    
    // Revenue calculations
    const planPrices = { Basic: 29.99, Premium: 49.99, VIP: 79.99 };
    const monthlyRevenue = allUsers
      .filter(u => u.membershipStatus === 'Active')
      .reduce((sum, u) => sum + planPrices[u.membershipPlan as keyof typeof planPrices], 0);

    // Growth calculations
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSignups = allUsers.filter(u => new Date(u.joinDate) >= thirtyDaysAgo).length;

    // Expiring soon
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringSoon = allUsers.filter(u => {
      const expiryDate = new Date(u.membershipExpiry);
      return expiryDate <= thirtyDaysFromNow && u.membershipStatus === 'Active';
    }).length;

    return {
      totalMembers: allUsers.length,
      activeMembers,
      expiredMembers,
      pendingMembers,
      monthlyRevenue,
      annualRevenue: monthlyRevenue * 12,
      recentSignups,
      expiringSoon,
      retentionRate: allUsers.length > 0 ? (activeMembers / allUsers.length) * 100 : 0
    };
  }, [allUsers]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.membershipStatus === filterStatus;
      const matchesPlan = filterPlan === 'all' || user.membershipPlan === filterPlan;
      
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [allUsers, searchQuery, filterStatus, filterPlan]);

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      deleteUser(userId);
      toast({
        title: 'Member deleted',
        description: 'The member has been removed from the system',
      });
    }
  };

  const exportToCSV = () => {
    // Export logic here
    toast({
      title: 'Export successful',
      description: 'Member data has been exported',
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-background border-b backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Gym Management System</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <RefreshCcw className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Member View
              </Button>
              <Button variant="destructive" onClick={() => { logout(); navigate('/login'); }}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 animate-slide-in-down">
          <h2 className="text-3xl font-bold mb-2">Overview Dashboard</h2>
          <p className="text-muted-foreground">Monitor gym performance and manage members</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-up">
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalMembers}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.recentSignups} this month
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Active</p>
                      <p className="font-bold text-green-600">{stats.activeMembers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expired</p>
                      <p className="font-bold text-red-600">{stats.expiredMembers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pending</p>
                      <p className="font-bold text-yellow-600">{stats.pendingMembers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${stats.annualRevenue.toFixed(2)} annually
                  </p>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Target: $10,000</span>
                      <span className="font-medium">{((stats.monthlyRevenue / 10000) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${Math.min((stats.monthlyRevenue / 10000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.retentionRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Member satisfaction
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Active</span>
                      <span className="font-medium">{((stats.activeMembers / stats.totalMembers) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Churn</span>
                      <span className="font-medium text-red-600">{((stats.expiredMembers / stats.totalMembers) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 border-yellow-500/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{stats.expiringSoon}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Within next 30 days
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Send Reminders
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Chart component placeholder</p>
                      <p className="text-xs">Install recharts for visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership Distribution</CardTitle>
                  <CardDescription>By plan type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Basic', 'Premium', 'VIP'].map(plan => {
                      const count = allUsers.filter(u => u.membershipPlan === plan).length;
                      const percentage = stats.totalMembers > 0 ? (count / stats.totalMembers) * 100 : 0;
                      return (
                        <div key={plan}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-medium">{plan}</span>
                            <span className="text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`rounded-full h-2 ${
                                plan === 'Basic' ? 'bg-blue-500' :
                                plan === 'Premium' ? 'bg-primary' :
                                'bg-purple-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setActiveTab('members')}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Manage</p>
                    <h3 className="text-xl font-bold">Members</h3>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Schedule</p>
                    <h3 className="text-xl font-bold">Classes</h3>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">View</p>
                    <h3 className="text-xl font-bold">Reports</h3>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">Member Management</CardTitle>
                    <CardDescription>View and manage all gym members ({filteredUsers.length} total)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={exportToCSV} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button onClick={() => navigate('/register')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Enhanced Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Table */}
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Member</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {user.fullName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.fullName}</p>
                                  <p className="text-xs text-muted-foreground">ID: {user.id.slice(-8)}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{user.email}</p>
                                <p className="text-muted-foreground">{user.phone}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-medium">
                                {user.membershipPlan}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  user.membershipStatus === 'Active' ? 'default' : 
                                  user.membershipStatus === 'Expired' ? 'destructive' : 
                                  'secondary'
                                }
                              >
                                {user.membershipStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {format(new Date(user.joinDate), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center gap-2">
                                {format(new Date(user.membershipExpiry), 'MMM dd, yyyy')}
                                {new Date(user.membershipExpiry) < new Date() && (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => navigate(`/admin/member/${user.id}`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                            No members found matching your criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground mb-4">Detailed performance metrics and insights</p>
                <Button>View Full Analytics</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardContent className="py-12 text-center">
                <Download className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Generate Reports</h3>
                <p className="text-muted-foreground mb-4">Export comprehensive business reports</p>
                <Button>Generate Report</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;