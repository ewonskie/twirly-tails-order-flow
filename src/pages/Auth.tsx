import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
<<<<<<< HEAD
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Package } from 'lucide-react';
=======
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
>>>>>>> 69939d5 (New UI DESIGN)

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, createUser, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

<<<<<<< HEAD
  // Sign in form state
=======
>>>>>>> 69939d5 (New UI DESIGN)
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

<<<<<<< HEAD
  // Sign up form state
=======
>>>>>>> 69939d5 (New UI DESIGN)
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'staff' as 'admin' | 'staff' | 'supplier',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
<<<<<<< HEAD

    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
=======
    try {
      const { error } = await signIn(signInData.email, signInData.password);
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!", description: "You have been signed in successfully." });
        navigate('/dashboard');
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
>>>>>>> 69939d5 (New UI DESIGN)
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!profile || profile.role !== 'admin') {
      toast({
        title: "Access denied",
        description: "Only administrators can create new user accounts.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await createUser(
        signUpData.email,
        signUpData.password,
        signUpData.firstName,
        signUpData.lastName,
        signUpData.role
      );
<<<<<<< HEAD
      
      if (error) {
        toast({
          title: "Account creation failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created successfully",
          description: `New ${signUpData.role} account has been created for ${signUpData.firstName} ${signUpData.lastName}.`,
=======
      if (error) {
        toast({ title: "Account creation failed", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "Account created successfully",
          description: `New ${signUpData.role} account created for ${signUpData.firstName} ${signUpData.lastName}.`,
>>>>>>> 69939d5 (New UI DESIGN)
        });
        setSignUpData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          role: 'staff',
        });
      }
<<<<<<< HEAD
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
=======
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
>>>>>>> 69939d5 (New UI DESIGN)
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Twirly Tails</h1>
          </div>
          <p className="text-muted-foreground">Order Management System</p>
=======
    <div className="min-h-screen flex items-center justify-center bg-[#fff0f6] p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4 gap-3">
            <img src="/logo.png" alt="Logo" className="w-16 h-16" />
            <h1
              className="text-[3rem] font-bold text-[#a10346] leading-tight"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              Twirly Tails
            </h1>
          </div>
          <p className="text-lg text-[#c0225e]">Order Management System</p>
>>>>>>> 69939d5 (New UI DESIGN)
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup" disabled={!profile || profile.role !== 'admin'}>
              Create Account
            </TabsTrigger>
          </TabsList>

<<<<<<< HEAD
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access the system
                </CardDescription>
=======
          {/* Sign In Form */}
          <TabsContent value="signin">
            <Card className="bg-white/90 shadow-md">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials to access the system</CardDescription>
>>>>>>> 69939d5 (New UI DESIGN)
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
<<<<<<< HEAD
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
=======
                        className="absolute right-0 top-0 h-full px-3 py-2"
>>>>>>> 69939d5 (New UI DESIGN)
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
<<<<<<< HEAD
                  <Button type="submit" className="w-full" disabled={isLoading}>
=======
                  <Button
                    type="submit"
                    className="w-full bg-[#b7285f] hover:bg-[#a61e52] text-white"
                    disabled={isLoading}
                  >
>>>>>>> 69939d5 (New UI DESIGN)
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

<<<<<<< HEAD
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  {profile?.role === 'admin' 
                    ? 'Create a new user account for your team'
                    : 'Only administrators can create new accounts'
                  }
=======
          {/* Sign Up Form */}
          <TabsContent value="signup">
            <Card className="bg-white/90 shadow-md">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  {profile?.role === 'admin'
                    ? 'Create a new user account for your team'
                    : 'Only administrators can create new accounts'}
>>>>>>> 69939d5 (New UI DESIGN)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.role === 'admin' ? (
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          value={signUpData.firstName}
                          onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          value={signUpData.lastName}
                          onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={signUpData.role}
<<<<<<< HEAD
                        onValueChange={(value: 'admin' | 'staff' | 'supplier') => 
=======
                        onValueChange={(value: 'admin' | 'staff' | 'supplier') =>
>>>>>>> 69939d5 (New UI DESIGN)
                          setSignUpData({ ...signUpData, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="supplier">Supplier</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
<<<<<<< HEAD
                    <Button type="submit" className="w-full" disabled={isLoading}>
=======
                    <Button
                      type="submit"
                      className="w-full bg-[#b7285f] hover:bg-[#a61e52] text-white"
                      disabled={isLoading}
                    >
>>>>>>> 69939d5 (New UI DESIGN)
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Please sign in as an administrator to create new accounts.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Auth;
=======
export default Auth;
>>>>>>> 69939d5 (New UI DESIGN)
