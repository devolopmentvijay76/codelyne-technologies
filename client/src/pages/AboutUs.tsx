import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Target, Lightbulb, User, ArrowDown } from "lucide-react";
import atulImg from "@assets/generated_images/professional_portrait_of_atul_kadam,_founder_&_ceo.png";
import hemantImg from "@assets/generated_images/professional_portrait_of_hemant_nagrale,_co-founder.png";
import nilimaImg from "@assets/generated_images/professional_portrait_of_nilima_shitole,_co-founder.png";
import pratikImg from "@assets/generated_images/professional_portrait_of_pratik_bingewar,_project_manager.png";
import divyaImg from "@assets/generated_images/professional_portrait_of_divya_sakatkar,_lead_tester.png";
import rohitImg from "@assets/generated_images/professional_portrait_of_rohit_sharma,_backend_specialist.png";
import vrushaliImg from "@assets/generated_images/professional_portrait_of_vrushali_narkhede,_frontend_&_ui.png";
import prithvirajImg from "@assets/generated_images/professional_portrait_of_prithviraj_patil,_software_engineer.png";
import shubhamImg from "@assets/generated_images/professional_portrait_of_shubham_khamitkar,_admin.png";

const team = [
  // Founders (Reused from Founders page logic but simplified for list view if needed, or emphasized here)
  { name: "Atul Kadam", designation: "Founder & CEO", department: "Executive", image: atulImg, role: "Founder" },
  { name: "Hemant Nagrale", designation: "Co-Founder", department: "Executive", image: hemantImg, role: "Co-Founder" },
  { name: "Nilima Shitole", designation: "Co-Founder & Head of Management", department: "Executive", image: nilimaImg, role: "Co-Founder" },
  
  // Management
  { name: "Pratik Bingewar", designation: "Project Manager", department: "Management", image: pratikImg, role: "Management" },
  { name: "Divya Sakatkar", designation: "Lead Tester", department: "Management", image: divyaImg, role: "Management" },

  // Engineering
  { name: "Rohit Sharma", designation: "Software Engineer (Backend)", department: "Engineering", image: rohitImg, role: "Engineer" },
  { name: "Vrushali Narkhede", designation: "Software Engineer (Frontend)", department: "Engineering", image: vrushaliImg, role: "Engineer" },
  { name: "Prithviraj Patil", designation: "Software Engineer", department: "Engineering", image: prithvirajImg, role: "Engineer" },

  // Admin
  { name: "Shubham Khamitkar", designation: "Admin", department: "Administration", image: shubhamImg, role: "Admin" },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0b0f19]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">Who We Are</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            About <span className="text-primary text-glow">Codelyne Technologies</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            AI-Driven Engineering. Founder-Led Innovation. Scalable Execution.
          </p>
          <div className="mt-12 flex justify-center animate-bounce">
            <ArrowDown className="w-6 h-6 text-primary/50" />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-background/50 border-primary/20 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white">Our Vision</h2>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-300 leading-relaxed">
                  To become a globally trusted AI-first technology company building intelligent platforms that power enterprises, institutions, and digital economies.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/50 border-primary/20 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-300 leading-relaxed">
                  To design and deliver robust, scalable, and AI-native software products with speed, clarity, and long-term value.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Our Leadership & Team</h2>
            <p className="text-gray-400">The minds behind the innovation.</p>
          </div>

          <div className="space-y-16">
             {/* Group by Role for Clean Hierarchy */}
             
             {/* Founders */}
             <div className="space-y-8">
               <h3 className="text-xl font-bold text-primary uppercase tracking-widest text-center">Executive Leadership</h3>
               <div className="flex flex-wrap justify-center gap-8">
                 {team.filter(m => m.role.includes("Founder")).map((member, i) => (
                   <div key={i} className="group relative w-full sm:w-[300px]">
                     <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <div className="relative bg-card border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                       <div className="aspect-[4/5] overflow-hidden bg-gray-900">
                         <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       </div>
                       <div className="p-6 text-center bg-gradient-to-b from-card to-[#050a14]">
                         <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                         <p className="text-primary text-sm font-medium">{member.designation}</p>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Management & Engineering Grid */}
             <div className="space-y-8">
               <h3 className="text-xl font-bold text-blue-400 uppercase tracking-widest text-center">Management & Engineering</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {team.filter(m => !m.role.includes("Founder")).map((member, i) => (
                   <div key={i} className="group bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                     <div className="aspect-square overflow-hidden bg-gray-900/50">
                       <img src={member.image} alt={member.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <div className="p-4">
                       <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                       <p className="text-sm text-gray-400 mb-2">{member.designation}</p>
                       <Badge variant="secondary" className="bg-white/5 text-gray-500 text-xs">
                         {member.department}
                       </Badge>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
