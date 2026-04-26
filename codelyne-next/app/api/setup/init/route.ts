import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { hashPassword } from "@/lib/auth-utils";

export const runtime = "nodejs";

const teamData = [
  {
    name: "Atul Kadam",
    role: "Founder & CEO",
    department: "Executive",
    memberType: "founder",
    photoUrl: "/objects/uploads/1f2ea25f-1465-4d29-bc45-a312a9f3192b",
    description:
      "As the chief architect of AI-first platforms, Atul leads the long-term vision, innovation, and R&D at Codelyne. He specializes in designing scalable, secure, enterprise-grade architectures with deep expertise in AI, ML, full-stack development, and cloud systems.",
    quote:
      "Technology should not just automate tasks — it should think, learn, and evolve. At Codelyne, we engineer intelligence at the core.",
    focusAreas:
      "AI Architecture, Product Engineering, System Design, Innovation Strategy",
  },
  {
    name: "Hemant Nagrale",
    role: "Co-Founder & Strategic Advisor",
    department: "Executive",
    memberType: "founder",
    photoUrl: "/objects/uploads/d34a714b-abd8-4600-9a2a-d0d29343a692",
    description:
      "A distinguished 1987-batch IPS officer (Maharashtra cadre) and former Mumbai Police Commissioner, Hemant brings decades of leadership in governance and strategic decision-making. With degrees from VNIT Nagpur and JBIMS Mumbai, he guides Codelyne's long-term vision with disciplined execution and institutional expertise.",
    quote:
      "Discipline, governance, and strategic clarity are the pillars of building institutions that endure and excel.",
    focusAreas:
      "Strategic Leadership, Governance & Compliance, Institutional Building, Operational Excellence",
  },
  {
    name: "Nilima Shitole",
    role: "Co-Founder & Head of Management",
    department: "Executive",
    memberType: "founder",
    photoUrl: "/objects/uploads/159c2cd7-85d3-4752-99ad-4323231469c5",
    description:
      "Nilima leads organizational structure, HR strategy, and governance. She ensures operational excellence, compliance, and stability, building high-performance teams and scalable internal processes for long-term sustainability.",
    quote:
      "Strong systems require strong people, processes, and governance. Sustainable growth begins with disciplined execution.",
    focusAreas:
      "Organizational Management, Human Resources, Operations & Governance, Process Optimization",
  },
  {
    name: "Pratik Bingewar",
    role: "Project Manager",
    department: "Management",
    memberType: "management",
    photoUrl: "/objects/uploads/3e8e6336-8cb4-4550-8701-5f0c4e07faa5",
    description: "Leads project planning and delivery across engineering teams.",
    quote: "",
    focusAreas: "Project Management, Team Coordination",
  },
  {
    name: "Divya Sakatkar",
    role: "Lead Tester",
    department: "Management",
    memberType: "management",
    photoUrl: "/objects/uploads/2b080d75-32a8-4ff8-8c43-214f5992cd3c",
    description: "Ensures quality assurance and testing standards across all products.",
    quote: "",
    focusAreas: "Quality Assurance, Testing",
  },
  {
    name: "Rohit Sharma",
    role: "Software Engineer (Backend)",
    department: "Engineering",
    memberType: "engineer",
    photoUrl: "/objects/uploads/4db9a07e-379c-4fb9-acdd-cbbc305dddf9",
    description: "Specializes in backend development and API architecture.",
    quote: "",
    focusAreas: "Backend Development, API Design",
  },
  {
    name: "Vrushali Narkhede",
    role: "Software Engineer (Frontend)",
    department: "Engineering",
    memberType: "engineer",
    photoUrl: "/objects/uploads/74545f79-d161-4ee0-be72-e9bd41c01657",
    description: "Focuses on frontend development and user interface design.",
    quote: "",
    focusAreas: "Frontend Development, UI/UX",
  },
  {
    name: "Prithviraj Patil",
    role: "Software Engineer",
    department: "Engineering",
    memberType: "engineer",
    photoUrl: "/objects/uploads/67d40d45-1d73-49fa-98e6-3540a47cb4dc",
    description: "Full-stack software engineer contributing across the stack.",
    quote: "",
    focusAreas: "Full-Stack Development",
  },
  {
    name: "Shubham Khamitkar",
    role: "Admin",
    department: "Administration",
    memberType: "admin",
    photoUrl: "/objects/uploads/82f6f947-35be-4ec2-bb80-efaddf00fa06",
    description: "Handles administrative operations and office management.",
    quote: "",
    focusAreas: "Administration, Operations",
  },
];

export async function POST(req: NextRequest) {
  try {
    const expectedKey = process.env.SETUP_KEY;
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!expectedKey || expectedKey.length < 16) {
      return NextResponse.json(
        { message: "Setup is disabled. SETUP_KEY env var is not configured." },
        { status: 503 },
      );
    }
    if (!initialPassword || initialPassword.length < 12) {
      return NextResponse.json(
        {
          message:
            "Setup is disabled. ADMIN_INITIAL_PASSWORD env var is not configured.",
        },
        { status: 503 },
      );
    }

    const { setupKey } = await req.json();
    if (setupKey !== expectedKey) {
      return NextResponse.json(
        { message: "Invalid setup key" },
        { status: 403 },
      );
    }

    const existingUsers = await storage.getUserByUsername("codelyne_admin");
    if (existingUsers) {
      return NextResponse.json({
        message: "Already initialized",
        skipped: true,
      });
    }

    const hashedPassword = await hashPassword(initialPassword);
    await storage.createUser({
      username: "codelyne_admin",
      password: hashedPassword,
    });

    for (const member of teamData) {
      await storage.createEmployee(member);
    }

    return NextResponse.json({
      message: "Production database initialized successfully",
      created: teamData.length,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ message: "Setup failed" }, { status: 500 });
  }
}
