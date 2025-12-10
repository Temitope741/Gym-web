import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  Download,
  Shield,
  Dumbbell,
  Users,
  Wifi,
  Droplet,
  Wind,
  Utensils,
  Lock,
  Settings,
  LogOut,
  ArrowLeft,
  Receipt,
  Crown
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { getUserPayments, getMembershipPrice } from '@/lib/auth';

const MembershipDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const userPayments = getUserPayments(user.id);
      setPayments(userPayments);
    }
  }, [user]);

  if (!user) return null;

  const daysUntilExpiry = differenceInDays(new Date(user.membershipExpiry), new Date());
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry < 0;
  const membershipProgress = Math.max(0, Math.min(100, ((365 - daysUntilExpiry) / 365) * 100));
  const currentPrice = getMembershipPrice(user.membershipPlan);

  // Define access based on membership plan
  const accessFeatures = {
    Basic: [
      { name: 'Gym Equipment Access', icon: <Dumbbell className="h-5 w-5" />, included: true },
      { name: 'Locker Room', icon: <Lock className="h-5 w-5" />, included: true },
      { name: 'Free WiFi', icon: <Wifi className="h-5 w-5" />, included: true },
      { name: 'Cardio Area', icon: <Wind className="h-5 w-5" />, included: true },
      { name: 'Group Classes', icon: <Users className="h-5 w-5" />, included: false, limit: '0/month' },
      { name: 'Personal Training', icon: <User className="h-5 w-5" />, included: false },
      { name: 'Sauna & Steam Room', icon: <Droplet className="h-5 w-5" />, included: false },
      { name: 'Nutrition Consultation', icon: <Utensils className="h-5 w-5" />, included: false },
      { name: 'Guest Passes', icon: <Users className="h-5 w-5" />, included: false },
      { name: 'Priority Support', icon: <Shield className="h-5 w-5" />, included: false }
    ],
    Premium: [
      { name: 'Gym Equipment Access', icon: <Dumbbell className="h-5 w-5" />, included: true },
      { name: 'Locker Room', icon: <Lock className="h-5 w-5" />, included: true },
      { name: 'Free WiFi', icon: <Wifi className="h-5 w-5" />, included: true },
      { name: 'Cardio Area', icon: <Wind className="h-5 w-5" />, included: true },
      { name: 'Group Classes', icon: <Users className="h-5 w-5" />, included: true, limit: '5/month' },
      { name: 'Personal Training', icon: <User className="h-5 w-5" />, included: false },
      { name: 'Sauna & Steam Room', icon: <Droplet className="h-5 w-5" />, included: false },
      { name: 'Nutrition Consultation', icon: <Utensils className="h-5 w-5" />, included: true, limit: '1/month' },
      { name: 'Guest Passes', icon: <Users className="h-5 w-5" />, included: true, limit: '2/month' },
      { name: 'Priority Support', icon: <Shield className="h-5 w-5" />, included: true }
    ],
    VIP: [
      { name: 'Gym Equipment Access', icon: <Dumbbell className="h-5 w-5" />, included: true },
      { name: 'Locker Room', icon: <Lock className="h-5 w-5" />, included: true },
      { name: 'Free WiFi', icon: <Wifi className="h-5 w-5" />, included: true },
      { name: 'Cardio Area', icon: <Wind className="h-5 w-5" />, included: true },
      { name: 'Group Classes', icon: <Users className="h-5 w-5" />, included: true, limit: 'Unlimited' },
      { name: 'Personal Training', icon: <User className="h-5 w-5" />, included: true, limit: '4 sessions/month' },
      { name: 'Sauna & Steam Room', icon: <Droplet className="h-5 w-5" />, included: true },
      { name: 'Nutrition Consultation', icon: <Utensils className="h-5 w-5" />, included: true, limit: 'Unlimited' },
      { name: 'Guest Passes', icon: <Users className="h-5 w-5" />, included: true, limit: 'Unlimited' },
      { name: 'Priority Support', icon: <Shield className="h-5 w-5" />, included: true }
    ]
  };

  const currentAccess = accessFeatures[user.membershipPlan as keyof typeof accessFeatures];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Membership Portal</h1>
                <p className="text-xs text-muted-foreground">Manage your membership</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
        {/* Expiry Alert */}
        {(isExpiringSoon || isExpired) && (
          <Card className={`mb-6 ${isExpired ? 'border-red-500 bg-red-50 dark:bg-red-950' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'} animate-slide-in-down`}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className={`h-6 w-6 ${isExpired ? 'text-red-600' : 'text-yellow-600'}`} />
                <div>
                  <p className="font-semibold">
                    {isExpired ? 'Membership Expired' : 'Membership Expiring Soon'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isExpired 
                      ? `Your membership expired ${Math.abs(daysUntilExpiry)} days ago` 
                      : `Only ${daysUntilExpiry} days remaining - Renew now to keep your benefits`
                    }
                  </p>
                </div>
              </div>
              <Button variant="default" size="sm">Renew Now</Button>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Member Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Member Card */}
            <Card className="overflow-hidden">
              <div className={`h-24 ${user.membershipPlan === 'VIP' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : user.membershipPlan === 'Premium' ? 'bg-gradient-to-r from-primary to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'}`} />
              <CardContent className="relative pt-0 pb-6">
                <div className="flex flex-col items-center -mt-12">
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold mt-4">{user.fullName}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Badge 
                      variant={user.membershipPlan === 'VIP' ? 'default' : 'outline'}
                      className={user.membershipPlan === 'VIP' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                    >
                      {user.membershipPlan === 'VIP' && <Crown className="h-3 w-3 mr-1" />}
                      {user.membershipPlan}
                    </Badge>
                    <Badge variant={user.membershipStatus === 'Active' ? 'default' : 'destructive'}>
                      {user.membershipStatus}
                    </Badge>
                  </div>

                  <Separator className="my-4" />

                  {/* Contact Info */}
                  <div className="w-full space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {format(new Date(user.joinDate), 'MMM yyyy')}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Membership Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Days Active</span>
                    <span className="font-medium">{Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Total Payments</span>
                    <span className="font-medium">{payments.length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Total Spent</span>
                    <span className="font-medium">
                      ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Membership Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Membership</CardTitle>
                    <CardDescription>Your current plan and benefits</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">${currentPrice}</div>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Membership Timeline */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Membership Period</span>
                    <span className="font-medium">
                      {isExpired 
                        ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                        : `${daysUntilExpiry} days remaining`
                      }
                    </span>
                  </div>
                  <Progress 
                    value={isExpired ? 100 : membershipProgress} 
                    className={`h-3 ${isExpired ? '[&>div]:bg-red-500' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Started: {format(new Date(user.joinDate), 'MMM dd, yyyy')}</span>
                    <span>Expires: {format(new Date(user.membershipExpiry), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                <Separator />

                {/* Plan Features */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    What's Included
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentAccess.map((feature, index) => (
                      <div 
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          feature.included 
                            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' 
                            : 'bg-muted/50 border-muted'
                        }`}
                      >
                        <div className={feature.included ? 'text-green-600' : 'text-muted-foreground'}>
                          {feature.included ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={feature.included ? 'text-green-600' : 'text-muted-foreground'}>
                              {feature.icon}
                            </span>
                            <p className={`text-sm font-medium ${!feature.included && 'text-muted-foreground line-through'}`}>
                              {feature.name}
                            </p>
                          </div>
                          {feature.limit && feature.included && (
                            <p className="text-xs text-muted-foreground mt-1">{feature.limit}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Upgrade Section */}
                {user.membershipPlan !== 'VIP' && (
                  <div className="bg-gradient-to-r from-primary/10 to-orange-500/10 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold mb-1">Want More Benefits?</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Upgrade to {user.membershipPlan === 'Basic' ? 'Premium' : 'VIP'} for additional perks
                        </p>
                        <Button size="sm">
                          Upgrade Now
                        </Button>
                      </div>
                      <Crown className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Your recent transactions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.slice(0, 10).map((payment) => (
                      <div 
                        key={payment.id} 
                        className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            payment.status === 'Completed' ? 'bg-green-100 dark:bg-green-900' :
                            payment.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900' :
                            'bg-red-100 dark:bg-red-900'
                          }`}>
                            {payment.status === 'Completed' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : payment.status === 'Pending' ? (
                              <Clock className="h-5 w-5 text-yellow-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{payment.plan} Plan</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(payment.date), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${payment.amount.toFixed(2)}</p>
                          <Badge 
                            variant={payment.status === 'Completed' ? 'default' : payment.status === 'Pending' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No payment history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipDashboard;