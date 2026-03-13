import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Button from "../../components/ui/Button";
import SectionTitle from "../../components/common/SectionTitle";
import Tabs from "../../components/ui/Tabs";
import { useState } from "react";
import LinesVectorBg from "../../assets/svg/linesvectorbg.svg";
import Hero1 from "../../assets/img/hero1.jpg";
import Hero2 from "../../assets/img/hero2.jpg";
import Problem1 from "../../assets/img/theproblem1.jpg";
import Problem2 from "../../assets/img/theproblem2.jpg";
import ProblemCard from "../../components/common/problemCard";
import FeatureItem from "../../components/common/FeatureItem";
import HowItWorksCard from "../../components/common/HowItWorksCard";
import HowItWorksBg from "../../assets/img/howitworks.jpg";
import ForStudentImg from "../../assets/img/forstudent.jpg";


const features = [
  {
    icon: "mdi:newspaper-variant-outline",
    title: "Personalized Feed",
    desc: "See only the announcements relevant to your program and level. No noise, no irrelevant posts.",
  },
  {
    icon: "mdi:calendar-clock-outline",
    title: "Deadline Tracking",
    desc: "Visual countdown timers and color-coded urgency indicators ensure you never miss a deadline.",
  },
  {
    icon: "mdi:bell-outline",
    title: "Real-Time Notifications",
    desc: "Get instant notifications for new announcements, approaching deadlines, and comment replies.",
  },
  {
    icon: "mdi:account-group-outline",
    title: "Role-Based Dashboards",
    desc: "Different interfaces for Students, Course Reps, and Lecturers with appropriate permissions and features.",
  },
];

const howItWorksSteps = [
  {
    icon: "mdi:account-plus-outline",
    title: "Sign Up For Your Program",
    desc: "Create your account with your university email, then select your department and level. Your feed is personalized from the moment you register.",
  },
  {
    icon: "mdi:text-box-outline",
    title: "See All Your Notices In One Feed",
    desc: "View only the announcements relevant to your program and level. No noise, no irrelevant posts — just everything your class needs, organized and easy to find.",
  },
  {
    icon: "mdi:bell-ring-outline",
    title: "Stay On Top Of Every Deadline",
    desc: "Get real-time notifications, visual countdown timers, and a dedicated deadline tracker so nothing important slips through the cracks again.",
  },
];

const roleTabs = [
  { value: "students", label: "Students" },
  { value: "course-reps", label: "Course Reps" },
  { value: "lecturers", label: "Lecturers" },
];

const roleData = {
  students: {
    image: ForStudentImg,
    role: "Students",
    heading: "Stay on top of every announcement",
    desc: "Get a personalized feed filtered to your department and level. Track deadlines with visual countdowns and receive instant notifications so nothing slips through the cracks.",
  },
  "course-reps": {
    image: "https://picsum.photos/seed/courserep/800/600",
    role: "Course Reps",
    heading: "Distribute notices to your class effortlessly",
    desc: "Post announcements directly to your class, manage resources, and keep everyone informed without the chaos of WhatsApp groups. Your classmates rely on you — NoticeHub makes it easy.",
  },
  lecturers: {
    image: "https://picsum.photos/seed/lecturer/800/600",
    role: "Lecturers",
    heading: "Post and manage course announcements with ease",
    desc: "Publish assignment deadlines, exam timetables, and course updates to the right students instantly. No more wondering if your message was received.",
  },
};

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const activeRole = roleData[activeTab];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="w-full relative bg-white overflow-hidden">
        <div className="absolute w-full">
          <img
            src={LinesVectorBg}
            alt="Background pattern"
            className="opacity-70 object-center object-cover w-500"
          />
        </div>
        <div className="relative w-full mt-24 md:mt-26 lg:mt-30 pb-28 inline-flex flex-col justify-center items-center gap-16 md:gap-24">
          <div className="max-w-170 flex flex-col justify-center items-center gap-10 md:gap-12">
            <div className="text-center flex flex-col justify-center items-center gap-4 md:gap-7">
              <div className="text-4xl xsm:text-[40px] sm:text-5xl md:text-6xl lg:text-[68px] xl:text-7xl font-semibold leading 10 xsm:leading-[48px] sm:leading-[56px] md:leading-[64px] lg:leading-[75px] xl:leading-[86.40px]">
                <span class="text-secondary ">Never miss a</span>
                <br />
                <span class="text-primary"> deadline </span>
                <span class="text-secondary">again</span>
              </div>
              <div className="px-5 max-w-140.5 justify-start text-neutral-gray-8 text-sm md:text-lg leading-auto md:leading-6">
                Stay connected with your department. Get real-time
                notifications, track deadlines, and access all your course
                resources in one place.
              </div>
            </div>
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/register")}
                className="py-3! text-sm! sm:text-base! w-full sm:w-auto"
              >
                Get Started
                <Icon icon="tabler:arrow-right" width="24" height="24" />
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate("/login")}
                className="py-3! text-sm! sm:text-base! w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative w-[667.48px] sm:w-[850px] md:w-[1038px] lg:w-[1130px] h-87.5 sm:h-113.5 md:h-140.25 lg:h-[650.32px] rounded-[30px]">
            <img
              className="absolute object-center object-cover w-96 sm:w-[488px] md:w-[596px] lg:w-[650px] h-72 sm:h-[375px] md:h-[464px] lg:h-[550px] rounded-2xl md:rounded-[28px] lg:rounded-[30px] left-0 top-[62.15px] sm:top-[79px] md:top-[97px] lg:top-[100px]"
              src={Hero1}
            />
            <img
              className="absolute object-center object-cover w-96 sm:w-[488px] md:w-[596px] lg:w-[650px] h-72 sm:h-[375px] md:h-[464px] lg:h-[550px] rounded-2xl md:rounded-[28px] lg:rounded-[30px] left-[270.07px] sm:left-[344px] md:left-[420px] lg:left-[480px] top-0"
              src={Hero2}
            />
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="flex flex-col gap-12 md:gap-20  section-padding section-container bg-[#FBFAFC]">
        <SectionTitle
          tag="THE PROBLEM"
          heading="Scattered notices"
          subtext="Announcements buried in WhatsApp groups, missed deadlines, and endless back-and-forth"
        />

        <div className="mx-auto flex flex-col md:flex-row md:justify-center md:items-center gap-4 md:gap-7">
          <ProblemCard
            heading="Deadlines Slip Through the Cracks"
            subtext="Without a central place for academic notices, critical assignment deadlines and exam updates get buried under unrelated messages. Students scroll endlessly through WhatsApp threads only to miss what matters most, and by the time they find it, it's too late.
The frustrating part is that the information was always there. It was posted, it existed, someone shared it."
            buttonText="Read More"
            buttonOnClick={() => navigate("/about")}
            className="w-full h-fit md:w-auto"
          />
          <div className="flex flex-col xl:flex-row items-center gap-4 md:gap-7">
            <div className="relative w-full md:w-[clamp(320px,22vw,384px)] h-80 md:h-[clamp(250px,25vh,572px)] xl:h-115 bg-zinc-100 rounded-[20px] lg:rounded-3xl overflow-hidden">
              <img
                src={Problem1}
                alt="lady with people around her"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
            <div className="relative w-full md:w-[clamp(320px,22vw,384px)] h-80 md:h-[clamp(250px,28vh,615px)] xl:h-130 bg-zinc-100 rounded-[20px] lg:rounded-3xl overflow-hidden">
              <img
                src={Problem2}
                alt="laptop"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        className="bg-linear-to-b from-[#0E0E6A] to-[#070732]"
        id="features"
      >
        <div className="section-container section-padding flex flex-col items-center gap-16 md:gap-20">
          <SectionTitle
            tag="Features"
            heading="What sets us apart"
            subtext="Built for the way you actually work and study"
            onColor
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={[
                  i < features.length - 1 ? "border-b border-stone-200/20" : "",
                  i % 2 === 0 ? "md:border-r md:border-stone-200/20" : "",
                  i >= 2 ? "md:border-b-0" : "",
                ].join(" ")}
              >
                <FeatureItem icon={f.icon} title={f.title} desc={f.desc} />
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate("/about")}
          >
            See All Features
            <Icon icon="tabler:arrow-right" width="24" height="24" />
          </Button>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative" id="how-it-works">
        <div className="absolute inset-0">
          <img
            src={HowItWorksBg}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-secondary/80" />
        </div>
        <div className="relative section-container section-padding flex flex-col items-center gap-16 md:gap-20">
          <SectionTitle
            tag="Getting Started"
            heading="How it works"
            subtext="Three steps to never missing an announcement again"
            onColor
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 py-4">
            {howItWorksSteps.map((step) => (
              <HowItWorksCard key={step.title} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BUILT FOR YOUR ROLE ── */}
      <section className="bg-neutral-50">
        <div className="section-container section-padding flex flex-col gap-10 md:gap-14">
          <SectionTitle
            tag="Who it's for"
            heading="Built for your role"
            subtext="Whether you're a student, course rep, or lecturer — NoticeHub adapts to how you engage with academic information."
          />
          <Tabs
            tabs={roleTabs}
            active={activeTab}
            onChange={setActiveTab}
          />
          <div className="bg-neutral-gray-1 rounded-2xl ring-1 ring-neutral-gray-4 overflow-hidden flex flex-col md:flex-row">
            <div className="relative w-full md:w-[45%] h-64 sm:h-80 md:h-auto">
              <img
                src={activeRole.image}
                alt={activeRole.role}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col gap-5 md:gap-6 p-8 md:p-10 lg:p-14 justify-center">
              <p className="border-l-4 border-primary pl-3 text-xs uppercase font-semibold tracking-widest text-primary">
                {activeRole.role}
              </p>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-secondary">
                {activeRole.heading}
              </h3>
              <p className="text-neutral-gray-7 text-sm md:text-base leading-6">
                {activeRole.desc}
              </p>
              <div>
                <Button variant="outline" size="sm" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-secondary overflow-hidden">
        {/* Desktop: image on right with gradient */}
        <div className="hidden lg:block absolute right-0 top-0 w-[55%] h-full">
          <img
            src={HowItWorksBg}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-linear-to-r from-secondary to-transparent" />
        </div>
        <div className="relative section-container section-padding">
          <div className="max-w-lg flex flex-col gap-6 md:gap-8 lg:min-h-[550px] lg:justify-center">
            <div className="flex flex-col gap-4 md:gap-5">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-neutral-gray-1 leading-tight">
                Ready To Never Miss An Announcement Again?
              </h2>
              <p className="text-neutral-gray-5 text-base lg:text-lg">
                Join your classmates and stay ahead of every deadline and announcement.
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/register")}
              >
                Create Your Account
                <Icon icon="tabler:arrow-right" width={20} />
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile: image below text */}
        <div className="lg:hidden relative h-96">
          <img
            src={HowItWorksBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-secondary to-transparent" />
        </div>
      </section>
    </div>
  );
}
