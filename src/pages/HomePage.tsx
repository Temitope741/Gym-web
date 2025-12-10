import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Target, 
  Users, 
  Award, 
  Clock, 
  TrendingUp,
  Check,
  ArrowRight,
  Star
} from 'lucide-react';
import gym from '@/assets/gym.jpg'
import lastrep from '@/assets/lastrep.jpg'
import painnn from '@/assets/painnn.jpg'
import akpan from '@/assets/akpan.jpg'

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Personal Training',
      description: 'One-on-one sessions with certified trainers tailored to your goals'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Group Classes',
      description: 'Dynamic group workouts including yoga, CrossFit, and more'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Access',
      description: 'Train on your schedule with round-the-clock gym access'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Progress Tracking',
      description: 'Monitor your fitness journey with detailed analytics'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Expert Trainers',
      description: 'Learn from certified professionals with years of experience'
    },
    {
      icon: <Dumbbell className="h-8 w-8" />,
      title: 'Modern Equipment',
      description: 'State-of-the-art machines and free weights'
    }
  ];

  const plans = [
    {
      name: 'Basic',
      price: 20000,
      features: [
        'Access to gym equipment',
        'Locker room facilities',
        'Basic fitness assessment',
        'Mobile app access'
      ]
    },
    {
      name: 'Premium',
      price: 30000,
      popular: true,
      features: [
        'Everything in Basic',
        '5 group classes per month',
        'Nutrition consultation',
        'Guest passes (2/month)',
        'Priority booking'
      ]
    },
    {
      name: 'VIP',
      price: 45000,
      features: [
        'Everything in Premium',
        'Unlimited group classes',
        'Personal training (4 sessions/month)',
        'Spa & sauna access',
        'Free guest passes',
        'Priority support'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Olaolu Johnson',
      role: 'Member since 2024',
      content: 'Best gym experience ever! The trainers are incredibly supportive and the facilities are top-notch.',
      rating: 5
    },
    {
      name: 'Sarah Glover',
      role: 'Premium Member',
      content: 'I\'ve achieved results I never thought possible. The group classes are amazing!',
      rating: 5
    },
    {
      name: 'Jason David',
      role: 'VIP Member',
      content: 'The personal training sessions have transformed my fitness journey. Worth every penny!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">Fitness+ Gym</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Image */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/65 to-background/50 z-10" />
        <img 
            src={akpan}
            alt="Gym Hero"
            className="w-full h-full object-cover"
        />
        </div>
        <div className="container mx-auto relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}>
              <Badge className="mb-4 animate-pulse" variant="outline">
                🔥 Limited Time Offer - 10% Off First Month
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
                Transform Your Body,
                <br />
                Transform Your Life
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                Join the ultimate fitness community with world-class trainers, 
                modern equipment, and personalized workout plans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg gradient-gym hover:scale-105 transition-transform"
                  onClick={() => navigate('/register')}
                >
                  Start Your Fitness Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg"
                  onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Plans
                </Button>
              </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                <img 
                  src= {painnn}
                  alt="Fitness Training"
                  className="relative w-full h-[600px] rounded-3xl shadow-2xl overflow-hidden"
                />
                {/* Floating Stats Card */}
                <div className="absolute bottom-8 left-8 bg-background/90 backdrop-blur-md rounded-2xl p-6 shadow-xl animate-pulse-slow">
                  <div className="text-3xl font-bold text-primary mb-1">1,000+</div>
                  <div className="text-sm text-muted-foreground">Active Members</div>
                </div>
                {/* Floating Badge */}
                <div className="absolute top-8 right-8 bg-primary text-white rounded-full px-6 py-3 shadow-xl font-bold">
                  #2 Rated Gym
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {[
              { value: '1,000+', label: 'Active Members' },
              { value: '10+', label: 'Expert Trainers' },
              { value: '50+', label: 'Group Classes' },
              { value: '24/7', label: 'Gym Access' }
            ].map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Fitness+?</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to achieve your fitness goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-in fade-in-50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="p-3 bg-primary/10 text-primary rounded-lg w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Membership Plans</h2>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your fitness journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular ? 'border-primary border-2 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-gym">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₦{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Members Say</h2>
            <p className="text-xl text-muted-foreground">
              Real stories from real people
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="hover:shadow-xl transition-all duration-300 animate-in fade-in-50"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="gradient-gym text-white border-0">
            <CardContent className="py-16 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of members who have transformed their lives
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg"
                  onClick={() => navigate('/register')}
                >
                  Join Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg bg-transparent text-white border-white hover:bg-white/10"
                  onClick={() => navigate('/login')}
                >
                  Member Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold">Fitness+</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transform your body, transform your life. Join the ultimate fitness community today.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#plans" className="hover:text-primary transition-colors">Membership Plans</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Classes</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Trainers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>📍 123 Fitness Street, Lagos</li>
                <li>📞 +234 123 456 7890</li>
                <li>✉️ info@fitzone.com</li>
                <li>🕐 Mon-Sun: 24/7</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Fitness+ Gym. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;