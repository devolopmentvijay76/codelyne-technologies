import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Target, Lightbulb, User, ArrowDown, Brain, Rocket, Users } from "lucide-react";
import atulImg from "@assets/generated_images/professional_portrait_of_atul_kadam,_founder_&_ceo.png";
import hemantImg from "@assets/generated_images/professional_portrait_of_hemant_nagrale,_co-founder.png";
import nilimaImg from "@assets/generated_images/professional_portrait_of_nilima_shitole,_co-founder.png";
import pratikImg from "@assets/generated_images/professional_portrait_of_pratik_bingewar,_project_manager.png";
import divyaImg from "@assets/generated_images/professional_portrait_of_divya_sakatkar,_lead_tester.png";
import rohitImg from "@assets/generated_images/professional_portrait_of_rohit_sharma,_backend_specialist.png";
import vrushaliImg from "@assets/generated_images/professional_portrait_of_vrushali_narkhede,_frontend_&_ui.png";
import prithvirajImg from "@assets/generated_images/professional_portrait_of_prithviraj_patil,_software_engineer.png";
import shubhamImg from "@assets/generated_images/professional_portrait_of_shubham_khamitkar,_admin.png";

const founders = [
  {
    name: "Atul Kadam",
    title: "Founder & CEO",
    image: atulImg,
    quote: "Technology should not just automate tasks — it should think, learn, and evolve. At Codelyne, we engineer intelligence at the core.",
    description: "As the chief architect of AI-first platforms, Atul leads the long-term vision, innovation, and R&D at Codelyne. He specializes in designing scalable, secure, enterprise-grade architectures with deep expertise in AI, ML, full-stack development, and cloud systems.",
    focusAreas: ["AI Architecture", "Product Engineering", "System Design", "Innovation Strategy"],
    icon: Brain
  },
  {
    name: "Hemant Nagrale",
    title: "Co-Founder",
    image: hemantImg,
    quote: "Great products emerge when business clarity meets strong engineering. Our focus is building platforms that scale with purpose.",
    description: "Hemant leads product strategy and market alignment, converting complex business problems into scalable digital platforms. He oversees partnerships, growth strategy, and client success, bridging engineering execution with tangible business outcomes.",
    focusAreas: ["Product Strategy", "Business Growth", "Market Expansion", "Client Alignment"],
    icon: Rocket
  },
  {
    name: "Nilima Shitole",
    title: "Co-Founder & Head of Management",
    image: nilimaImg,
    quote: "Strong systems require strong people, processes, and governance. Sustainable growth begins with disciplined execution.",
    description: "Nilima leads organizational structure, HR strategy, and governance. She ensures operational excellence, compliance, and stability, building high-performance teams and scalable internal processes for long-term sustainability.",
    focusAreas: ["Organizational Management", "Human Resources", "Operations & Governance", "Process Optimization"],
    icon: Users
  }
];

const team = [
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

      {/* Founders Section (Moved from Founders Page) */}
      <section className="py-20 relative border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
              The Founders Behind <span className="text-primary">Codelyne</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Engineering Intelligence Through Vision, Technology, and Leadership.
            </p>
          </div>

          <div className="space-y-32">
            {founders.map((founder, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
                {/* Image Side */}
                <div className="w-full lg:w-1/3 relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-card">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    <img src={founder.image} alt={founder.name} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                      <founder.icon className="w-8 h-8 text-primary mb-2" />
                      <h3 className="text-2xl font-bold text-white">{founder.name}</h3>
                      <p className="text-primary font-medium">{founder.title}</p>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-2/3 space-y-8">
                  <div className="relative">
                     <span className="text-6xl text-primary/10 font-serif absolute -top-8 -left-4">“</span>
                     <blockquote className="text-2xl md:text-3xl font-heading font-medium text-white leading-tight pl-6 border-l-4 border-primary/50 italic">
                       {founder.quote}
                     </blockquote>
                  </div>
                  
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {founder.description}
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">Focus Areas</h4>
                    <div className="flex flex-wrap gap-3">
                      {founder.focusAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="bg-white/5 hover:bg-primary/20 text-gray-300 hover:text-primary transition-colors border-white/5 px-4 py-2 text-sm">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employee Hierarchy */}
      <section className="py-24 relative bg-[#0b0f19]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Our Team Hierarchy</h2>
            <p className="text-gray-400">The dedicated professionals driving our success.</p>
          </div>

          <div className="space-y-16">
             {/* Management & Engineering Grid */}
             <div className="space-y-8">
               <h3 className="text-xl font-bold text-blue-400 uppercase tracking-widest text-center">Core Team</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {team.map((member, i) => (
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

      {/* Elaborative Vision & Mission */}
      <section className="py-24 bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Vision */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/50">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-white">Our Vision</h2>
              </div>
              
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  At Codelyne Technologies, our vision extends beyond mere software development. We aspire to become a <strong>globally trusted AI-first technology partner</strong> that redefines how enterprises, institutions, and digital economies operate in the cognitive era.
                </p>
                <p>
                  We envision a future where <strong>intelligent platforms</strong> act as the central nervous system of modern business—automating complex workflows, predicting market shifts, and enabling autonomous decision-making with unprecedented accuracy.
                </p>
                <p>
                  By bridging the gap between <strong>human creativity and artificial intelligence</strong>, we aim to build a world where technology doesn't just support operations but actively drives innovation, scalability, and sustainable growth for generations to come.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-white">Our Mission</h2>
              </div>
              
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  Our mission is to <strong>design, architect, and deliver robust, AI-native software products</strong> that stand the test of time. We are committed to engineering excellence, ensuring every line of code contributes to a scalable, secure, and high-performance ecosystem.
                </p>
                <p>
                  We strive to execute with <strong>speed and clarity</strong>, removing the friction from digital transformation. By prioritizing <strong>long-term value over short-term trends</strong>, we empower our clients to navigate technological disruptions with confidence.
                </p>
                <p>
                  Through a culture of <strong>continuous learning and ethical innovation</strong>, we dedicate ourselves to solving the most critical business challenges, turning abstract possibilities into tangible, high-impact realities for our partners worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
