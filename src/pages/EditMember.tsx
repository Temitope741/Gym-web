import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getUsers, updateUser, User } from '@/lib/auth';
import { ArrowLeft } from 'lucide-react';

const EditMember = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [member, setMember] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    emergencyContact: '',
    membershipPlan: 'Basic' as 'Basic' | 'Premium' | 'VIP',
    membershipStatus: 'Active' as 'Active' | 'Expired' | 'Pending',
  });

  useEffect(() => {
    const users = getUsers();
    const foundMember = users.find(u => u.id === memberId);
    if (foundMember) {
      setMember(foundMember);
      setFormData({
        fullName: foundMember.fullName,
        phone: foundMember.phone,
        emergencyContact: foundMember.emergencyContact,
        membershipPlan: foundMember.membershipPlan,
        membershipStatus: foundMember.membershipStatus,
      });
    }
  }, [memberId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;

    setIsLoading(true);
    try {
      updateUser(memberId, formData);
      toast({
        title: 'Member updated',
        description: 'Member information has been successfully updated',
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'An error occurred while updating the member',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Member not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Edit Member</CardTitle>
            <CardDescription>Update member information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={member.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="membershipPlan">Membership Plan</Label>
                <Select
                  value={formData.membershipPlan}
                  onValueChange={(value) => handleChange('membershipPlan', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic - ₦20000/month</SelectItem>
                    <SelectItem value="Premium">Premium - ₦30000/month</SelectItem>
                    <SelectItem value="VIP">VIP - ₦45000/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="membershipStatus">Membership Status</Label>
                <Select
                  value={formData.membershipStatus}
                  onValueChange={(value) => handleChange('membershipStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditMember;
