import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  LogOut, 
  Users, 
  Edit, 
  Trash2, 
  Plus,
  Save,
} from "lucide-react";
import { JarvisLogo } from "@/components/ui/JarvisLogo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEmployees } from "@/hooks/useEmployees";
import { useContent } from "@/hooks/useContent";

// Form Schema
const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().min(2, "Role is required"),
  department: z.string().min(2, "Department is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  joinDate: z.string().min(1, "Join date is required"),
});

export default function Admin() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading, logout, user } = useAuth();
  const { employees, isLoading: employeesLoading, createEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { allContent, updateContent, createContent, isUpdating } = useContent();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [editEmployee, setEditEmployee] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  useEffect(() => {
    const visionContent = allContent.find(c => c.key === "vision");
    const missionContent = allContent.find(c => c.key === "mission");
    
    if (visionContent) setVision(visionContent.value);
    if (missionContent) setMission(missionContent.value);
  }, [allContent]);

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      role: "",
      department: "",
      email: "",
      phone: "",
      joinDate: new Date().toISOString().split('T')[0],
    },
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
        <div className="text-center">
          <JarvisLogo size="md" heartbeat />
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSaveVisionMission = () => {
    const visionContent = allContent.find(c => c.key === "vision");
    const missionContent = allContent.find(c => c.key === "mission");

    if (visionContent) {
      updateContent({ key: "vision", value: vision }, {
        onSuccess: () => {
          toast({ title: "Vision Updated", description: "Vision statement has been saved." });
        },
      });
    } else {
      createContent({ key: "vision", value: vision }, {
        onSuccess: () => {
          toast({ title: "Vision Created", description: "Vision statement has been created." });
        },
      });
    }

    if (missionContent) {
      updateContent({ key: "mission", value: mission }, {
        onSuccess: () => {
          toast({ title: "Mission Updated", description: "Mission statement has been saved." });
        },
      });
    } else {
      createContent({ key: "mission", value: mission }, {
        onSuccess: () => {
          toast({ title: "Mission Created", description: "Mission statement has been created." });
        },
      });
    }

    setIsEditingVision(false);
  };

  const handleDeleteEmployee = (id: number) => {
    deleteEmployee(id, {
      onSuccess: () => {
        toast({
          title: "Employee Deleted",
          description: "Employee has been removed from the directory.",
          variant: "destructive"
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Delete Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleEditEmployee = (employee: any) => {
    setEditEmployee(employee);
    form.reset({
      name: employee.name,
      role: employee.role,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      joinDate: employee.joinDate,
    });
    setIsDialogOpen(true);
  };

  const handleAddEmployee = () => {
    setEditEmployee(null);
    form.reset({
      name: "",
      role: "",
      department: "",
      email: "",
      phone: "",
      joinDate: new Date().toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const onSubmitEmployee = (values: z.infer<typeof employeeSchema>) => {
    if (editEmployee) {
      updateEmployee({ id: editEmployee.id, data: values }, {
        onSuccess: () => {
          toast({ title: "Employee Updated", description: `${values.name}'s details saved.` });
          setIsDialogOpen(false);
        },
        onError: (error: Error) => {
          toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        }
      });
    } else {
      createEmployee(values, {
        onSuccess: () => {
          toast({ title: "Employee Added", description: `${values.name} has been added to the team.` });
          setIsDialogOpen(false);
        },
        onError: (error: Error) => {
          toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
        }
      });
    }
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setLocation("/login");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex" data-testid="page-admin">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-white/5 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <JarvisLogo size="sm" heartbeat />
          <span className="font-heading font-bold text-white text-lg">Admin Panel</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "dashboard" 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            data-testid="button-tab-dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button 
             onClick={() => setActiveTab("about-us")}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
               activeTab === "about-us" 
                 ? "bg-primary/10 text-primary border border-primary/20" 
                 : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}
             data-testid="button-tab-about"
           >
             <Users className="w-4 h-4" />
             About Us & Team
           </button>
        </nav>

        <Button 
          variant="ghost" 
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-start w-full"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white" data-testid="text-page-title">
            {activeTab === "dashboard" ? "Dashboard Overview" : "About Us Management"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400" data-testid="text-user-email">{user?.username}</span>
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="bg-white/5 border-white/10">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-gray-400">Total Employees</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold text-white" data-testid="text-employee-count">
                     {employeesLoading ? "..." : employees.length}
                   </div>
                 </CardContent>
               </Card>
               <Card className="bg-white/5 border-white/10">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-gray-400">Departments</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold text-white" data-testid="text-department-count">
                     {employeesLoading ? "..." : new Set(employees.map(e => e.department)).size}
                   </div>
                 </CardContent>
               </Card>
               <Card className="bg-white/5 border-white/10">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-gray-400">Content Items</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold text-white" data-testid="text-content-count">
                     {allContent.length}
                   </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        )}

        {activeTab === "about-us" && (
          <div className="space-y-8">
            {/* Vision & Mission Editor */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="text-white">Vision & Mission</CardTitle>
                   <CardDescription className="text-gray-400">Manage company core values displayed on the About Us page.</CardDescription>
                </div>
                {!isEditingVision ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditingVision(true)} 
                    className="border-primary/50 text-primary hover:bg-primary/10"
                    data-testid="button-edit-content"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit Content
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditingVision(false)} 
                      className="text-gray-400"
                      data-testid="button-cancel-content"
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveVisionMission} 
                      className="bg-primary text-background font-bold"
                      disabled={isUpdating}
                      data-testid="button-save-content"
                    >
                      <Save className="w-4 h-4 mr-2" /> {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Company Vision</label>
                  {isEditingVision ? (
                    <textarea 
                      className="w-full bg-background/50 border border-white/10 rounded-md p-3 text-white focus:border-primary/50 min-h-[80px]" 
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      data-testid="textarea-vision"
                    />
                  ) : (
                    <p className="text-gray-300 p-3 bg-white/5 rounded-md border border-white/5" data-testid="text-vision">{vision || "No vision set"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Company Mission</label>
                  {isEditingVision ? (
                    <textarea 
                      className="w-full bg-background/50 border border-white/10 rounded-md p-3 text-white focus:border-primary/50 min-h-[80px]" 
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      data-testid="textarea-mission"
                    />
                  ) : (
                    <p className="text-gray-300 p-3 bg-white/5 rounded-md border border-white/5" data-testid="text-mission">{mission || "No mission set"}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Employee Management */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Employee Directory</CardTitle>
                  <CardDescription className="text-gray-400">Manage team members, roles, and hierarchy.</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={handleAddEmployee} 
                      className="bg-primary text-background font-bold hover:bg-primary/90"
                      data-testid="button-add-employee"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0b0f19] border-white/10 text-white sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        {editEmployee ? "Update details for this team member." : "Add a new member to the organization."}
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitEmployee)} className="space-y-4 py-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white/5 border-white/10 text-white" data-testid="input-employee-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white/5 border-white/10 text-white" data-testid="input-employee-role" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="department"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Department</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="bg-white/5 border-white/10 text-white" data-testid="input-employee-department" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="joinDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Join Date</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      type="date" 
                                      className="bg-white/5 border-white/10 text-white" 
                                      data-testid="input-employee-joindate"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                         </div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" className="bg-white/5 border-white/10 text-white" data-testid="input-employee-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white/5 border-white/10 text-white" data-testid="input-employee-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit" className="bg-primary text-background font-bold" data-testid="button-submit-employee">
                            Save Details
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {employeesLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading employees...</div>
                ) : employees.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No employees found. Add your first team member!</div>
                ) : (
                  <div className="rounded-md border border-white/10 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white/5 text-gray-300 font-medium">
                        <tr>
                          <th className="p-4">Name</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Department</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {employees.map((employee) => (
                          <tr key={employee.id} className="hover:bg-white/5 transition-colors group" data-testid={`row-employee-${employee.id}`}>
                            <td className="p-4 text-white font-medium" data-testid={`text-employee-name-${employee.id}`}>{employee.name}</td>
                            <td className="p-4 text-gray-400" data-testid={`text-employee-role-${employee.id}`}>{employee.role}</td>
                            <td className="p-4">
                               <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10" data-testid={`badge-employee-department-${employee.id}`}>
                                 {employee.department}
                               </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-gray-400 hover:text-white" 
                                  onClick={() => handleEditEmployee(employee)}
                                  data-testid={`button-edit-employee-${employee.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" 
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                  data-testid={`button-delete-employee-${employee.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
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
          </div>
        )}
      </div>
    </div>
  );
}
