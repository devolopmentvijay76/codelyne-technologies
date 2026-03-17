import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  LogOut, 
  Users, 
  Edit, 
  Trash2, 
  Plus,
  Save,
  Image as ImageIcon,
  Upload,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Package,
  Layers,
  MessageSquare,
  Calendar,
  Mail,
  Building2,
  Phone,
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
import { useUpload } from "@/hooks/use-upload";
import { useProducts } from "@/hooks/useProducts";
import { useContactSubmissions } from "@/hooks/useContactSubmissions";

const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().min(2, "Role/Designation is required"),
  department: z.string().min(1, "Department is required"),
  memberType: z.string().min(1, "Member type is required"),
  photoUrl: z.string().optional(),
  description: z.string().optional(),
  quote: z.string().optional(),
  focusAreas: z.string().optional(),
});

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  tagline: z.string().min(2, "Tagline is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.string().optional(),
  icon: z.string().optional(),
  videoUrl: z.string().optional(),
  status: z.string().default("active"),
  displayOrder: z.number().optional(),
});

export default function Admin() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading, logout, user } = useAuth();
  const { employees, isLoading: employeesLoading, createEmployee, updateEmployee, deleteEmployee, reorderEmployees, isReordering } = useEmployees();
  const { allContent, updateContent, createContent, isUpdating } = useContent();
  const { products, isLoading: productsLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { submissions, isLoading: submissionsLoading, deleteSubmission, isDeleting } = useContactSubmissions();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [editEmployee, setEditEmployee] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isFixingPhotos, setIsFixingPhotos] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      form.setValue("photoUrl", response.objectPath);
      setPhotoPreview(response.objectPath);
      toast({ title: "Photo Uploaded", description: "Profile photo has been uploaded successfully." });
    },
    onError: (error) => {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    },
  });

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
      department: "Engineering",
      memberType: "engineer",
      photoUrl: "",
      description: "",
      quote: "",
      focusAreas: "",
    },
  });

  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      features: "",
      icon: "Cpu",
      status: "active",
      displayOrder: 0,
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
        onSuccess: () => toast({ title: "Vision Updated" }),
      });
    } else {
      createContent({ key: "vision", value: vision }, {
        onSuccess: () => toast({ title: "Vision Created" }),
      });
    }

    if (missionContent) {
      updateContent({ key: "mission", value: mission }, {
        onSuccess: () => toast({ title: "Mission Updated" }),
      });
    } else {
      createContent({ key: "mission", value: mission }, {
        onSuccess: () => toast({ title: "Mission Created" }),
      });
    }

    setIsEditingVision(false);
  };

  const handleDeleteEmployee = (id: number) => {
    deleteEmployee(id, {
      onSuccess: () => {
        toast({ title: "Team Member Deleted", variant: "destructive" });
      },
      onError: (error: Error) => {
        toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
      }
    });
  };

  const handleEditEmployee = (employee: any) => {
    setEditEmployee(employee);
    setPhotoPreview(employee.photoUrl || "");
    form.reset({
      name: employee.name,
      role: employee.role,
      department: employee.department,
      memberType: employee.memberType || "employee",
      photoUrl: employee.photoUrl || "",
      description: employee.description || "",
      quote: employee.quote || "",
      focusAreas: employee.focusAreas || "",
    });
    setIsDialogOpen(true);
  };

  const handleAddEmployee = () => {
    setEditEmployee(null);
    setPhotoPreview("");
    form.reset({
      name: "",
      role: "",
      department: "Engineering",
      memberType: "engineer",
      photoUrl: "",
      description: "",
      quote: "",
      focusAreas: "",
    });
    setIsDialogOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({ title: "Invalid File", description: "Please select an image file.", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File Too Large", description: "Please select an image under 5MB.", variant: "destructive" });
        return;
      }
      await uploadFile(file);
    }
  };

  const handleMoveUp = (memberList: any[], index: number) => {
    if (index <= 0) return;
    const orders = memberList.map((m, i) => ({
      id: m.id,
      displayOrder: i === index ? index - 1 : i === index - 1 ? index : i,
    }));
    reorderEmployees(orders, {
      onSuccess: () => toast({ title: "Order Updated" }),
      onError: (error: Error) => toast({ title: "Reorder Failed", description: error.message, variant: "destructive" }),
    });
  };

  const handleMoveDown = (memberList: any[], index: number) => {
    if (index >= memberList.length - 1) return;
    const orders = memberList.map((m, i) => ({
      id: m.id,
      displayOrder: i === index ? index + 1 : i === index + 1 ? index : i,
    }));
    reorderEmployees(orders, {
      onSuccess: () => toast({ title: "Order Updated" }),
      onError: (error: Error) => toast({ title: "Reorder Failed", description: error.message, variant: "destructive" }),
    });
  };

  const onSubmitEmployee = (values: z.infer<typeof employeeSchema>) => {
    if (editEmployee) {
      updateEmployee({ id: editEmployee.id, data: values }, {
        onSuccess: () => {
          toast({ title: "Team Member Updated", description: `${values.name}'s details saved.` });
          setIsDialogOpen(false);
        },
        onError: (error: Error) => {
          toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        }
      });
    } else {
      createEmployee(values, {
        onSuccess: () => {
          toast({ title: "Team Member Added", description: `${values.name} has been added.` });
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
      onSuccess: () => setLocation("/login")
    });
  };

  const handleAddProduct = () => {
    setEditProduct(null);
    productForm.reset({
      name: "",
      tagline: "",
      description: "",
      features: "",
      icon: "Cpu",
      videoUrl: "",
      status: "active",
      displayOrder: 0,
    });
    setIsProductDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditProduct(product);
    productForm.reset({
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      features: product.features || "",
      icon: product.icon || "Cpu",
      videoUrl: product.videoUrl || "",
      status: product.status,
      displayOrder: product.displayOrder || 0,
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id, {
      onSuccess: () => toast({ title: "Product Deleted", variant: "destructive" }),
      onError: (error: Error) => toast({ title: "Delete Failed", description: error.message, variant: "destructive" }),
    });
  };

  const onSubmitProduct = (values: z.infer<typeof productSchema>) => {
    if (editProduct) {
      updateProduct({ id: editProduct.id, data: values }, {
        onSuccess: () => {
          toast({ title: "Product Updated", description: `${values.name} has been updated.` });
          setIsProductDialogOpen(false);
        },
        onError: (error: Error) => toast({ title: "Update Failed", description: error.message, variant: "destructive" }),
      });
    } else {
      createProduct(values, {
        onSuccess: () => {
          toast({ title: "Product Added", description: `${values.name} has been added.` });
          setIsProductDialogOpen(false);
        },
        onError: (error: Error) => toast({ title: "Creation Failed", description: error.message, variant: "destructive" }),
      });
    }
  };

  const handleFixPhotos = async () => {
    setIsFixingPhotos(true);
    try {
      const response = await fetch("/api/admin/fix-photos", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        toast({ title: "Photos Fixed", description: `Fixed visibility for ${data.results?.filter((r: any) => r.status === "fixed").length || 0} photos.` });
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to fix photos", variant: "destructive" });
    } finally {
      setIsFixingPhotos(false);
    }
  };

  const founders = employees.filter(e => e.memberType === "founder");
  const teamMembers = employees.filter(e => e.memberType !== "founder");

  const getMemberTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      founder: "border-primary/50 text-primary bg-primary/10",
      management: "border-purple-500/50 text-purple-400 bg-purple-500/10",
      engineer: "border-blue-500/50 text-blue-400 bg-blue-500/10",
      admin: "border-green-500/50 text-green-400 bg-green-500/10",
    };
    return styles[type] || "border-gray-500/50 text-gray-400 bg-gray-500/10";
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
             onClick={() => setActiveTab("team")}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
               activeTab === "team" 
                 ? "bg-primary/10 text-primary border border-primary/20" 
                 : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}
             data-testid="button-tab-team"
           >
             <Users className="w-4 h-4" />
             Team Management
           </button>
           <button 
             onClick={() => setActiveTab("products")}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
               activeTab === "products" 
                 ? "bg-primary/10 text-primary border border-primary/20" 
                 : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}
             data-testid="button-tab-products"
           >
             <Package className="w-4 h-4" />
             Products
           </button>
           <button 
             onClick={() => setActiveTab("enquiries")}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
               activeTab === "enquiries" 
                 ? "bg-primary/10 text-primary border border-primary/20" 
                 : "text-gray-400 hover:text-white hover:bg-white/5"
             }`}
             data-testid="button-tab-enquiries"
           >
             <MessageSquare className="w-4 h-4" />
             Enquiries
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
            {activeTab === "dashboard" ? "Dashboard Overview" : activeTab === "team" ? "Team Management" : activeTab === "products" ? "Products" : "Enquiries & Demo Requests"}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <Card className="bg-white/5 border-white/10">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-gray-400">Total Team</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold text-white" data-testid="text-employee-count">
                     {employeesLoading ? "..." : employees.length}
                   </div>
                 </CardContent>
               </Card>
               <Card className="bg-white/5 border-white/10">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-gray-400">Founders</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold text-primary" data-testid="text-founders-count">
                     {employeesLoading ? "..." : founders.length}
                   </div>
                 </CardContent>
               </Card>
               <Card className="bg-white/5 border-white/10">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-gray-400">Engineers</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold text-blue-400">
                     {employeesLoading ? "..." : employees.filter(e => e.memberType === "engineer").length}
                   </div>
                 </CardContent>
               </Card>
               <Card className="bg-white/5 border-white/10">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-medium text-gray-400">Management</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="text-3xl font-bold text-purple-400">
                     {employeesLoading ? "..." : employees.filter(e => e.memberType === "management").length}
                   </div>
                 </CardContent>
               </Card>
            </div>

            {/* Photo Visibility Fix */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="text-white">Photo Visibility</CardTitle>
                   <CardDescription className="text-gray-400">Fix photo visibility for published site. Run this after uploading new photos.</CardDescription>
                </div>
                <Button 
                  onClick={handleFixPhotos}
                  disabled={isFixingPhotos}
                  className="bg-primary text-background font-bold"
                  data-testid="button-fix-photos"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {isFixingPhotos ? "Fixing..." : "Fix All Photos"}
                </Button>
              </CardHeader>
            </Card>

            {/* Vision & Mission Editor */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="text-white">Vision & Mission</CardTitle>
                   <CardDescription className="text-gray-400">Manage company core values.</CardDescription>
                </div>
                {!isEditingVision ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditingVision(true)} 
                    className="border-primary/50 text-primary hover:bg-primary/10"
                    data-testid="button-edit-content"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingVision(false)} className="text-gray-400">Cancel</Button>
                    <Button size="sm" onClick={handleSaveVisionMission} className="bg-primary text-background font-bold" disabled={isUpdating}>
                      <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Company Vision</label>
                  {isEditingVision ? (
                    <textarea className="w-full bg-background/50 border border-white/10 rounded-md p-3 text-white focus:border-primary/50 min-h-[80px]" value={vision} onChange={(e) => setVision(e.target.value)} />
                  ) : (
                    <p className="text-gray-300 p-3 bg-white/5 rounded-md border border-white/5">{vision || "No vision set"}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Company Mission</label>
                  {isEditingVision ? (
                    <textarea className="w-full bg-background/50 border border-white/10 rounded-md p-3 text-white focus:border-primary/50 min-h-[80px]" value={mission} onChange={(e) => setMission(e.target.value)} />
                  ) : (
                    <p className="text-gray-300 p-3 bg-white/5 rounded-md border border-white/5">{mission || "No mission set"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-8">
            {/* Add Employee Button */}
            <div className="flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddEmployee} className="bg-primary text-background font-bold hover:bg-primary/90" data-testid="button-add-employee">
                    <Plus className="w-4 h-4 mr-2" /> Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0b0f19] border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editEmployee ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editEmployee ? "Update details for this team member." : "Add a new member to the organization."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitEmployee)} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input {...field} className="bg-white/5 border-white/10 text-white" data-testid="input-employee-name" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="role" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Designation</FormLabel>
                            <FormControl><Input {...field} placeholder="e.g., Software Engineer" className="bg-white/5 border-white/10 text-white" data-testid="input-employee-role" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="department" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#0b0f19] border-white/10 text-white">
                                <SelectItem value="Executive">Executive</SelectItem>
                                <SelectItem value="Management">Management</SelectItem>
                                <SelectItem value="Engineering">Engineering</SelectItem>
                                <SelectItem value="Administration">Administration</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="memberType" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Member Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#0b0f19] border-white/10 text-white">
                                <SelectItem value="founder">Founder</SelectItem>
                                <SelectItem value="management">Management</SelectItem>
                                <SelectItem value="engineer">Engineer</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="photoUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Photo</FormLabel>
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              {(photoPreview || field.value) ? (
                                <img src={photoPreview || field.value} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-white/10" />
                              ) : (
                                <div className="w-20 h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-gray-500" />
                                </div>
                              )}
                              <div className="flex-1 space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors w-fit">
                                  <Upload className="w-4 h-4" />
                                  <span className="text-sm font-medium">{isUploading ? "Uploading..." : "Upload Photo"}</span>
                                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={isUploading} data-testid="input-upload-photo" />
                                </label>
                                <p className="text-xs text-gray-500">Max 5MB. JPG, PNG, WebP supported.</p>
                              </div>
                            </div>
                            <FormControl>
                              <Input {...field} placeholder="Or enter URL manually" className="bg-white/5 border-white/10 text-white text-sm" data-testid="input-employee-photo" />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description / Bio</FormLabel>
                          <FormControl><Textarea {...field} placeholder="Brief description about the team member..." className="bg-white/5 border-white/10 text-white min-h-[80px]" data-testid="input-employee-description" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="quote" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quote (Optional - for Founders)</FormLabel>
                          <FormControl><Input {...field} placeholder="Inspirational quote..." className="bg-white/5 border-white/10 text-white" data-testid="input-employee-quote" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="focusAreas" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Focus Areas (comma-separated)</FormLabel>
                          <FormControl><Input {...field} placeholder="AI Architecture, Product Engineering, ..." className="bg-white/5 border-white/10 text-white" data-testid="input-employee-focus" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <DialogFooter>
                        <Button type="submit" className="bg-primary text-background font-bold" data-testid="button-submit-employee">Save Details</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Founders Section */}
            {founders.length > 0 && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-primary">Founders</span>
                    <Badge className="bg-primary/20 text-primary">{founders.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {founders.map((member, index) => (
                      <div key={member.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-all group" data-testid={`card-founder-${member.id}`}>
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-gray-500 hover:text-primary disabled:opacity-30" 
                              onClick={() => handleMoveUp(founders, index)}
                              disabled={index === 0 || isReordering}
                              data-testid={`button-move-up-founder-${member.id}`}
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <span className="text-xs text-gray-500 text-center">{index + 1}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-gray-500 hover:text-primary disabled:opacity-30" 
                              onClick={() => handleMoveDown(founders, index)}
                              disabled={index === founders.length - 1 || isReordering}
                              data-testid={`button-move-down-founder-${member.id}`}
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                          </div>
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="w-16 h-16 rounded-lg object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-primary/50" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white truncate">{member.name}</h4>
                            <p className="text-sm text-gray-400">{member.role}</p>
                            <Badge variant="outline" className={`mt-2 text-xs ${getMemberTypeBadge(member.memberType)}`}>{member.memberType}</Badge>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => handleEditEmployee(member)} data-testid={`button-edit-${member.id}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDeleteEmployee(member.id)} data-testid={`button-delete-${member.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {member.description && <p className="text-sm text-gray-400 mt-3 line-clamp-2">{member.description}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Members Section */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  Team Members
                  <Badge className="bg-blue-500/20 text-blue-400">{teamMembers.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {employeesLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading team...</div>
                ) : teamMembers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No team members found. Add your first team member!</div>
                ) : (
                  <div className="rounded-md border border-white/10 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white/5 text-gray-300 font-medium">
                        <tr>
                          <th className="p-4 w-20">Order</th>
                          <th className="p-4">Photo</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">Designation</th>
                          <th className="p-4">Type</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {teamMembers.map((member, index) => (
                          <tr key={member.id} className="hover:bg-white/5 transition-colors group" data-testid={`row-employee-${member.id}`}>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-gray-500 hover:text-primary disabled:opacity-30" 
                                  onClick={() => handleMoveUp(teamMembers, index)}
                                  disabled={index === 0 || isReordering}
                                  data-testid={`button-move-up-${member.id}`}
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </Button>
                                <span className="text-xs text-gray-500 min-w-[16px] text-center">{index + 1}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-gray-500 hover:text-primary disabled:opacity-30" 
                                  onClick={() => handleMoveDown(teamMembers, index)}
                                  disabled={index === teamMembers.length - 1 || isReordering}
                                  data-testid={`button-move-down-${member.id}`}
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="p-4">
                              {member.photoUrl ? (
                                <img src={member.photoUrl} alt={member.name} className="w-10 h-10 rounded-lg object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                  <ImageIcon className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-white font-medium">{member.name}</td>
                            <td className="p-4 text-gray-400">{member.role}</td>
                            <td className="p-4">
                               <Badge variant="outline" className={getMemberTypeBadge(member.memberType)}>{member.memberType}</Badge>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => handleEditEmployee(member)} data-testid={`button-edit-employee-${member.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDeleteEmployee(member.id)} data-testid={`button-delete-employee-${member.id}`}>
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

        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddProduct} className="bg-primary text-background font-bold hover:bg-primary/90" data-testid="button-add-product">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0b0f19] border-white/10 text-white max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-heading">{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editProduct ? "Update product details below." : "Fill in the product details."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4">
                      <FormField
                        control={productForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="CogniFlow ERP" className="bg-white/5 border-white/10 text-white" data-testid="input-product-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="tagline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tagline</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="AI-powered enterprise resource planning" className="bg-white/5 border-white/10 text-white" data-testid="input-product-tagline" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Full description of the product..." className="bg-white/5 border-white/10 text-white min-h-[100px]" data-testid="input-product-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Features (comma-separated)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Real-time analytics, AI predictions, Automated workflows" className="bg-white/5 border-white/10 text-white" data-testid="input-product-features" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video / Share Link</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://youtube.com/watch?v=... or any video link" className="bg-white/5 border-white/10 text-white" data-testid="input-product-video-url" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="icon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Icon Name</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select icon" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-[#0b0f19] border-white/10">
                                  <SelectItem value="Cpu">Cpu</SelectItem>
                                  <SelectItem value="Bot">Bot</SelectItem>
                                  <SelectItem value="Brain">Brain</SelectItem>
                                  <SelectItem value="Shield">Shield</SelectItem>
                                  <SelectItem value="Zap">Zap</SelectItem>
                                  <SelectItem value="Database">Database</SelectItem>
                                  <SelectItem value="Network">Network</SelectItem>
                                  <SelectItem value="Layers">Layers</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={productForm.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-[#0b0f19] border-white/10">
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="coming_soon">Coming Soon</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-primary text-background font-bold" data-testid="button-submit-product">
                          {editProduct ? "Update Product" : "Add Product"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Products
                  <Badge className="bg-primary/20 text-primary">{products.length}</Badge>
                </CardTitle>
                <CardDescription className="text-gray-400">Manage your product offerings</CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading products...</div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No products found. Add your first product!</div>
                ) : (
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between group hover:border-primary/30 transition-colors" data-testid={`card-product-${product.id}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-400">{product.tagline}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={product.status === "active" ? "border-green-500/50 text-green-400" : product.status === "coming_soon" ? "border-yellow-500/50 text-yellow-400" : "border-gray-500/50 text-gray-400"}>
                            {product.status.replace("_", " ")}
                          </Badge>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => handleEditProduct(product)} data-testid={`button-edit-product-${product.id}`}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDeleteProduct(product.id)} data-testid={`button-delete-product-${product.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "enquiries" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {submissionsLoading ? "..." : submissions.filter(s => s.type === "enquiry").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Demo Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {submissionsLoading ? "..." : submissions.filter(s => s.type === "demo").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  24-Hour Demo Requests
                  <Badge className="bg-primary/20 text-primary">{submissions.filter(s => s.type === "demo").length}</Badge>
                </CardTitle>
                <CardDescription className="text-gray-400">People who requested a 24-hour demo</CardDescription>
              </CardHeader>
              <CardContent>
                {submissionsLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading demo requests...</div>
                ) : submissions.filter(s => s.type === "demo").length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No demo requests yet.</div>
                ) : (
                  <div className="rounded-md border border-white/10 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white/5 text-gray-300 font-medium">
                        <tr>
                          <th className="p-4">Name</th>
                          <th className="p-4">Company</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Message</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {submissions.filter(s => s.type === "demo").map((submission) => (
                          <tr key={submission.id} className="hover:bg-white/5 transition-colors group" data-testid={`row-demo-${submission.id}`}>
                            <td className="p-4 text-white font-medium">{submission.name}</td>
                            <td className="p-4 text-gray-400">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-primary" />
                                {submission.company || "-"}
                              </div>
                            </td>
                            <td className="p-4">
                              <a href={`mailto:${submission.email}`} className="text-primary hover:underline flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {submission.email}
                              </a>
                            </td>
                            <td className="p-4">
                              {submission.phone ? (
                                <a href={`tel:${submission.phone}`} className="text-green-400 hover:underline flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {submission.phone}
                                </a>
                              ) : "-"}
                            </td>
                            <td className="p-4 text-gray-400 max-w-[200px] truncate">{submission.message || "-"}</td>
                            <td className="p-4 text-gray-500 text-xs">{new Date(submission.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  deleteSubmission(submission.id, {
                                    onSuccess: () => toast({ title: "Deleted", variant: "destructive" }),
                                  });
                                }}
                                disabled={isDeleting}
                                data-testid={`button-delete-demo-${submission.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  General Enquiries
                  <Badge className="bg-purple-500/20 text-purple-400">{submissions.filter(s => s.type === "enquiry").length}</Badge>
                </CardTitle>
                <CardDescription className="text-gray-400">Contact form submissions from the website</CardDescription>
              </CardHeader>
              <CardContent>
                {submissionsLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading enquiries...</div>
                ) : submissions.filter(s => s.type === "enquiry").length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No enquiries yet.</div>
                ) : (
                  <div className="rounded-md border border-white/10 overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white/5 text-gray-300 font-medium">
                        <tr>
                          <th className="p-4">Name</th>
                          <th className="p-4">Company</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Message</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {submissions.filter(s => s.type === "enquiry").map((submission) => (
                          <tr key={submission.id} className="hover:bg-white/5 transition-colors group" data-testid={`row-enquiry-${submission.id}`}>
                            <td className="p-4 text-white font-medium">{submission.name}</td>
                            <td className="p-4 text-gray-400">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-purple-400" />
                                {submission.company || "-"}
                              </div>
                            </td>
                            <td className="p-4">
                              <a href={`mailto:${submission.email}`} className="text-primary hover:underline flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {submission.email}
                              </a>
                            </td>
                            <td className="p-4">
                              {submission.phone ? (
                                <a href={`tel:${submission.phone}`} className="text-green-400 hover:underline flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {submission.phone}
                                </a>
                              ) : "-"}
                            </td>
                            <td className="p-4 text-gray-400 max-w-[200px] truncate">{submission.message}</td>
                            <td className="p-4 text-gray-500 text-xs">{new Date(submission.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  deleteSubmission(submission.id, {
                                    onSuccess: () => toast({ title: "Deleted", variant: "destructive" }),
                                  });
                                }}
                                disabled={isDeleting}
                                data-testid={`button-delete-enquiry-${submission.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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
