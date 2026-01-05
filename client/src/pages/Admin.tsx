import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Users, 
  Edit, 
  Trash2, 
  Plus,
  Save,
  ArrowUp,
  ArrowDown
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

// Mock Data for "Database"
const initialEmployees = [
  { id: 1, name: "Atul Kadam", designation: "Founder & CEO", department: "Executive", role_level: "Founder", display_order: 1, status: "active" },
  { id: 2, name: "Hemant Nagrale", designation: "Co-Founder", department: "Executive", role_level: "Co-Founder", display_order: 2, status: "active" },
  { id: 3, name: "Nilima Shitole", designation: "Co-Founder & Head of Management", department: "Executive", role_level: "Co-Founder", display_order: 3, status: "active" },
  { id: 4, name: "Pratik Bingewar", designation: "Project Manager", department: "Management", role_level: "Management", display_order: 4, status: "active" },
  { id: 5, name: "Divya Sakatkar", designation: "Lead Tester", department: "Management", role_level: "Management", display_order: 5, status: "active" },
  { id: 6, name: "Rohit Sharma", designation: "Software Engineer (Backend)", department: "Engineering", role_level: "Engineer", display_order: 6, status: "active" },
  { id: 7, name: "Vrushali Narkhede", designation: "Software Engineer (Frontend)", department: "Engineering", role_level: "Engineer", display_order: 7, status: "active" },
  { id: 8, name: "Prithviraj Patil", designation: "Software Engineer", department: "Engineering", role_level: "Engineer", display_order: 8, status: "active" },
  { id: 9, name: "Shubham Khamitkar", designation: "Admin", department: "Administration", role_level: "Admin", display_order: 9, status: "active" },
];

const initialVision = "To become a globally trusted AI-first technology company building intelligent platforms that power enterprises, institutions, and digital economies.";
const initialMission = "To design and deliver robust, scalable, and AI-native software products with speed, clarity, and long-term value.";

// Form Schema
const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  designation: z.string().min(2, "Designation is required"),
  department: z.string().min(2, "Department is required"),
  role_level: z.string().min(1, "Role Level is required"),
});

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employees, setEmployees] = useState(initialEmployees);
  const [vision, setVision] = useState(initialVision);
  const [mission, setMission] = useState(initialMission);
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [editEmployee, setEditEmployee] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      designation: "",
      department: "",
      role_level: "Engineer",
    },
  });

  const handleSaveVisionMission = () => {
    setIsEditingVision(false);
    toast({
      title: "Content Updated",
      description: "Vision and Mission statements have been updated successfully.",
    });
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast({
      title: "Employee Deleted",
      description: "Employee has been removed from the directory.",
      variant: "destructive"
    });
  };

  const handleEditEmployee = (employee: any) => {
    setEditEmployee(employee);
    form.reset({
      name: employee.name,
      designation: employee.designation,
      department: employee.department,
      role_level: employee.role_level,
    });
    setIsDialogOpen(true);
  };

  const handleAddEmployee = () => {
    setEditEmployee(null);
    form.reset({
      name: "",
      designation: "",
      department: "",
      role_level: "Engineer",
    });
    setIsDialogOpen(true);
  };

  const onSubmitEmployee = (values: z.infer<typeof employeeSchema>) => {
    if (editEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === editEmployee.id ? { ...emp, ...values } : emp
      ));
      toast({ title: "Employee Updated", description: `${values.name}'s details saved.` });
    } else {
      const newEmployee = {
        id: employees.length + 1,
        ...values,
        display_order: employees.length + 1,
        status: "active"
      };
      setEmployees([...employees, newEmployee]);
      toast({ title: "Employee Added", description: `${values.name} has been added to the team.` });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex">
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
           >
             <Users className="w-4 h-4" />
             About Us & Team
           </button>
        </nav>

        <Link href="/">
          <Button 
            variant="ghost" 
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 justify-start w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Back to Site
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            {activeTab === "dashboard" ? "Dashboard Overview" : "About Us Management"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">admin@codelyne.tech</span>
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold">
              A
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
                   <div className="text-3xl font-bold text-white">{employees.length}</div>
                 </CardContent>
               </Card>
               {/* Other dashboard cards... */}
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
                  <Button variant="outline" size="sm" onClick={() => setIsEditingVision(true)} className="border-primary/50 text-primary hover:bg-primary/10">
                    <Edit className="w-4 h-4 mr-2" /> Edit Content
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingVision(false)} className="text-gray-400">Cancel</Button>
                    <Button size="sm" onClick={handleSaveVisionMission} className="bg-primary text-background font-bold">
                      <Save className="w-4 h-4 mr-2" /> Save Changes
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
                    />
                  ) : (
                    <p className="text-gray-300 p-3 bg-white/5 rounded-md border border-white/5">{vision}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Company Mission</label>
                  {isEditingVision ? (
                    <textarea 
                      className="w-full bg-background/50 border border-white/10 rounded-md p-3 text-white focus:border-primary/50 min-h-[80px]" 
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-300 p-3 bg-white/5 rounded-md border border-white/5">{mission}</p>
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
                    <Button onClick={handleAddEmployee} className="bg-primary text-background font-bold hover:bg-primary/90">
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
                                <Input {...field} className="bg-white/5 border-white/10 text-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="designation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Designation</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white/5 border-white/10 text-white" />
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
                                    <Input {...field} className="bg-white/5 border-white/10 text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="role_level"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Role Level</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Select level" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-[#0b0f19] border-white/10 text-white">
                                      <SelectItem value="Founder">Founder</SelectItem>
                                      <SelectItem value="Co-Founder">Co-Founder</SelectItem>
                                      <SelectItem value="Management">Management</SelectItem>
                                      <SelectItem value="Engineer">Engineer</SelectItem>
                                      <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                         </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-primary text-background font-bold">Save Details</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-white/10 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-gray-300 font-medium">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Designation</th>
                        <th className="p-4">Role Level</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {employees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-4 text-white font-medium">{employee.name}</td>
                          <td className="p-4 text-gray-400">{employee.designation}</td>
                          <td className="p-4">
                             <Badge variant="outline" className={`
                               ${employee.role_level.includes('Founder') ? 'border-primary/50 text-primary bg-primary/10' : ''}
                               ${employee.role_level === 'Management' ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' : ''}
                               ${employee.role_level === 'Engineer' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : ''}
                             `}>
                               {employee.role_level}
                             </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => handleEditEmployee(employee)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDeleteEmployee(employee.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
