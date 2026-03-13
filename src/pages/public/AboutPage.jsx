import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Button from "../../components/ui/Button";
import SectionTitle from "../../components/common/SectionTitle";
import ProblemCard from "../../components/common/problemCard";
import FeatureItem from "../../components/common/FeatureItem";
import TeamCard from "../../components/common/TeamCard";
import LinesVectorBg from "../../assets/svg/linesvectorbg.svg";

const stats = [
  { value: "94", suffix: "%", label: "Student satisfaction rate" },
  { value: "60", suffix: "%", label: "Fewer missed deadlines" },
  { value: "125", suffix: "+", label: "Active students" },
  { value: "100", suffix: "%", label: "Classes covered" },
];

const allFeatures = [
  {
    icon: "mdi:newspaper-variant-outline",
    title: "Personalized Feed",
    desc: "See only the announcements relevant to your program and level. No noise, no irrelevant posts.",
  },
  {
    icon: "mdi:bell-outline",
    title: "Real-Time Notifications",
    desc: "Get instant notifications for new announcements, approaching deadlines, and comment replies.",
  },
  {
    icon: "mdi:calendar-clock-outline",
    title: "Deadline Tracking",
    desc: "Visual countdown timers and color-coded urgency indicators ensure you never miss a deadline.",
  },
  {
    icon: "mdi:account-group-outline",
    title: "Role-Based Dashboards",
    desc: "Different interfaces for Students, Course Reps, and Lecturers with appropriate permissions and features.",
  },
  {
    icon: "mdi:comment-text-outline",
    title: "Structured Comments",
    desc: "Ask questions and get official answers directly under each post. Threaded replies keep everything organized.",
  },
  {
    icon: "mdi:file-upload-outline",
    title: "Document Uploads",
    desc: "Assignment briefs and notices shared as PDFs without retyping lengthy content. Inline preview included.",
  },
  {
    icon: "mdi:magnify",
    title: "Smart Search",
    desc: "Find any announcement instantly by keyword, category, or date. No more scrolling through hundreds of messages.",
  },
  {
    icon: "mdi:folder-multiple-outline",
    title: "Resource Hub",
    desc: "All your department links, Telegram channels, and Drive folders in one organized place.",
  },
];

const roadmapPhases = [
  {
    icon: "mdi:check-bold",
    iconBg: "bg-success-6",
    iconRing: "ring-success-2",
    label: "Phase 1 · Completed",
    labelColor: "text-success-6",
    title: "Foundation",
    items: [
      "User authentication",
      "Personalized feed",
      "Deadline tracking",
      "Comment system",
      "Document uploads",
      "Resource hub",
    ],
  },
  {
    icon: "mdi:play",
    iconBg: "bg-warning-6",
    iconRing: "ring-warning-2",
    label: "Phase 2 · In Progress",
    labelColor: "text-warning-6",
    title: "Enhancement",
    items: [
      "Email notifications",
      "Push alerts",
      "Advanced search",
      "Analytics dashboard",
      "Mobile optimization",
      "Read receipts",
    ],
  },
  {
    icon: "mdi:clock-outline",
    iconBg: "bg-neutral-gray-5",
    iconRing: "ring-neutral-gray-2",
    label: "Phase 3 · Planned",
    labelColor: "text-neutral-gray-6",
    title: "Expansion",
    items: [
      "Multi-department support",
      "Calendar integration",
      "Notification digest",
      "API access",
      "Mobile app",
      "University-wide rollout",
    ],
  },
];

const teamMembers = [
  {
    name: "Benyah King David Adom",
    roles: ["Project Manager", "UI/UX Designer"],
    image: "https://picsum.photos/seed/team1/288/384",
  },
  {
    name: "Fred Jeremy Kwofie",
    roles: ["UI/UX Designer"],
    image: "https://picsum.photos/seed/team2/288/384",
  },
  {
    name: "Nutakor Godsway Nani",
    roles: ["Frontend", "Quality Assurance"],
    image: "https://picsum.photos/seed/team3/288/384",
  },
  {
    name: "Charles Owusu-Nyannor",
    roles: ["Frontend Developer"],
    image: "https://picsum.photos/seed/team4/288/384",
  },
  {
    name: "Scheck Stephen Blessed",
    roles: ["Frontend Developer"],
    image: "https://picsum.photos/seed/team5/288/384",
  },
  {
    name: "Abu-Wireko Jason",
    roles: ["Frontend Developer"],
    image: "https://picsum.photos/seed/team6/288/384",
  },
  {
    name: "Wuni Abdulai",
    roles: ["Backend Developer"],
    image: "https://picsum.photos/seed/team7/288/384",
  },
  {
    name: "Mensah Boakye Godfred",
    roles: ["Backend Developer"],
    image: "https://picsum.photos/seed/team8/288/384",
  },
  {
    name: "Akaribo George",
    roles: ["Backend", "Quality Assurance"],
    image: "https://picsum.photos/seed/team9/288/384",
  },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute w-full opacity-70">
          <img
            src={LinesVectorBg}
            alt=""
            className="w-500 object-cover object-center"
          />
        </div>
        <div className="relative section-container section-padding flex flex-col items-center text-center gap-7">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight">
            <span className="text-secondary">About </span>
            <span className="text-primary">Us</span>
          </h1>
          <p className="max-w-xl text-neutral-gray-8 text-sm md:text-lg leading-5 md:leading-6">
            Built By Students, for Students. NoticeHub started as a frustration
            and became a solution. A group of CS and IT students tired of
            missing deadlines in WhatsApp groups decided to build the platform
            their department actually needed.
          </p>
        </div>
      </section>

      {/* ── OUR STORY + STATS ── */}
      <section className="bg-white">
        <div className="section-container section-padding border-b border-neutral-gray-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            <div className="flex flex-col gap-4 lg:max-w-[55%]">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary">
                Our Story
              </h2>
              <p className="text-neutral-gray-8 text-sm md:text-lg leading-6 md:leading-8">
                NoticeHub did not start in a boardroom or a lab. It started in a
                group chat — the same one where every important announcement got
                buried under voice notes, memes, and good morning messages
                before anyone could read it.
                <br />
                <br />
                We are CS and IT students who lived this problem every semester.
                Missed deadlines, lost assignment briefs, course reps sending
                the same message on three different platforms just hoping
                someone would see it. At some point we stopped complaining and
                started building.
                <br />
                <br />
                NoticeHub is the platform we wished existed when we were
                scrambling for information. A centralized, organized, and
                role-aware notice board built specifically for how our
                departments communicate — not how a generic tool assumes they
                do.
                <br />
                <br />
                This is not just a capstone project. It is a real solution to a
                real problem, built by the people who felt it most.
              </p>
            </div>
            <div className="w-full lg:flex-1 lg:border-l lg:border-neutral-gray-4 lg:pl-16">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-0">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col items-center gap-3.5 text-center ${
                      i > 0
                        ? "lg:pt-8 lg:mt-8 lg:border-t lg:border-neutral-gray-3"
                        : ""
                    }`}
                  >
                    <p className="text-5xl font-bold leading-[50px]">
                      <span className="text-primary">{stat.value}</span>
                      <span className="text-blue-2">{stat.suffix}</span>
                    </p>
                    <p className="text-primary text-lg md:text-xl">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="bg-gray-50">
        <div className="section-container section-padding flex flex-col items-center gap-16 md:gap-20">
          <SectionTitle
            tag="The Problem"
            heading="Academic Communication Was Broken"
            subtext="Before NoticeHub, this is what staying informed looked like for CS and IT students every single day."
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-7">
            <ProblemCard
              number="01"
              heading="Deadlines Slip Through the Cracks"
              subtext="Without a central place for academic notices, critical assignment deadlines and exam updates get buried under unrelated messages. Students scroll endlessly through WhatsApp threads only to miss what matters most, and by the time they find it, it's too late. The frustrating part is that the information was always there. It was posted, it existed, someone shared it."
              className="w-full max-w-none"
            />
            <ProblemCard
              number="02"
              heading="Lecturers Can't Reach Everyone"
              subtext="Posting the same announcement across multiple platforms — WhatsApp, Telegram, email, and Drive — is exhausting and unreliable. There's no guarantee every student sees it, and no way to know who did. Important information falls through the gaps every single time. A WhatsApp group was never built for academic communication."
              whiteCard
              className="w-full max-w-none"
            />
            <ProblemCard
              number="03"
              heading="Course Reps Are Overwhelmed"
              subtext="Managing communication for an entire class across fragmented channels is a full-time job. Course representatives spend more time chasing students and reposting notices than actually representing their peers. One platform should handle all of it. And now it does."
              className="w-full max-w-none"
            />
          </div>
        </div>
      </section>

      {/* ── OUR SOLUTION ── */}
      <section className="bg-linear-to-b from-[#0E0E6A] to-[#070732]">
        <div className="section-container section-padding flex flex-col items-center gap-16 md:gap-20">
          <SectionTitle
            tag="Our Solution"
            heading="Everything Your Department Needs, In One Place"
            subtext="NoticeHub replaces fragmented channels with a single organized platform built around how university departments actually communicate."
            onColor
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-2">
            {allFeatures.map((f, i) => (
              <div
                key={f.title}
                className={[
                  i < allFeatures.length - 1
                    ? "border-b border-stone-200/20"
                    : "",
                  i % 2 === 0 ? "md:border-r md:border-stone-200/20" : "",
                  i >= allFeatures.length - 2 ? "md:border-b-0" : "",
                ].join(" ")}
              >
                <FeatureItem icon={f.icon} title={f.title} desc={f.desc} />
              </div>
            ))}
          </div>
          <Button variant="outline" size="md" onClick={() => navigate("/")}>
            See All Features
            <Icon icon="tabler:arrow-right" width={24} height={24} />
          </Button>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section className="bg-neutral-50">
        <div className="section-container section-padding flex flex-col items-center gap-16 md:gap-20">
          <SectionTitle
            tag="Where We Are"
            heading="From Idea to Impact"
            subtext="NoticeHub has been built in focused phases, each one adding more value for students and departments."
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 lg:gap-10">
            {roadmapPhases.map((phase) => (
              <div
                key={phase.title}
                className="flex flex-col items-center gap-3.5 text-center"
              >
                <div
                  className={`w-20 h-20 rounded-full ${phase.iconBg} ring-[10px] ${phase.iconRing} flex items-center justify-center text-white`}
                >
                  <Icon icon={phase.icon} width={24} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <p
                    className={`text-sm font-medium uppercase tracking-wide ${phase.labelColor}`}
                  >
                    {phase.label}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-secondary">
                    {phase.title}
                  </h3>
                  <div className="flex flex-col items-start gap-1.5">
                    {phase.items.map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <span className="text-neutral-gray-7 text-sm">▸</span>
                        <span className="text-neutral-gray-8 text-base md:text-lg">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="bg-white">
        <div className="section-container section-padding flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-secondary">
              The People Behind NoticeHub
            </h2>
            <p className="text-neutral-gray-8 text-base md:text-lg max-w-2xl">
              Group 51 — CS students who turned a shared frustration into a
              working platform for their department.
            </p>
          </div>
          <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0 pb-2">
            <div className="flex gap-4 md:gap-6 min-w-max">
              {teamMembers.map((member) => (
                <TeamCard key={member.name} {...member} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
