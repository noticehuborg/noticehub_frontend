import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Button from "../../components/ui/Button";
import SectionTitle from "../../components/common/SectionTitle";
import ProblemCard from "../../components/common/problemCard";
import FeatureItem from "../../components/common/FeatureItem";
import TeamCard from "../../components/common/TeamCard";
import FaqItem from "../../components/common/FaqItem";
import LinesVectorBg from "../../assets/svg/linesvectorbg.svg";
import CtaSection from "../../assets/img/ctasection.jpg";

const stats = [
  { value: "94", suffix: "%", label: "Student satisfaction rate" },
  { value: "60", suffix: "%", label: "Fewer missed deadlines" },
  { value: "125", suffix: "+", label: "Active students" },
  { value: "100", suffix: "%", label: "Classes covered" },
];

const allFeatures = [
  {
    icon: "qlementine-icons:newspaper-16",
    iconClass: "w-[85%] h-[85%]",
    title: "Personalized Feed",
    desc: "See only the announcements relevant to your program and level. No noise, no irrelevant posts.",
  },
  {
    icon: "fluent:calendar-48-regular",
    title: "Deadline Tracking",
    desc: "Visual countdown timers and color-coded urgency indicators ensure you never miss a deadline.",
  },
  {
    icon: "iconoir:bell",
    title: "Real-Time Notifications",
    desc: "Get instant notifications for new announcements, approaching deadlines, and comment replies.",
  },
  {
    icon: "octicon:people-24",
    title: "Role-Based Dashboards",
    desc: "Different interfaces for Students, Course Reps, and Lecturers with appropriate permissions and features.",
  },
  {
    icon: "hugeicons:comment-03",
    title: "Structured Comments",
    desc: "Ask questions and get official answers directly under each post. Threaded replies keep everything organized.",
  },
  {
    icon: "basil:file-upload-outline",
    title: "Document Uploads",
    desc: "Assignment briefs and notices shared as PDFs without retyping lengthy content. Inline preview included.",
  },
  {
    icon: "fluent:slide-search-16-regular",
    title: "Smart Search",
    desc: "Find any announcement instantly by keyword, category, or date. No more scrolling through hundreds of messages.",
  },
  {
    icon: "grommet-icons:resources",
    title: "Resource Hub",
    desc: "All your department links, Telegram channels, and Drive folders in one organized place.",
  },
];

const roadmapPhases = [
  {
    icon: "mdi:tick-all",
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
    icon: "entypo:hour-glass",
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
    icon: "uil:arrow-growth",
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
    image: "../../src/assets/img/team1.jpg",
  },
  {
    name: "Fred Jeremy Kwofie",
    roles: ["UI/UX Designer"],
    image: "../../src/assets/img/team2.jpg",
  },
  {
    name: "Nutakor Godsway Nani",
    roles: ["Frontend", "Quality Assurance"],
    image: "../../src/assets/img/team3.jpg",
  },
  {
    name: "Charles Owusu-Nyannor",
    roles: ["Frontend Developer"],
    image: "../../src/assets/img/team4.jpg",
  },
  {
    name: "Scheck Stephen Blessed",
    roles: ["Frontend Developer"],
    image: "../../src/assets/img/team5.jpg",
  },
  {
    name: "Abu-Wireko Jason",
    roles: ["Frontend Developer"],
    image: "../../src/assets/img/team6.jpg",
  },
  {
    name: "Wuni Abdulai",
    roles: ["Backend Developer"],
    image: "../../src/assets/img/team7.jpg",
  },
  {
    name: "Mensah Boakye Godfred",
    roles: ["Backend Developer"],
    image: "../../src/assets/img/team8.jpg",
  },
  {
    name: "Akaribo George",
    roles: ["Backend", "Quality Assurance"],
    image: "../../src/assets/img/team9.jpg",
  },
  {
    name: "Kotey James Jnr",
    roles: ["Backend"],
    image: "../../src/assets/img/team10.jpg",
  },
];

const faqs = [
  {
    question: "Who can use NoticeHub?",
    answer:
      "NoticeHub is currently available to Computer Science and Information Technology students at levels 1 through 4, along with verified course representatives and lecturers from both departments.",
  },
  {
    question: "How is my feed personalized?",
    answer:
      "Your feed is filtered based on your registered department and academic level. When you sign up, you select your program and year, and NoticeHub automatically shows you only the announcements relevant to you.",
  },
  {
    question: "Who is allowed to post announcements?",
    answer:
      "Only verified course representatives and lecturers can publish announcements. Students can view, comment on, and react to posts, but cannot create notices directly.",
  },
  {
    question: "Can I change my program or level?",
    answer:
      "Yes. You can update your department and level from your profile settings at any time. Changes take effect immediately and your feed will reflect your updated academic details.",
  },
  {
    question: "Is NoticeHub available on mobile?",
    answer:
      "NoticeHub is fully responsive and works on any modern mobile browser. A dedicated mobile app is currently in development as part of our Phase 3 roadmap.",
  },
];

export default function AboutPage() {
  const navigate = useNavigate();
  const teamScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const updateTeamScroll = () => {
    const el = teamScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateTeamScroll();
  }, []);

  const scrollTeamPrev = () => {
    const el = teamScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: -(el.firstElementChild?.offsetWidth + 16 || 304),
      behavior: "smooth",
    });
  };

  const scrollTeamNext = () => {
    const el = teamScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: el.firstElementChild?.offsetWidth + 16 || 304,
      behavior: "smooth",
    });
  };

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
        <div className="relative mt-24 mb-18 md:mt-26 md:mb-20 lg:mt-30 lg:mb-24 section-container  flex flex-col items-center text-center gap-7">
          <h1 className="text-4xl xsm:text-[40px] sm:text-5xl md:text-6xl lg:text-[68px] xl:text-7xl font-semibold leading-tight">
            <span className="text-secondary">About </span>
            <span className="text-primary">Us</span>
          </h1>
          <p className="max-w-2xl text-neutral-gray-8 text-sm md:text-lg leading-5 md:leading-6">
            Built By Students, for Students. NoticeHub started as a frustration
            and became a solution. A group of CS and IT students tired of
            missing deadlines in WhatsApp groups decided to build the platform
            their department actually needed.
          </p>
        </div>
      </section>

      {/* ── OUR STORY + STATS ── */}
      <section className="bg-white">
        <div className="section-container py-16 md:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-4 lg:max-w-[55%]">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary">
                Our Story
              </h2>
              <p className="text-neutral-gray-8 text-sm md:text-lg leading-6 md:leading-8 max-w-[88%]">
                NoticeHub did not start in a boardroom or a lab. It started in a
                group chat — the same one where every important announcement got
                buried under voice notes, memes, and good morning messages
                before anyone could read it. We are CS and IT students who lived
                this problem every semester. Missed deadlines, lost assignment
                briefs, course reps sending the same message on three different
                platforms just hoping someone would see it. At some point we
                stopped complaining and started building.
                <br />
                NoticeHub is the platform we wished existed when we were
                scrambling for information. A centralized, organized, and
                role-aware notice board built specifically for how our
                departments communicate — not how a generic tool assumes they
                do. This is not just a capstone project. It is a real solution
                to a real problem, built by the people who felt it most.
              </p>
            </div>
            <div className="w-full lg:flex-1">
              {/* Mobile: stacked vertically */}
              <div className="flex flex-col items-center lg:hidden">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col items-center gap-3.5 text-center w-full py-11 first:pt-0 last:pb-0 ${i > 0 ? "border-t border-neutral-gray-3" : ""}`}
                  >
                    <p className="text-5xl font-bold leading-[50px]">
                      <span className="text-primary">{stat.value}</span>
                      <span className="text-blue-2">{stat.suffix}</span>
                    </p>
                    <p className="text-primary text-lg">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Desktop: 2×2 grid with cross dividers */}
              <div className="hidden lg:flex items-stretch gap-0">
                <div className="flex flex-col items-center  ">
                  {[stats[0], stats[2]].map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`max-w-[250px] flex flex-col items-center gap-3.5 text-center w-full py-16 first:pt-0 last:pb-0 ${i > 0 ? "border-t border-neutral-gray-3 px-5" : "px-5"}`}
                    >
                      <p className="text-5xl font-bold leading-[50px]">
                        <span className="text-primary">{stat.value}</span>
                        <span className="text-blue-2">{stat.suffix}</span>
                      </p>
                      <p className="text-primary text-xl">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="border-l border-neutral-gray-3" />
                <div className="flex flex-col items-center ">
                  {[stats[1], stats[3]].map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`max-w-[250px] flex flex-col items-center gap-3.5 text-center w-full py-16 first:pt-0 last:pb-0 ${i > 0 ? "border-t border-neutral-gray-3 px-5" : "px-5"}`}
                    >
                      <p className="text-5xl font-bold leading-[50px]">
                        <span className="text-primary">{stat.value}</span>
                        <span className="text-blue-2">{stat.suffix}</span>
                      </p>
                      <p className="text-primary text-xl">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="bg-section-bg">
        <div className="section-container section-padding flex flex-col items-center gap-16 md:gap-20">
          <SectionTitle
            tag="The Problem"
            heading="Academic Communication Was Broken"
            subtext="Before NoticeHub, this is what staying informed looked like for CS and IT students every single day."
          />
          <div className="w-full grid grid-cols-1 xlg:grid-cols-2 xl:grid-cols-3   gap-7">
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
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
            {allFeatures.map((f, i) => (
              <div
                key={f.title}
                className={[
                  i < allFeatures.length - 1
                    ? "border-b border-stone-200/20"
                    : "",
                  i % 2 === 0
                    ? "md:border-r md:border-stone-200/20"
                    : "md:pl-15",
                  i >= allFeatures.length - 2 ? "md:border-b-0" : "",
                  i > 1 ? "md:pt-12" : "",
                ].join(" ")}
              >
                <FeatureItem
                  icon={f.icon}
                  title={f.title}
                  desc={f.desc}
                  iconClass={f.iconClass}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section className="relative bg-section-bg">
        <div className="absolute w-full opacity-50">
          <img
            src={LinesVectorBg}
            alt=""
            className="w-500 object-cover object-center"
          />
        </div>
        <div className="section-container section-padding flex flex-col items-center gap-16 md:gap-20">
          <SectionTitle
            tag="Where We Are"
            heading="From Idea to Impact"
            subtext="NoticeHub has been built in focused phases, each one adding more value for students and departments."
          />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-end md:items-end gap-16 md:gap-6 lg:gap-10">
            {roadmapPhases.map((phase, idx) => (
              <div
                key={phase.title}
                className="flex flex-col items-center gap-3.5 md:gap-4 text-center"
              >
                <div
                  className={`${idx == 1 ? "w-22.5 h-22.5" : "w-17.5 h-17.5"}  rounded-full ${phase.iconBg} ring-[10px] ${phase.iconRing} flex items-center justify-center text-white`}
                >
                  <Icon icon={phase.icon} width={idx == 1 ? 32 : 24} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <p
                    className={`${idx == 1 ? "text-base md:text-lg" : "text-sm md:text-base"} font-medium uppercase tracking-wide ${phase.labelColor}`}
                  >
                    {phase.label}
                  </p>
                  <h3
                    className={` ${idx == 1 ? "text-[26px] md:text-[32px]" : "text-2xl md:text-[28px]"} font-bold text-secondary`}
                  >
                    {phase.title}
                  </h3>
                  <div className="flex flex-col items-center  gap-2 md:gap-2.5">
                    {phase.items.map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <span className="text-neutral-gray-7 text-sm">▸</span>
                        <span
                          className={`text-neutral-gray-8  ${idx == 1 ? "text-lg md:text-xl" : "text-base md:text-lg"}`}
                        >
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
      <section className="bg-white overflow-hidden">
        <div className="section-container section-padding flex flex-col gap-10 lg:gap-20">
          {/* Mobile: heading + description */}
          <div className="flex flex-col gap-4 lg:hidden">
            <h2 className="text-2xl font-semibold text-secondary leading-tight">
              The People Behind NoticeHub
            </h2>
            <p className="text-neutral-gray-8 text-base max-w-xl">
              Group 51 — CS students who turned a shared frustration into a
              working platform for their department.
            </p>
          </div>

          {/* Cards carousel – breaks out of container on the right */}
          <div
            ref={teamScrollRef}
            onScroll={updateTeamScroll}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth -mx-5 md:-mx-10 xl:-mx-25 pl-5 md:pl-10 xl:pl-25"
          >
            {teamMembers.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex items-start justify-between">
            {/* Desktop: heading + description */}
            <div className="hidden lg:flex items-start gap-20 xl:gap-36">
              <h2 className=" text-4xl xl:text-[40px] font-semibold text-secondary leading-normal">
                The People Behind <br /> NoticeHub
              </h2>
              <p className="w-96 text-neutral-gray-8 text-lg">
                Group 51 — CS students who turned a shared frustration into a
                working platform for their department.
              </p>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center gap-5 mx-auto lg:mx-0">
              <button
                onClick={scrollTeamPrev}
                disabled={!canScrollLeft}
                className={`cursor-pointer group w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  canScrollLeft
                    ? "border border-blue-3 hover:bg-primary hover:border-primary"
                    : "border border-neutral-gray-4"
                }`}
              >
                <Icon
                  icon="akar-icons:chevron-left"
                  width={24}
                  className={`w-4.5 lg:w-6 ${canScrollLeft ? "text-primary group-hover:text-blue-1" : "text-neutral-gray-4"}`}
                />
              </button>
              <button
                onClick={scrollTeamNext}
                disabled={!canScrollRight}
                className={`cursor-pointer group w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  canScrollRight
                    ? "border border-blue-3 hover:bg-primary hover:border-primary"
                    : "border border-neutral-gray-4"
                }`}
              >
                <Icon
                  icon="akar-icons:chevron-right"
                  width={24}
                  className={`${canScrollRight ? "text-primary group-hover:text-blue-1" : "text-neutral-gray-4"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-linear-to-b from-[#0E0E6A] to-[#070732]">
        <div className="section-container section-padding flex flex-col items-center gap-16 md:gap-20">
          <SectionTitle
            tag="FAQ"
            heading="Everything You Need To Know"
            subtext="If your question is not answered here, reach out to your course rep or department admin"
            onColor
          />
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 md:gap-6">
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-secondary">
        {/* Desktop: image on right with gradient */}
        <div className="hidden lg:block absolute right-0 top-0 w-[50%] h-full">
          <img
            src={CtaSection}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-linear-to-r from-secondary to-transparent" />
        </div>
        <div className="relative ">
          <div className="py-15 px-5 sm:px-10  xl:pl-24 max-w-[570px] sm:max-w-[650px] flex flex-col gap-6 md:gap-8 lg:min-h-125 lg:justify-center">
            <div className="flex flex-col gap-4 md:gap-5">
              <h2 className="w-4/5 md:w-full text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-neutral-gray-1 leading-normal">
                Ready To Never Miss An Announcement Again?
              </h2>
              <p className=" sm:max-w-4/5 text-neutral-gray-5 text-base lg:text-lg">
                Join your classmates and stay ahead of every deadline and
                announcement.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/register")}
              className="w-fit text-secondary!"
            >
              Create Your Account
              <Icon icon="tabler:arrow-right" width={20} />
            </Button>
          </div>
        </div>
        {/* Mobile: image below text */}
        <div className="lg:hidden relative h-96">
          <img
            src={CtaSection}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-secondary to-transparent" />
        </div>
      </section>
    </div>
  );
}
