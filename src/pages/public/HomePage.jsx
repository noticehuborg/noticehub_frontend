import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import SectionTitle from "../../components/common/SectionTitle";
import Tabs from "../../components/ui/Tabs";
import { useState } from "react";
import { useModal, MODAL } from "../../context/ModalContext";
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
import CtaSection from "../../assets/img/ctasection.jpg";

const features = [
  {
    icon: "qlementine-icons:newspaper-16",
    iconClass: "w-[75%] h-[75%]",
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
];

const howItWorksSteps = [
  {
    icon: "solar:user-plus-broken",
    title: "Sign Up For Your Program",
    desc: "Create your account with your university email, then select your department and level. Your feed is personalized from the moment you register.",
  },
  {
    icon: "grommet-icons:schedules",
    title: "See All Your Notices In One Feed",
    desc: "View only the announcements relevant to your program and level. No noise, no irrelevant posts — just everything your class needs, organized and easy to find.",
  },
  {
    icon: "streamline-plump:ringing-bell-notification",
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
    heading: "Never miss what matters ",
    desc: "Your feed shows only announcements for your level and program. Deadlines countdown. Notifications keep you in the loop.",
  },
  "course-reps": {
    image: "https://picsum.photos/seed/courserep/800/600",
    role: "Course Reps",
    heading: "Distribute notices to your class effortlessly",
    desc: "Post announcements directly to your class, manage resources, and keep everyone informed without the chaos of WhatsApp groups.",
  },
  lecturers: {
    image: "https://picsum.photos/seed/lecturer/800/600",
    role: "Lecturers",
    heading: "Post and manage course announcements with ease",
    desc: "Publish assignment deadlines, exam timetables, and course updates to the right students instantly.",
  },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { user } = useAuth();

  function handleGetStarted() {
    if (user) {
      document
        .getElementById("how-it-works")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      openModal(MODAL.REGISTER);
    }
  }
  const [activeTab, setActiveTab] = useState("students");
  const activeRole = roleData[activeTab];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="w-full relative bg-white overflow-hidden">
        <div className="absolute w-full h-full">
          <img
            src={LinesVectorBg}
            alt="Background pattern"
            className="opacity-60 object-center object-cover w-200 h-full md:w-500"
          />
        </div>
        <div className="relative w-full mt-24 md:mt-26 lg:mt-30  pb-28 inline-flex flex-col justify-center items-center gap-16 md:gap-24">
          <div className="max-w-170 flex flex-col justify-center items-center gap-10 md:gap-12">
            <motion.div
              className="text-center flex flex-col justify-center items-center gap-4 md:gap-7"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
            >
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
            </motion.div>
            <motion.div
              className="inline-flex flex-col sm:flex-row items-center gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.25,
                ease: [0.22, 0.61, 0.36, 1],
              }}
            >
              <Button
                variant="primary"
                size="md"
                onClick={handleGetStarted}
                className="py-3! text-sm! sm:text-base! w-full sm:w-auto"
              >
                Get Started
                <Icon icon="tabler:arrow-right" width="24" height="24" />
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="py-3! text-sm! sm:text-base! w-full sm:w-auto"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
          <motion.div
            className="relative w-[667.48px] sm:w-[850px] md:w-[1038px] lg:w-[1130px] h-87.5 sm:h-113.5 md:h-140.25 lg:h-[650.32px] rounded-[30px]"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.35,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          >
            <img
              className="absolute object-center object-cover w-96 sm:w-[488px] md:w-[596px] lg:w-[650px] h-72 sm:h-[375px] md:h-[464px] lg:h-[550px] rounded-2xl md:rounded-[28px] lg:rounded-[30px] left-0 top-[62.15px] sm:top-[79px] md:top-[97px] lg:top-[100px]"
              src={Hero1}
            />
            <img
              className="absolute object-center object-cover w-96 sm:w-[488px] md:w-[596px] lg:w-[650px] h-72 sm:h-[375px] md:h-[464px] lg:h-[550px] rounded-2xl md:rounded-[28px] lg:rounded-[30px] left-[270.07px] sm:left-[344px] md:left-[420px] lg:left-[480px] top-0"
              src={Hero2}
            />
          </motion.div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="w-full bg-section-bg">
        <div className="flex flex-col gap-12 md:gap-20 section-padding section-container">
          <SectionTitle
            tag="THE PROBLEM"
            heading="Scattered notices"
            subtext="Announcements buried in WhatsApp groups, missed deadlines, and endless back-and-forth"
          />

          <div className="mx-auto flex flex-col md:flex-row md:justify-center md:items-center xl:items-stretch gap-4 md:gap-7">
            <ProblemCard
              heading="Deadlines Slip Through the Cracks"
              subtext="Without a central place for academic notices, critical assignment deadlines and exam updates get buried under unrelated messages. Students scroll endlessly through WhatsApp threads only to miss what matters most, and by the time they find it, it's too late.
The frustrating part is that the information was always there. It was posted, it existed, someone shared it. But between the good morning messages, the memes, and the 47 unread notifications, it never stood a chance. "
              buttonText="Read More"
              buttonOnClick={() => navigate("/about")}
              className="w-full md:w-auto "
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
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-0">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.1,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
                className={[
                  i < features.length - 1 ? "border-b border-stone-200/20" : "",
                  i % 2 === 0 ? "lg:border-r lg:border-stone-200/20" : "",
                  i >= features.length - 2 ? "lg:border-b-0" : "",
                  i > 1 ? "lg:pt-8" : "",
                ].join(" ")}
              >
                <FeatureItem
                  icon={f.icon}
                  title={f.title}
                  desc={f.desc}
                  iconClass={f.iconClass}
                />
              </motion.div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/about#our-solution")}
          >
            See All Features
            <Icon icon="tabler:arrow-right" width="24" height="24" />
          </Button>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative" id="how-it-works">
        <div className="absolute inset-0 bg-black/90">
          <img
            src={HowItWorksBg}
            alt=""
            className="w-full h-full object-cover object-center opacity-15 "
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50.00%_50.00%_at_50.00%_50.00%,rgba(0,0,0,0)_31%,rgba(0,0,0,0.60)_100%)]" />
        </div>
        <div className="relative section-container section-padding flex flex-col items-center gap-16 md:gap-20">
          <SectionTitle
            tag="Getting Started"
            heading="How it works"
            subtext="Three steps to never missing an announcement again"
            onColor
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 py-4">
            {howItWorksSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.15,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                <HowItWorksCard {...step} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUILT FOR YOUR ROLE ── */}
      <section className="bg-section-bg">
        <div className="section-container section-padding flex flex-col gap-10 md:gap-14">
          <SectionTitle
            tag="For"
            heading="Built for your role"
            subtext="Whether you're chasing deadlines or managing announcements, NoticeHub works the way you do."
          />
          <Tabs tabs={roleTabs} active={activeTab} onChange={setActiveTab} />
          <div className="sm:min-h-[500px] xl:min-h-[600px] bg-neutral-gray-1 rounded-2xl ring-1 ring-neutral-gray-4 overflow-hidden flex flex-col md:flex-row">
            <div className="relative w-full md:flex-1 h-70 md:h-auto">
              <img
                src={activeRole.image}
                alt={activeRole.role}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
            <div className="md:flex-1 flex flex-col gap-6 p-6 md:p-10 lg:p-12 justify-center">
              <p className="border-l border-primary px-1.5 rounded-[1px] text-sm md:text-base font-semibold text-primary">
                {activeRole.role}
              </p>
              <h3 className="text-2xl md:text-3xl lg:text-[32px] font-semibold text-secondary">
                {activeRole.heading}
              </h3>
              <p className="text-neutral-gray-7 text-sm md:text-base leading-6 max-w-[520px]">
                {activeRole.desc}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openModal(MODAL.REGISTER)}
                className="self-start px-5 py-2.5 text-sm rounded-[14px]!"
              >
                Register
              </Button>
            </div>
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
              onClick={() => user ? navigate("/dashboard") : openModal(MODAL.REGISTER)}
              className="w-fit text-secondary!"
            >
              {user ? "Go to Dashboard" : "Create Your Account"}
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
