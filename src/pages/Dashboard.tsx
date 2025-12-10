import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Award,
  Target,
  Activity,
  Clock,
  CreditCard,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Flame,
  Users,
  BarChart3
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  const daysUntilExpiry = differenceInDays(new Date(user.membershipExpiry), new Date());
  const isExpiringSoon = daysUntilExpiry <= 30;
  const membershipProgress = Math.max(0, Math.min(100, ((365 - daysUntilExpiry) / 365) * 100));

  // Mock data - Replace with API calls
  const stats = {
    workoutsThisWeek: 4,
    caloriesBurned: 2850,
    currentStreak: 7,
    totalWorkouts: 45,
    goalsCompleted: 12,
    upcomingClasses: 3
  };

  const recentActivity = [
    { id: 1, type: 'workout', title: 'Morning Strength Training', date: new Date(), duration: '45 min' },
    { id: 2, type: 'class', title: 'Yoga Flow Session', date: new Date(), duration: '60 min' },
    { id: 3, type: 'achievement', title: 'Completed 7-day Streak!', date: new Date() }
  ];

  const upcomingClasses = [
    { id: 1, name: 'CrossFit', trainer: 'John Smith', time: '6:00 AM', spots: 5, enrolled: true },
    { id: 2, name: 'Yoga', trainer: 'Sarah Jones', time: '9:00 AM', spots: 3, enrolled: false }
  ];

  const quickActions = [
    { icon: <CreditCard className="h-5 w-5" />, label: 'Membership', action: () => navigate('/membership') },
    { icon: <Calendar className="h-5 w-5" />, label: 'Book Class', action: () => {} },
    { icon: <Dumbbell className="h-5 w-5" />, label: 'Start Workout', action: () => {} },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'View Progress', action: () => {} }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-background border-b backdrop-blur-sm bg-background/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">FitZone</h1>
                <p className="text-xs text-muted-foreground">Member Portal</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-white">
                  3
                </span>
              </Button>
              
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-white">
                    {user.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <Badge variant="outline" className="text-xs">{user.membershipPlan}</Badge>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/login'); }}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-in-down">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.fullName.split(' ')[0]}! 👋</h2>
          <p className="text-muted-foreground">Ready to crush your fitness goals today?</p>
        </div>

        {/* Expiry Warning */}
        {isExpiringSoon && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 animate-slide-in-up">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-semibold">Membership Expiring Soon</p>
                  <p className="text-sm text-muted-foreground">
                    {daysUntilExpiry} days remaining - Renew now to keep your benefits
                  </p>
                </div>
              </div>
              <Button variant="default" size="sm" onClick={() => navigate('/membership')}>
                View Details
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-in-up">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={action.action}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                  {action.icon}
                </div>
                <p className="font-medium text-sm">{action.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
                    <Flame className="h-4 w-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.workoutsThisWeek}</div>
                  <p className="text-xs text-muted-foreground mt-1">Workouts completed</p>
                  <Progress value={66} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
                    <Award className="h-4 w-4 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.currentStreak}</div>
                  <p className="text-xs text-muted-foreground mt-1">Days in a row</p>
                  <p className="text-xs text-primary mt-2">🔥 Keep it up!</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Calories Burned</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.caloriesBurned.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">This week</p>
                  <p className="text-xs text-green-600 mt-2">↑ 12% from last week</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Workouts</CardTitle>
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                  <p className="text-xs text-muted-foreground mt-2">Since {format(new Date(user.joinDate), 'MMM yyyy')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - 2 cols */}
              <div className="lg:col-span-2 space-y-6">
                {/* Membership Card with CTA */}
                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/membership')}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Membership Status</CardTitle>
                        <CardDescription>Click to view full details</CardDescription>
                      </div>
                      <Badge variant={user.membershipStatus === 'Active' ? 'default' : 'destructive'} className="text-sm">
                        {user.membershipStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Membership Period</span>
                        <span className="font-medium">{daysUntilExpiry} days remaining</span>
                      </div>
                      <Progress value={membershipProgress} className="h-3" />
                    </div>
                    <Button variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); navigate('/membership'); }}>
                      View Membership Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest workouts and achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'achievement' ? 'bg-yellow-500/10 text-yellow-500' :
                            activity.type === 'class' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {activity.type === 'achievement' ? <Award className="h-5 w-5" /> :
                             activity.type === 'class' ? <Users className="h-5 w-5" /> :
                             <Dumbbell className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(activity.date, 'MMM dd, yyyy')}
                              {activity.duration && ` • ${activity.duration}`}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Upcoming Classes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Classes</CardTitle>
                    <CardDescription>Your scheduled sessions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingClasses.map((classItem) => (
                      <div key={classItem.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{classItem.name}</p>
                            <p className="text-sm text-muted-foreground">with {classItem.trainer}</p>
                          </div>
                          {classItem.enrolled && (
                            <Badge variant="outline" className="text-xs">Enrolled</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {classItem.time}
                          </div>
                          <p className="text-xs text-muted-foreground">{classItem.spots} spots left</p>
                        </div>
                        {!classItem.enrolled && (
                          <Button size="sm" className="w-full mt-3">Enroll Now</Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      View All Classes
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Goals Completed</span>
                      <span className="font-bold">{stats.goalsCompleted}/15</span>
                    </div>
                    <Progress value={(stats.goalsCompleted / 15) * 100} className="h-2" />
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">Upcoming Classes</span>
                      <span className="font-bold">{stats.upcomingClasses}</span>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View Full Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs - Placeholder */}
          <TabsContent value="workouts">
            <Card>
              <CardContent className="py-8 text-center">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Workout Plans</h3>
                <p className="text-muted-foreground">Your personalized workouts</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes">
            <Card>
              <CardContent className="py-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Classes</h3>
                <p className="text-muted-foreground">Browse and enroll in classes</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardContent className="py-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">View your fitness journey</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;