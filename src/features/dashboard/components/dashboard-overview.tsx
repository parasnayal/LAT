import {
  Activity,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileQuestion,
  GraduationCap,
  LibraryBig,
  LineChart,
  SearchCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
import styles from "./dashboard-overview.module.scss";

const kpis = [
  { title: "Total Questions", value: "48,216", change: "+18.4%", icon: FileQuestion, tone: "blue" },
  { title: "Pending Review", value: "1,284", change: "-6.2%", icon: Clock3, tone: "amber" },
  {
    title: "Approved Questions",
    value: "36,902",
    change: "+12.8%",
    icon: CheckCircle2,
    tone: "green"
  },
  {
    title: "Published Assessments",
    value: "426",
    change: "+9.1%",
    icon: ClipboardList,
    tone: "blue"
  },
  { title: "Student Attempts", value: "2.8M", change: "+24.7%", icon: UsersRound, tone: "green" }
] as const;

const activities = [
  ["Question approved", "Grade 6 Mathematics item moved to question bank", "4 min ago"],
  ["Assessment published", "Grade 9 Science diagnostic test is live", "22 min ago"],
  ["Student completed assessment", "Class 6B LAT baseline completed", "47 min ago"],
  ["Reviewer rejected question", "English Locate Information item needs revision", "1 hr ago"],
  ["AI generated new questions", "15 competency-based MCQs created", "2 hrs ago"]
] as const;

const upcoming = [
  ["Reading Comprehension LAT", "Grade 3", "English", "28 Jun", "10:00 AM", "25", "Scheduled"],
  ["Numeracy Benchmark", "Grade 6", "Mathematics", "29 Jun", "11:30 AM", "30", "Ready"],
  ["Scientific Reasoning Check", "Grade 9", "Science", "02 Jul", "09:15 AM", "35", "Draft"]
] as const;

const competencies = [
  ["Locate Information", 86, "#2563EB"],
  ["Understand", 74, "#22C55E"],
  ["Evaluate & Reflect", 62, "#F59E0B"],
  ["Apply Mathematics", 79, "#2563EB"],
  ["Scientific Reasoning", 58, "#EF4444"],
  ["Critical Thinking", 68, "#F59E0B"]
] as const;

const quickActions = [
  [Sparkles, "Generate AI Questions", "Create competency-aligned items from curriculum maps."],
  [ClipboardList, "Create Assessment", "Build and publish Grade 3, 6, or 9 assessments."],
  [SearchCheck, "Review Questions", "Approve, reject, or refine AI-generated questions."],
  [LibraryBig, "Question Bank", "Explore approved items by subject and competency."],
  [BookOpenCheck, "Manage Curriculum", "Maintain outcomes, indicators, and competencies."],
  [BarChart3, "View Analytics", "Track participation, scores, and learning gaps."]
] as const;

const analytics = [
  ["Average Score", "72.4%", "+4.1%"],
  ["Participation Rate", "91.8%", "+6.7%"],
  ["Weak Competencies", "14", "-3"],
  ["Top Performing Subject", "English", "86%"],
  ["Lowest Performing Subject", "Science", "61%"],
  ["Student Growth", "+11.2%", "30 days"]
] as const;

export function DashboardOverview() {
  return (
    <section className={styles.dashboard}>
      <WelcomeBanner />
      <div className={styles.kpiGrid}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article className={styles.kpiCard} key={kpi.title}>
              <div className={styles.kpiTop}>
                <span className={styles[`icon_${kpi.tone}`]}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <MiniTrend />
              </div>
              <p className={styles.kpiTitle}>{kpi.title}</p>
              <div className={styles.kpiValueRow}>
                <strong>{kpi.value}</strong>
                <span>{kpi.change}</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.chartGrid}>
        <article className={styles.largeCard}>
          <SectionHeading title="Assessment Activity" subtitle="Last 7 days" icon={LineChart} />
          <LineChartSvg />
        </article>
        <article className={styles.card}>
          <SectionHeading title="Question Status" subtitle="Approval pipeline" icon={Activity} />
          <DoughnutChart />
        </article>
      </div>

      <div className={styles.twoColumn}>
        <article className={styles.card}>
          <SectionHeading
            title="Recent Activities"
            subtitle="Live operations timeline"
            icon={Clock3}
          />
          <div className={styles.timeline}>
            {activities.map(([title, detail, time]) => (
              <div className={styles.timelineItem} key={title}>
                <span className={styles.timelineDot} />
                <div>
                  <p>{title}</p>
                  <span>{detail}</span>
                </div>
                <time>{time}</time>
              </div>
            ))}
          </div>
          <button className={styles.linkButton} type="button">
            View All
          </button>
        </article>
        <article className={styles.card}>
          <SectionHeading
            title="Upcoming Assessments"
            subtitle="Scheduled assessment windows"
            icon={ClipboardList}
          />
          <div className={styles.assessmentList}>
            {upcoming.map(([name, grade, subject, date, time, questions, status]) => (
              <div className={styles.assessmentItem} key={name}>
                <div>
                  <p>{name}</p>
                  <span>
                    {grade} - {subject} - {questions} questions
                  </span>
                </div>
                <div className={styles.assessmentMeta}>
                  <strong>{date}</strong>
                  <span>{time}</span>
                </div>
                <span className={styles.statusBadge}>{status}</span>
                <button className={styles.smallButton} type="button">
                  View
                </button>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className={styles.card}>
        <SectionHeading
          title="Competency Performance"
          subtitle="Average benchmark: 70%"
          icon={BrainCircuit}
        />
        <div className={styles.progressGrid}>
          {competencies.map(([name, value, color]) => (
            <div className={styles.progressRow} key={name}>
              <div>
                <p>{name}</p>
                <span>{value}%</span>
              </div>
              <div className={styles.progressTrack}>
                <span style={{ width: `${value}%`, backgroundColor: color }} />
                <i style={{ left: "70%" }} />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className={styles.card}>
        <SectionHeading
          title="Quick Actions"
          subtitle="Common administrator workflows"
          icon={Sparkles}
        />
        <div className={styles.actionGrid}>
          {quickActions.map(([Icon, title, description]) => (
            <button className={styles.actionCard} type="button" key={title}>
              <Icon size={26} aria-hidden="true" />
              <span>{title}</span>
              <p>{description}</p>
            </button>
          ))}
        </div>
      </article>

      <div className={styles.analyticsGrid}>
        <article className={styles.largeCard}>
          <SectionHeading
            title="Analytics Overview"
            subtitle="Score and participation trend"
            icon={BarChart3}
          />
          <AreaChart />
        </article>
        <article className={styles.card}>
          <SectionHeading
            title="Subject Distribution"
            subtitle="Assessment coverage"
            icon={GraduationCap}
          />
          <BarChart />
        </article>
        <article className={styles.card}>
          <SectionHeading
            title="Competency Heatmap"
            subtitle="Learning gap intensity"
            icon={BrainCircuit}
          />
          <Heatmap />
        </article>
      </div>

      <div className={styles.metricStrip}>
        {analytics.map(([label, value, hint]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function WelcomeBanner() {
  return (
    <section className={styles.welcome}>
      <div>
        <p>Good Morning,</p>
        <h2>Welcome back, Admin.</h2>
        <span>Manage competency-based assessments with AI.</span>
      </div>
      <div className={styles.welcomeActions}>
        <button className={styles.primaryButton} type="button">
          Generate Questions
        </button>
        <button className={styles.secondaryButton} type="button">
          Create Assessment
        </button>
      </div>
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
  icon: Icon
}: {
  title: string;
  subtitle: string;
  icon: typeof Activity;
}) {
  return (
    <div className={styles.sectionHeading}>
      <span>
        <Icon size={18} aria-hidden="true" />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function MiniTrend() {
  return (
    <svg viewBox="0 0 80 24" className={styles.miniTrend} aria-hidden="true">
      <path
        d="M2 18 C14 6, 24 20, 36 10 S56 4, 78 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LineChartSvg() {
  return (
    <svg
      viewBox="0 0 720 260"
      className={styles.lineChart}
      role="img"
      aria-label="Assessment activity line chart"
    >
      <g stroke="#E2E8F0" strokeWidth="1">
        {[40, 90, 140, 190, 240].map((y) => (
          <line x1="32" x2="700" y1={y} y2={y} key={y} />
        ))}
      </g>
      <path
        d="M40 206 C104 160, 136 176, 190 122 C245 68, 294 126, 346 92 C420 44, 448 142, 510 104 C590 54, 620 82, 690 42"
        fill="none"
        stroke="#2563EB"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M40 226 C120 210, 160 188, 220 196 C302 206, 342 152, 418 162 C520 176, 574 132, 690 118"
        fill="none"
        stroke="#22C55E"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
        <text x={58 + index * 104} y="252" fill="#64748B" fontSize="14" key={day}>
          {day}
        </text>
      ))}
    </svg>
  );
}

function DoughnutChart() {
  return (
    <div className={styles.doughnutWrap}>
      <svg
        viewBox="0 0 180 180"
        className={styles.doughnut}
        role="img"
        aria-label="Question status doughnut chart"
      >
        <circle cx="90" cy="90" r="62" fill="none" stroke="#E2E8F0" strokeWidth="24" />
        <circle
          cx="90"
          cy="90"
          r="62"
          fill="none"
          stroke="#2563EB"
          strokeWidth="24"
          strokeDasharray="155 390"
          strokeDashoffset="0"
        />
        <circle
          cx="90"
          cy="90"
          r="62"
          fill="none"
          stroke="#22C55E"
          strokeWidth="24"
          strokeDasharray="125 390"
          strokeDashoffset="-155"
        />
        <circle
          cx="90"
          cy="90"
          r="62"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="24"
          strokeDasharray="70 390"
          strokeDashoffset="-280"
        />
        <circle
          cx="90"
          cy="90"
          r="62"
          fill="none"
          stroke="#EF4444"
          strokeWidth="24"
          strokeDasharray="40 390"
          strokeDashoffset="-350"
        />
      </svg>
      <div className={styles.doughnutCenter}>
        <strong>48.2K</strong>
        <span>Total</span>
      </div>
      <div className={styles.legend}>
        {[
          ["Draft", "40%", "#2563EB"],
          ["Pending Review", "18%", "#F59E0B"],
          ["Approved", "32%", "#22C55E"],
          ["Rejected", "10%", "#EF4444"]
        ].map(([label, value, color]) => (
          <p key={label}>
            <i style={{ backgroundColor: color }} />
            <span>{label}</span>
            <strong>{value}</strong>
          </p>
        ))}
      </div>
    </div>
  );
}

function AreaChart() {
  return (
    <svg
      viewBox="0 0 720 260"
      className={styles.lineChart}
      role="img"
      aria-label="Average score area chart"
    >
      <path
        d="M40 208 C110 150, 170 176, 230 126 C300 72, 360 128, 430 82 C520 32, 590 80, 690 50 L690 230 L40 230 Z"
        fill="#DBEAFE"
      />
      <path
        d="M40 208 C110 150, 170 176, 230 126 C300 72, 360 128, 430 82 C520 32, 590 80, 690 50"
        fill="none"
        stroke="#2563EB"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BarChart() {
  const bars = [76, 64, 82, 58, 69];
  return (
    <div className={styles.barChart} aria-label="Subject distribution bar chart">
      {bars.map((bar, index) => (
        <span style={{ height: `${bar}%` }} key={index} />
      ))}
    </div>
  );
}

function Heatmap() {
  return (
    <div className={styles.heatmap} aria-label="Competency heatmap">
      {Array.from({ length: 35 }).map((_, index) => (
        <span className={styles[`heat_${(index % 4) + 1}`]} key={index} />
      ))}
    </div>
  );
}
