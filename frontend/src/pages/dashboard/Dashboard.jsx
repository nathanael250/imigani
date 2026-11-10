import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bell,
  Bold,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  FileText,
  ExternalLink,
  Globe2,
  Heading1,
  Heading2,
  Handshake,
  ImagePlus,
  Italic,
  LayoutDashboard,
  Link as LinkIcon,
  List,
  ListOrdered,
  LogOut,
  Mail,
  Menu,
  MapPinned,
  Package,
  Plus,
  PenLine,
  Settings,
  Star,
  Tags,
  Trash2,
  Underline,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import logoImage from "../../assets/imigani tours.png";
import attaLogo from "../../assets/affiliations/atta logo.png";
import rttaLogo from "../../assets/affiliations/RTTA.jpeg";
import visitRwandaLogo from "../../assets/affiliations/visit_rwanda_logo.png";
import { getCurrentUser, logout } from "../../services/authService";
import {
  createAffiliation,
  deleteAffiliation,
  listAffiliations,
  updateAffiliation,
  uploadAffiliationLogo,
} from "../../services/affiliationService.js";
import {
  createBlogPost,
  deleteBlogPost,
  deleteReview,
  getDashboardSummary,
  getSettings,
  listBlogPosts,
  listInquiries,
  listNotifications,
  listReviews,
  listSubscribers,
  markAllNotificationsRead,
  markInquiryRead,
  markNotificationRead,
  updateBlogPost,
  updateInquiryStatus,
  updateReview,
  updateSettings,
  updateSubscriberStatus,
  uploadBlogImage,
} from "../../services/dashboardService";
import { createTourCategory, deleteTour, deleteTourCategory, listTourCategories, listTours, updateTourCategory } from "../../services/tourService";
import TourPackageBuilder from "./TourPackageBuilder";
import LanguageMenu from "../../components/LanguageMenu.jsx";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:6003").replace(/\/$/, "");

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Requests", href: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Subscribers", href: "/dashboard/subscribers", icon: Mail },
  { label: "Tour packages", href: "/dashboard/tour-packages", icon: Package },
  { label: "Tour categories", href: "/dashboard/tour-categories", icon: Tags },
  { label: "Destinations", href: "/dashboard/destinations", icon: MapPinned },
  { label: "Affiliations", href: "/dashboard/affiliations", icon: Handshake },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Blogs", href: "/dashboard/blogs", icon: PenLine },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const quickActions = [
  { href: "/dashboard/tour-packages/new", label: "Add Tour Package", icon: Package },
  { href: "/dashboard/tour-categories", label: "Manage Categories", icon: Tags },
  { href: "/dashboard/blogs", label: "Add Blog Post", icon: PenLine },
  { href: "/dashboard/bookings", label: "View Requests", icon: Mail },
  { href: "/dashboard/reviews", label: "Moderate Reviews", icon: Star },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const statusClass = {
  New: "new",
  Replied: "replied",
  Pending: "pending",
  Published: "published",
  Draft: "draft",
  approved: "published",
  archived: "draft",
  closed: "draft",
  draft: "draft",
  in_progress: "pending",
  new: "new",
  pending: "pending",
  published: "published",
  rejected: "pending",
  responded: "replied",
};

const dashboardPageClass =
  'min-h-screen bg-[radial-gradient(circle_at_35%_0%,rgba(198,146,61,0.08),transparent_30rem),linear-gradient(135deg,#f8f6ef_0%,#eef3ea_100%)] font-sans text-[#1f2c22]'
const panelClass = 'min-w-0 rounded-[8px] border border-[#e1e7dc] bg-white/95 p-[15px_19px] shadow-[0_14px_30px_rgba(18,53,27,0.07)]'
const sectionHeadingClass = 'mb-4 flex flex-col items-start justify-between gap-[18px] sm:flex-row sm:items-end'
const primaryLinkClass =
  'inline-flex min-h-[42px] items-center justify-center gap-[9px] whitespace-nowrap rounded-md bg-[#0b2a12] px-4 text-[13px] font-black text-white shadow-[0_14px_28px_rgba(11,42,18,0.16)] transition hover:-translate-y-px hover:bg-[#14401d] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0'
const secondaryLinkClass =
  'inline-flex min-h-[42px] items-center justify-center gap-[9px] whitespace-nowrap rounded-md border border-[#dfe5da] bg-white px-4 text-[13px] font-black text-[#233126] transition hover:border-[#c6923d]/55 hover:text-[#c6923d] disabled:cursor-not-allowed disabled:opacity-70'
const dangerLinkClass =
  'inline-flex min-h-[34px] items-center justify-center whitespace-nowrap rounded-md border border-red-200 bg-white px-3 text-[12px] font-extrabold text-red-600 transition hover:border-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70'
const inlineErrorClass = 'rounded-md bg-[#fff1ed] px-[14px] py-3 text-[13px] font-black text-[#9b2f20]'
const tableWrapClass = 'overflow-x-auto'
const tableClass =
  'w-full min-w-[760px] border-collapse [&_td]:border-b [&_td]:border-[#edf1e9] [&_td]:px-[14px] [&_td]:py-3 [&_td]:text-[13px] [&_td]:font-extrabold [&_td]:text-[#263129] [&_td]:align-middle [&_th]:border-b [&_th]:border-[#e4eadf] [&_th]:px-[14px] [&_th]:pb-3 [&_th]:text-left [&_th]:text-[12px] [&_th]:font-black [&_th]:uppercase [&_th]:text-[#677268] [&_tr:last-child_td]:border-b-0'
const tableActionClass = 'flex flex-wrap items-center gap-2'
const formInputClass =
  'w-full rounded-md border border-[#dce4d8] bg-white px-4 py-3 text-sm font-bold text-[#26332a] outline-none transition focus:border-[#d3a14e] focus:ring-4 focus:ring-[#d3a14e]/20'
const formLabelClass = 'grid gap-2 text-sm font-bold text-[#0b2a12]'
const requestStatusClass = 'min-h-[34px] rounded-md border border-[#dce4d8] bg-white py-0 pl-2.5 pr-[30px] text-[12px] font-semibold text-[#0b2a12]'
const emptyStateClass = 'grid min-h-[230px] place-items-center content-center gap-2.5 rounded-[8px] border border-dashed border-[#d8e0d5] bg-[#fbfcfa] p-8 text-center'

function statusBadgeClass(status) {
  const tone = statusClass[status] || status || 'draft'
  const base = 'inline-flex w-max rounded px-[7px] py-1 text-[11px] font-black capitalize leading-none'

  if (tone === 'new' || tone === 'published' || tone === 'approved' || tone === 'confirmed' || tone === 'paid') {
    return `${base} bg-[#e1f0dc] text-[#0a672c]`
  }
  if (tone === 'replied' || tone === 'draft' || tone === 'responded') {
    return `${base} bg-[#dceafa] text-[#1d5f9e]`
  }
  if (tone === 'pending' || tone === 'in_progress' || tone === 'rejected') {
    return `${base} bg-[#fbefd9] text-[#936417]`
  }
  if (tone === 'inactive' || tone === 'archived' || tone === 'closed') {
    return `${base} bg-[#ecefeb] text-[#667166]`
  }

  return `${base} bg-[#ecefeb] text-[#667166]`
}

function sectionEyebrow(title) {
  return <span className="mb-1.5 block text-[12px] font-black uppercase text-[#a36a13]">{title}</span>
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "IM";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarProfileOpen, setIsSidebarProfileOpen] = useState(false);
  const [isHeaderProfileOpen, setIsHeaderProfileOpen] = useState(false);
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newRequestCount, setNewRequestCount] = useState(0);
  const user = getCurrentUser();
  const userName = user?.name || "Administrator";
  const userRole = user?.role || "admin";
  const userInitials = getInitials(userName);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    let isMounted = true;

    async function refreshDashboardAlerts() {
      try {
        const [notificationRows, newRequests] = await Promise.all([
          listNotifications({ filters: { is_read: 0 }, limit: 8 }),
          listInquiries({ filters: { is_read: 0 }, limit: 200 }),
        ]);

        if (isMounted) {
          setNotifications(Array.isArray(notificationRows) ? notificationRows : []);
          setNewRequestCount(Array.isArray(newRequests) ? newRequests.length : 0);
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
          setNewRequestCount(0);
        }
      }
    }

    refreshDashboardAlerts();
    window.addEventListener("imigani:request-read", refreshDashboardAlerts);
    const refreshInterval = window.setInterval(refreshDashboardAlerts, 15000);

    return () => {
      isMounted = false;
      window.removeEventListener("imigani:request-read", refreshDashboardAlerts);
      window.clearInterval(refreshInterval);
    };
  }, []);

  async function handleMarkAllNotificationsRead() {
    await markAllNotificationsRead();
    setNotifications([]);
  }

  async function handleMarkNotificationRead(id) {
    await markNotificationRead(id);
    setNotifications((current) => current.filter((item) => item.id !== id));
  }

  const unreadCount = notifications.filter((item) => Number(item.is_read) === 0).length;

  return (
    <main className={dashboardPageClass}>
      <aside
        className={`fixed bottom-0 left-0 top-0 z-20 flex w-[280px] flex-col overflow-y-auto bg-[linear-gradient(180deg,#092512_0%,#12351b_64%,#0a2411_100%)] text-white shadow-[14px_0_35px_rgba(9,37,18,0.18)] max-[980px]:right-0 max-[980px]:bottom-auto max-[980px]:w-full max-[980px]:overflow-visible ${
          isDashboardMenuOpen ? 'max-[980px]:max-h-[100svh]' : 'max-[980px]:max-h-[68px]'
        }`}
        aria-label="Dashboard navigation"
      >
        <div className="hidden min-h-[68px] items-center justify-between gap-3 border-b border-white/10 bg-[#082511] px-5 max-[980px]:flex">
          <div>
            <strong className="block text-[20px] font-bold leading-none tracking-wide">IMIGANI</strong>
            <span className="mt-1 block text-[12px] font-bold text-white/70">Tours &amp; Safaris</span>
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/14 bg-white/10 text-white"
            type="button"
            aria-controls="dashboard-navigation"
            aria-expanded={isDashboardMenuOpen}
            aria-label={isDashboardMenuOpen ? "Close dashboard menu" : "Open dashboard menu"}
            onClick={() => setIsDashboardMenuOpen((current) => !current)}
          >
            {isDashboardMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
        <div className="flex min-h-[86px] flex-col items-center justify-center px-6 pb-3 pt-[17px] max-[980px]:hidden">
          <h1 className="text-4xl font-bold leading-none text-white">IMIGANI</h1>
          <span className="mt-2 text-[17px] font-semibold text-white/82">Tours & Safaris</span>
        </div>

        <nav id="dashboard-navigation" className="grid gap-1.5 px-[18px] pb-4 max-[980px]:overflow-y-auto max-[980px]:px-5 max-[980px]:py-4">
          {navItems.map(({ label, href, icon: Icon, end }) => (
            <NavLink
              className={({ isActive }) =>
                `relative flex min-h-[47px] items-center gap-5 rounded-[8px] px-[18px] text-[14px] font-bold transition hover:translate-x-0.5 hover:bg-white/10 hover:text-white ${
                  isActive ? "bg-[#c6923d]/20 text-[#d3a14e] before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1.5 before:rounded-l-[8px] before:bg-[#d3a14e]" : "text-white/75"
                }`
              }
              end={end}
              to={href}
              key={label}
              onClick={() => setIsDashboardMenuOpen(false)}
            >
              <Icon className="h-[22px] w-[22px] flex-none stroke-2" aria-hidden="true" />
              <span className="min-w-0 flex-1">{label}</span>
              {label === "Requests" && newRequestCount > 0 && (
                <strong
                  className="grid h-[22px] min-w-[22px] flex-none place-items-center rounded-full bg-[#d92d20] px-1.5 text-[11px] font-extrabold leading-none text-white shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
                  aria-label={`${newRequestCount} new requests`}
                >
                  {newRequestCount > 99 ? "99+" : newRequestCount}
                </strong>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto grid gap-[9px] px-[14px] py-2.5 max-[980px]:px-5 max-[980px]:pb-5">
          <section className="rounded-[8px] border border-white/10 bg-white/10 px-[14px] py-[11px]" aria-label="Visit public website">
            <Globe2 className="mb-[7px] h-[18px] w-[18px] text-[#d3a14e]" aria-hidden="true" />
            <strong className="block text-[13px] font-bold text-white">Visit Website</strong>
            <p className="mt-1 text-[11px] leading-normal text-white/65">Open the public IMIGANI Tours &amp; Safaris website.</p>
            <a className="mt-2 inline-flex items-center gap-[7px] text-[11px] font-black text-[#d3a14e]" href="/" target="_blank" rel="noreferrer">
              Go to Website
              <ExternalLink className="h-[13px] w-[13px]" aria-hidden="true" />
            </a>
          </section>

          <section className="relative" aria-label="Signed in user">
            <button
              className="flex w-full items-center gap-[11px] rounded-[8px] border border-white/10 bg-white/10 px-3 py-2.5 text-left text-white transition hover:border-[#d3a14e]/40 hover:bg-white/15"
              type="button"
              aria-expanded={isSidebarProfileOpen}
              onClick={() => {
                setIsSidebarProfileOpen((current) => !current);
                setIsHeaderProfileOpen(false);
              }}
            >
              <div className="grid h-[38px] w-[38px] flex-none place-items-center rounded-full bg-[#c6923d] text-[12px] font-extrabold text-white" aria-hidden="true">
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-[13px] font-bold text-white">{userName}</strong>
                <span className="mt-1 block truncate text-[11px] leading-normal text-white/65">{userRole}</span>
              </div>
              <ChevronDown className="h-[15px] w-[15px] flex-none text-white/60" aria-hidden="true" />
            </button>

            {isSidebarProfileOpen && (
              <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-30 overflow-hidden rounded-[8px] border border-white/10 bg-white text-[#132419] shadow-[0_18px_38px_rgba(0,0,0,0.22)]">
                <div className="border-b border-[#e5ebe1] px-[13px] py-3">
                  <strong className="block text-[13px] font-black text-[#102616]">{userName}</strong>
                  <span className="mt-1 block truncate text-[11px] font-bold text-[#687265]">{user?.email || "Signed in"}</span>
                </div>
                <button className="flex min-h-[42px] w-full items-center gap-[9px] bg-white px-[13px] text-left text-[13px] font-black text-[#9b2f20] transition hover:bg-[#fff1ed] hover:text-[#7f2116]" type="button" onClick={handleLogout}>
                  <LogOut className="h-[17px] w-[17px]" aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </section>
        </div>
      </aside>

      <section className="min-h-screen p-[16px_26px_14px] pl-[306px] max-[980px]:px-4 max-[980px]:pb-5 max-[980px]:pt-[84px]" aria-label="IMIGANI admin overview">
        <header className="sticky top-0 z-[15] -mx-2.5 mb-[14px] flex min-h-[54px] items-start justify-end gap-4 border-b border-[#e1e7dc]/70 bg-[linear-gradient(135deg,rgba(248,246,239,0.94),rgba(238,243,234,0.94))] p-[7px_10px] backdrop-blur">
          <div className="flex flex-wrap justify-end gap-2.5">
            <div className="relative">
              <button
                className="relative inline-flex min-h-9 w-9 items-center justify-center gap-2 rounded-[8px] border border-[#dfe5da] bg-white text-[13px] font-extrabold text-[#263129] shadow-[0_8px_20px_rgba(18,53,27,0.06)] transition hover:-translate-y-px hover:border-[#c6923d]/55 hover:shadow-[0_12px_24px_rgba(18,53,27,0.1)]"
                type="button"
                aria-expanded={isNotificationsOpen}
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen((current) => !current)}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {unreadCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-white bg-[#c6422d] px-1 text-[10px] leading-none text-white">{unreadCount}</span>}
              </button>
              {isNotificationsOpen && (
                <NotificationsDropdown
                  notifications={notifications}
                  onMarkAllRead={handleMarkAllNotificationsRead}
                  onMarkRead={handleMarkNotificationRead}
                />
              )}
            </div>
            <div className="relative">
              <button
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-[8px] border border-[#dfe5da] bg-white py-0 pl-[9px] pr-3 text-[13px] font-extrabold text-[#263129] shadow-[0_8px_20px_rgba(18,53,27,0.06)] transition hover:-translate-y-px hover:border-[#c6923d]/55 hover:shadow-[0_12px_24px_rgba(18,53,27,0.1)]"
                type="button"
                aria-expanded={isHeaderProfileOpen}
                onClick={() => {
                  setIsHeaderProfileOpen((current) => !current);
                  setIsSidebarProfileOpen(false);
                  setIsNotificationsOpen(false);
                }}
              >
                <span className="grid h-7 w-7 flex-none place-items-center overflow-hidden rounded-full border border-[#e7ede3] bg-[#f8f6ef]">
                  <img className="h-6 w-6 object-contain" src={logoImage} alt="" />
                </span>
                <span>{userName}</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>

              {isHeaderProfileOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-[45] w-[min(280px,calc(100vw-28px))] overflow-hidden rounded-[8px] border border-[#dfe5da] bg-white text-[#132419] shadow-[0_18px_38px_rgba(18,53,27,0.18)]">
                  <div className="border-b border-[#e5ebe1] px-[13px] py-3">
                    <strong className="block text-[13px] font-extrabold text-[#102616]">{userName}</strong>
                    <span className="mt-1 block truncate text-[11px] font-semibold text-[#687265]">{user?.email || "Signed in"}</span>
                  </div>
                  <button className="flex min-h-[42px] w-full items-center gap-[9px] bg-white px-[13px] text-left text-[13px] font-extrabold text-[#9b2f20] transition hover:bg-[#fff1ed] hover:text-[#7f2116]" type="button" onClick={handleLogout}>
                    <LogOut className="h-[17px] w-[17px]" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            <LanguageMenu
              className="z-40"
              buttonClassName="!min-h-9 !rounded-[8px] !border-[#dfe5da] !bg-white !text-[13px] !font-extrabold !text-[#263129] !shadow-[0_8px_20px_rgba(18,53,27,0.06)] hover:!border-[#c6923d]/55 hover:!bg-white hover:!shadow-[0_12px_24px_rgba(18,53,27,0.1)]"
              listClassName="!z-40"
            />
            <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded-[8px] border border-[#dfe5da] bg-white px-[14px] text-[13px] font-extrabold text-[#263129] shadow-[0_8px_20px_rgba(18,53,27,0.06)] transition hover:-translate-y-px hover:border-[#c6923d]/55 hover:shadow-[0_12px_24px_rgba(18,53,27,0.1)]" type="button">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              May 12 - May 18, 2024
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/:id" element={<RequestDetailPage />} />
          <Route path="subscribers" element={<SubscribersPage />} />
          <Route path="tour-packages" element={<TourPackagesPage />} />
          <Route path="tour-categories" element={<TourCategoriesPage />} />
          <Route path="tour-packages/new" element={<TourPackageBuilder />} />
          <Route path="tour-packages/:id/edit" element={<TourPackageBuilder />} />
          <Route path="affiliations" element={<AffiliationsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<DashboardPlaceholder />} />
        </Routes>
      </section>
    </main>
  );
}

function DashboardPlaceholder() {
  return (
    <article className={`${panelClass} ${emptyStateClass}`}>
      <Settings className="h-[42px] w-[42px] text-[#0b2a12]" aria-hidden="true" />
      <strong className="text-lg font-black text-[#0b2a12]">This dashboard section is coming next</strong>
      <span className="max-w-[420px] text-sm font-bold text-[#687265]">Use Tour packages for now while the other management pages are being built.</span>
      <Link className={primaryLinkClass} to="/dashboard/tour-packages">Open Tour Packages</Link>
    </article>
  );
}

function NotificationsDropdown({ notifications, onMarkAllRead, onMarkRead }) {
  return (
    <div className="absolute right-0 top-[calc(100%+10px)] z-20 w-[340px] rounded-xl border border-[#dce4d8] bg-white p-4 shadow-[0_18px_45px_rgba(10,35,17,0.16)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <strong className="text-sm text-[var(--deep-green)]">Notifications</strong>
        {notifications.length > 0 && (
          <button className="text-xs font-bold text-[#9a6414]" type="button" onClick={onMarkAllRead}>
            Mark all read
          </button>
        )}
      </div>
      <div className="grid max-h-[320px] gap-2 overflow-auto">
        {notifications.length === 0 ? (
          <p className="rounded-lg bg-[#f4f7f0] px-3 py-4 text-sm font-bold text-[#617064]">No unread notifications.</p>
        ) : (
          notifications.map((item) => (
            <article
              className="rounded-lg border border-[#d3a14e] bg-[#fff8eb] px-3 py-2 text-sm"
              key={item.id}
            >
              <strong className="block text-[var(--deep-green)]">{item.title}</strong>
              <span className="mt-1 block text-xs font-bold leading-5 text-[#617064]">{item.message}</span>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <time className="block text-[11px] font-bold uppercase text-[#9a6414]">{formatDate(item.created_at)}</time>
                <button className="text-[11px] font-bold text-[var(--deep-green)]" type="button" onClick={() => onMarkRead(item.id)}>
                  Mark read
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function DashboardOverview() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary({ showLoading = true } = {}) {
      if (showLoading) {
        setIsLoading(true);
      }
      setError("");

      try {
        const data = await getDashboardSummary();

        if (isMounted) {
          setSummary(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load dashboard summary");
        }
      } finally {
        if (isMounted && showLoading) {
          setIsLoading(false);
        }
      }
    }

    loadSummary();
    const refreshInterval = window.setInterval(() => loadSummary({ showLoading: false }), 15000);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
    };
  }, []);

  const metrics = buildContentMetrics(summary);
  const latestInquiries = summary?.latestInquiries || [];
  const recentBlogPosts = summary?.recentBlogPosts || [];

  return (
    <>
        {error && <p className={inlineErrorClass}>{error}</p>}
        {isLoading && <p className="mb-4 text-sm font-bold text-[#617064]">Loading dashboard data...</p>}
        <section className="mb-[14px] grid grid-cols-4 gap-[14px] max-[1500px]:grid-cols-4 max-[1200px]:grid-cols-2 max-[640px]:grid-cols-1" aria-label="Content metrics">
          {metrics.map(({ label, value, note, icon: Icon, meta, gold }) => (
            <article className="grid min-h-[118px] grid-cols-[48px_minmax(0,1fr)] content-center gap-x-[14px] gap-y-0.5 rounded-[8px] border border-[#e1e7dc] bg-white/95 px-[18px] py-4 shadow-[0_14px_30px_rgba(18,53,27,0.07)] max-[520px]:grid-cols-[42px_minmax(0,1fr)] max-[520px]:px-4" key={label}>
              <div className={`row-span-2 grid h-12 w-12 place-items-center rounded-full ${gold ? "bg-[#faedd6] text-[#bf790b]" : "bg-[#e6eee3] text-[#0f4923]"} max-[520px]:h-[42px] max-[520px]:w-[42px]`}>
                <Icon className="h-[22px] w-[22px] stroke-[1.9]" aria-hidden="true" />
              </div>
              <div>
                <p className="mb-1.5 text-[14px] font-semibold text-[#111812]">{label}</p>
                <strong className="block text-[28px] font-semibold leading-none text-[#070907]">{value}</strong>
                <span className="mt-[7px] block text-[13px] font-medium text-[#6d746f]">{note}</span>
              </div>
              <div className="col-span-full mt-2.5 flex flex-wrap gap-2 text-[12px] font-medium text-[#202b23]">
                {meta.map((item, index) => (
                  <span
                    className={`inline-flex items-center gap-[13px] ${item.tone === "green" ? "text-[#23763a]" : item.tone === "gold" ? "text-[#c47b10]" : ""}`}
                    key={`${label}-${item.label}`}
                  >
                    {index > 0 && <i className="h-1 w-1 rounded-full bg-[#a6aea5]" aria-hidden="true" />}
                    {item.label}: <strong>{item.value}</strong>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-2 gap-4 max-[1100px]:grid-cols-1">
          <article className={panelClass}>
            <div className="mb-[14px] flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="m-0 text-[17px] font-semibold text-[#102616]">Latest Enquiries</h2>
              </div>
              <Link className="text-[12px] font-bold text-[#a36a13]" to="/dashboard/bookings">View All</Link>
            </div>
            <div>
              {latestInquiries.map((enquiry) => (
                <article
                  className="grid grid-cols-[36px_minmax(0,0.78fr)_minmax(0,1.35fr)_auto] items-center gap-3 border-t border-[#edf1e9] py-2.5 first:border-t-0 max-[640px]:grid-cols-[32px_minmax(0,1fr)]"
                  key={enquiry.id}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e8f1e3] text-[#315a3c] max-[640px]:h-8 max-[640px]:w-8">
                    <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <strong className={`block truncate text-[13px] ${Number(enquiry.is_read) === 0 ? "font-black text-[#102616]" : "font-semibold text-[#263129]"}`}>{enquiry.name}</strong>
                    <span className={`block truncate text-[12px] ${Number(enquiry.is_read) === 0 ? "font-bold text-[#3f4c42]" : "font-medium text-[#6b756c]"}`}>{enquiry.inquiry}</span>
                  </div>
                  <div className="min-w-0 max-[640px]:col-span-2 max-[640px]:pl-11">
                    <span className={`block truncate text-[13px] ${Number(enquiry.is_read) === 0 ? "font-black text-[#102616]" : "font-semibold text-[#263129]"}`}>{getRequestSubject(enquiry, "Request")}</span>
                    <span className="block truncate text-[12px] font-medium text-[#6b756c]">{getRequestPreview(enquiry.inquiry, getRequestSubject(enquiry, "Request"))}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 max-[640px]:col-span-2 max-[640px]:justify-between max-[640px]:pl-11">
                    <time className="whitespace-nowrap text-[12px] font-semibold text-[#8a5b15]">{formatDate(enquiry.created_at)}</time>
                    <span className={statusBadgeClass(enquiry.status)}>
                      {formatStatus(enquiry.status)}
                    </span>
                  </div>
                </article>
              ))}
              {latestInquiries.length === 0 && <EmptySmall message="No travel requests yet." />}
            </div>
          </article>

          <article className={panelClass}>
            <div className="mb-[14px] flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="m-0 text-[17px] font-semibold text-[#102616]">Recent Blog Posts</h2>
              </div>
              <Link className="text-[12px] font-bold text-[#a36a13]" to="/dashboard/blogs">View All</Link>
            </div>
            <div>
              {recentBlogPosts.map((post) => (
                <article className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 border-t border-[#edf1e9] py-2.5 first:border-t-0 max-[640px]:grid-cols-[56px_minmax(0,1fr)]" key={post.id}>
                  {post.cover_image_url ? <img className="h-12 w-16 rounded-md object-cover" src={mediaPreviewUrl(post.cover_image_url)} alt="" /> : <FileText className="h-10 w-10 rounded-md bg-[#e8f1e3] p-2 text-[#315a3c]" aria-hidden="true" />}
                  <div className="min-w-0">
                    <strong className="block truncate text-[13px] font-semibold text-[#102616]">{post.title}</strong>
                  </div>
                  <div className="flex items-center justify-end gap-2 max-[640px]:col-span-2">
                    <time className="whitespace-nowrap text-[12px] font-semibold text-[#6b756c]">{formatDate(post.created_at)}</time>
                    <span className={statusBadgeClass(post.status)}>
                      {formatStatus(post.status)}
                    </span>
                  </div>
                </article>
              ))}
              {recentBlogPosts.length === 0 && <EmptySmall message="No blog posts created yet." />}
            </div>
          </article>
        </section>

        <section className="mt-4">
          <article className={panelClass}>
            <div className="mb-[14px] flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="m-0 text-[17px] font-semibold text-[#102616]">Quick Actions</h2>
              </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
              {quickActions.map(({ href, label, icon: Icon }) => (
                <Link
                  className="flex min-h-[76px] items-center gap-3 rounded-[8px] border border-[#dfe5da] bg-[#fbfcfa] px-[14px] py-3 text-[13px] font-black text-[#102616] transition hover:-translate-y-px hover:border-[#c6923d]/55 hover:bg-white hover:shadow-[0_12px_24px_rgba(18,53,27,0.1)]"
                  to={href}
                  key={label}
                >
                  <Icon className="h-5 w-5 text-[#c6923d]" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </article>
        </section>
    </>
  );
}

function TourPackagesPage() {
  const [error, setError] = useState("");
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadTours() {
      setIsLoading(true);
      setError("");

      try {
        const tours = await listTours({ limit: 100 });

        if (isMounted) {
          setPackages(Array.isArray(tours) ? tours : []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load tour packages");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTours();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleDeleteTour(tour) {
    const confirmed = window.confirm(`Delete "${tour.name}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setError("");
    setIsDeletingId(tour.id);

    try {
      await deleteTour(tour.id);
      setPackages((current) => current.filter((item) => item.id !== tour.id));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete tour package");
    } finally {
      setIsDeletingId(null);
    }
  }

  return (
    <section className="grid gap-4" aria-label="Tour packages">
      <div className={sectionHeadingClass}>
        <div>
          {sectionEyebrow("Tour packages")}
          <h2 className="m-0 text-[clamp(26px,2.5vw,38px)] font-semibold leading-tight text-[#0d3518]">Manage Tour Packages</h2>
          <p className="mt-2 text-sm font-medium text-[#687265]">View the tour packages stored in the database and create new safari experiences.</p>
        </div>
        <Link className={primaryLinkClass} to="/dashboard/tour-packages/new">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create New Tour Package
        </Link>
      </div>

      <article className={`${panelClass} grid gap-3 p-[17px_20px]`}>
        <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="m-0 text-[17px] font-semibold text-[#102616]">All Tour Packages</h2>
            <p className="mt-1 text-sm font-medium text-[#687265]">{isLoading ? "Loading packages..." : `${packages.length} packages found`}</p>
          </div>
        </div>

        {error && <p className={inlineErrorClass}>{error}</p>}

        {!error && isLoading && (
          <div className={emptyStateClass}>
            <Package className="h-[42px] w-[42px] text-[#0b2a12]" aria-hidden="true" />
            <strong className="text-lg font-black text-[#0b2a12]">Loading tour packages</strong>
            <span className="max-w-[420px] text-sm font-bold text-[#687265]">Please wait while we fetch the latest data.</span>
          </div>
        )}

        {!error && !isLoading && packages.length === 0 && (
          <div className={emptyStateClass}>
            <Package className="h-[42px] w-[42px] text-[#0b2a12]" aria-hidden="true" />
            <strong className="text-lg font-black text-[#0b2a12]">No tour packages yet</strong>
            <span className="max-w-[420px] text-sm font-bold text-[#687265]">Create your first package to start building the catalogue.</span>
            <Link className={primaryLinkClass} to="/dashboard/tour-packages/new">Create Package</Link>
          </div>
        )}

        {!error && !isLoading && packages.length > 0 && (
          <div className={tableWrapClass}>
            <table className={tableClass}>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((tour) => (
                  <tr key={tour.id}>
                    <td>
                      <div className="flex min-w-[250px] items-center gap-3">
                        <span className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-md bg-[#e9f0e7] text-[#0c3b1a]">
                          {tour.cover_image_url ? (
                            <img className="h-full w-full object-cover" src={mediaPreviewUrl(tour.cover_image_url)} alt="" />
                          ) : (
                            <Package className="h-5 w-5" aria-hidden="true" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <strong className="block truncate text-[13px] font-semibold text-[#102616]">{tour.name}</strong>
                          <small className="mt-0.5 block truncate text-[12px] font-medium text-[#6a756d]">{plainTextSummary(tour.description, 72) || tour.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>{tour.category_name || "Uncategorized"}</td>
                    <td>{formatDuration(tour)}</td>
                    <td>
                      <span className={statusBadgeClass(tour.status || "draft")}>
                        {tour.status || "draft"}
                      </span>
                    </td>
                    <td>{formatDate(tour.created_at)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#dce4d8] bg-white text-[#0c3b1a] transition hover:border-[#d3a14e] hover:text-[#a36a13]"
                          to={`/dashboard/tour-packages/${tour.id}/edit`}
                          aria-label={`Edit ${tour.name}`}
                        >
                          <PenLine className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-white text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          disabled={isDeletingId === tour.id}
                          onClick={() => handleDeleteTour(tour)}
                          aria-label={`Delete ${tour.name}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}

function TourCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ description: "", name: "", status: "active" });
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return loadRows(listTourCategories, setCategories, setIsLoading, setError);
  }, []);

  function resetCategoryForm() {
    setEditingCategoryId(null);
    setForm({ description: "", name: "", status: "active" });
    setIsCreating(false);
  }

  function handleCreateNew() {
    setEditingCategoryId(null);
    setForm({ description: "", name: "", status: "active" });
    setIsCreating(true);
  }

  function handleEditCategory(category) {
    setEditingCategoryId(category.id);
    setForm({
      description: category.description || "",
      name: category.name || "",
      status: category.status || "active",
    });
    setIsCreating(true);
  }

  async function handleSaveCategory(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const payload = {
        description: form.description,
        name: form.name,
        slug: slugify(form.name),
        status: form.status,
      };
      const savedCategory = editingCategoryId
        ? await updateTourCategory(editingCategoryId, payload)
        : await createTourCategory(payload);

      setCategories((current) => {
        if (editingCategoryId) {
          return current.map((item) => (item.id === editingCategoryId ? { ...item, ...savedCategory } : item));
        }

        return [...current, savedCategory].sort((a, b) => a.name.localeCompare(b.name));
      });
      resetCategoryForm();
    } catch (saveError) {
      setError(saveError.message || "Unable to save tour category");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(id, status) {
    setError("");

    try {
      const updated = await updateTourCategory(id, { status });
      setCategories((current) => current.map((item) => (item.id === id ? { ...item, ...updated } : item)));
    } catch (statusError) {
      setError(statusError.message || "Unable to update category status");
    }
  }

  async function handleDeleteCategory(category) {
    const confirmed = window.confirm(`Delete "${category.name}"? Tours using this category will keep working without a category.`);

    if (!confirmed) return;

    setError("");

    try {
      await deleteTourCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete tour category");
    }
  }

  return (
    <section className="grid gap-4" aria-label="Tour categories">
      <div className={sectionHeadingClass}>
        <div>
          {sectionEyebrow("Tour packages")}
          <h2 className="m-0 text-[clamp(26px,2.5vw,38px)] font-semibold leading-tight text-[#0d3518]">Tour Categories</h2>
          <p className="mt-2 text-sm font-medium text-[#687265]">Manage the categories used when creating and organizing tour packages.</p>
        </div>
        <button
          className={primaryLinkClass}
          type="button"
          onClick={() => {
            if (isCreating) {
              resetCategoryForm();
              return;
            }

            handleCreateNew();
          }}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {isCreating ? "Back to Categories" : "Create Category"}
        </button>
      </div>

      {isCreating && (
        <form className={`${panelClass} mb-2 grid gap-4`} onSubmit={handleSaveCategory}>
          <h3 className="text-xl font-bold text-[var(--deep-green)]">
            {editingCategoryId ? "Edit Tour Category" : "Create Tour Category"}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className={formLabelClass}>
              Category Name
              <input
                className={formInputClass}
                placeholder="Wildlife Tours"
                value={form.name}
                onChange={(event) => setFormValue(setForm, "name", event.target.value)}
                required
              />
            </label>
            <label className={formLabelClass}>
              Status
              <select
                className={formInputClass}
                value={form.status}
                onChange={(event) => setFormValue(setForm, "status", event.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
          <label className={formLabelClass}>
            Description
            <textarea
              className={`${formInputClass} min-h-[110px] resize-y`}
              placeholder="Short description for this tour package category"
              value={form.description}
              onChange={(event) => setFormValue(setForm, "description", event.target.value)}
            />
          </label>
          <div className="flex flex-wrap justify-end gap-3">
            <button className={secondaryLinkClass} type="button" onClick={resetCategoryForm}>
              Cancel
            </button>
            <button className={primaryLinkClass} type="submit" disabled={isSaving}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {isSaving ? "Saving..." : editingCategoryId ? "Save Changes" : "Save Category"}
            </button>
          </div>
        </form>
      )}

      <DashboardListPage
        title="All Tour Categories"
        description="Stored tour package categories from the database."
        emptyIcon={Tags}
        emptyTitle="No tour categories yet"
        emptyText="Create categories like Wildlife, Culture, Adventure, or Educational to organize tour packages."
        error={error}
        isLoading={isLoading}
        rows={categories}
      >
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <strong className="block min-w-[190px] text-[13px] font-semibold text-[#102616]">{category.name}</strong>
                  </td>
                  <td className="text-[#6c766e]">/{category.slug}</td>
                  <td>
                    <span className="block max-w-[520px] whitespace-normal text-[13px] font-medium leading-6 text-[#4e5a51]">
                      {category.description || "No description added."}
                    </span>
                  </td>
                  <td>
                    <select
                      className={requestStatusClass}
                      value={category.status}
                      onChange={(event) => handleStatusChange(category.id, event.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="text-[#6c766e]">{formatDate(category.created_at)}</td>
                  <td>
                    <div className={tableActionClass}>
                      <button
                        className={secondaryLinkClass}
                        type="button"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </button>
                      <button
                        className={dangerLinkClass}
                        type="button"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardListPage>
    </section>
  );
}

function BookingsPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trip-plans");

  useEffect(() => {
    let isMounted = true;

    async function loadRequests({ showLoading = true } = {}) {
      if (showLoading) {
        setIsLoading(true);
      }
      setError("");

      try {
        const rows = await listInquiries({ limit: 200 });

        if (isMounted) {
          setRequests(Array.isArray(rows) ? rows : []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load requests");
        }
      } finally {
        if (isMounted && showLoading) {
          setIsLoading(false);
        }
      }
    }

    loadRequests();
    const refreshInterval = window.setInterval(() => loadRequests({ showLoading: false }), 15000);

    return () => {
      isMounted = false;
      window.clearInterval(refreshInterval);
    };
  }, []);

  const requestGroups = buildRequestGroups(requests);
  const activeRequests = requestGroups[activeTab]?.items || [];

  async function handleStatusChange(id, status) {
    const updated = await updateInquiryStatus(id, status);
    setRequests((current) => current.map((item) => (item.id === id ? updated : item)));
  }

  return (
    <DashboardListPage
      title="Requests"
      eyebrow="Front-page requests"
      description="Travel requests and enquiries submitted from the public website."
      emptyIcon={Mail}
      emptyTitle="No travel requests yet"
      emptyText="When visitors send travel requests from the website, they will appear here."
      error={error}
      isLoading={isLoading}
      rows={requests}
    >
      <div className="mb-4 flex flex-wrap gap-2 border-b border-[#e4eadf] pb-[15px]" role="tablist" aria-label="Request types">
        {requestTabConfig.map((tab) => (
          <button
            className={`inline-flex min-h-[44px] items-center gap-3 rounded-[8px] border px-4 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-[#0b2a12] bg-[#0b2a12] text-white"
                : "border-[#dfe5da] bg-white text-[#263129] hover:border-[#c6923d]/55"
            }`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            {(requestGroups[tab.id]?.count || 0) > 0 && (
              <em className={`grid h-6 min-w-6 place-items-center rounded-full px-2 text-xs not-italic ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-[#edf1ee] text-[#263129]"
              }`}>
                {requestGroups[tab.id].count}
              </em>
            )}
          </button>
        ))}
      </div>

      {activeRequests.length > 0 ? (
        <div className="overflow-hidden rounded-[8px] border border-[#e1e7dc]">
          {activeRequests.map((request) => {
            const subject = getRequestSubject(request, requestGroups[activeTab].label);
            const preview = getRequestPreview(request.inquiry, subject);
            const isUnread = Number(request.is_read) === 0;

            return (
              <article
                className={`border-b border-[#e4eadf] bg-white px-4 py-3 last:border-b-0 ${isUnread ? "text-[#15251a]" : "text-[#566158]"}`}
                key={request.id}
              >
                <div className="grid grid-cols-[12px_minmax(180px,0.85fr)_minmax(260px,1.9fr)_auto] items-center gap-4 max-[900px]:grid-cols-[12px_minmax(0,1fr)_auto] max-[640px]:grid-cols-[12px_minmax(0,1fr)]">
                  <span className={`h-2 w-2 rounded-full ${isUnread ? "bg-[#d92d20]" : "bg-[#d2dbd2]"}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <strong className={`block truncate text-[13px] ${isUnread ? "font-black" : "font-semibold"}`}>{request.name}</strong>
                    <span className={`block truncate text-[12px] ${isUnread ? "font-bold" : "font-medium"} text-[#6c766e]`}>{request.email}</span>
                  </div>
                  <Link
                    className="min-w-0 hover:text-[#a36a13] max-[900px]:col-span-2 max-[900px]:col-start-2"
                    to={`/dashboard/bookings/${request.id}`}
                  >
                    <strong className={`block truncate text-[13px] ${isUnread ? "font-black text-[#111812]" : "font-semibold text-[#263129]"}`}>{subject}</strong>
                    <span className={`block truncate text-[12px] ${isUnread ? "font-bold text-[#3f4c42]" : "font-medium text-[#747d75]"}`}>{preview}</span>
                  </Link>
                  <div className="flex items-center justify-end gap-3 max-[900px]:col-span-3 max-[900px]:justify-end max-[640px]:col-span-2 max-[640px]:flex-wrap">
                    <select
                      className={requestStatusClass}
                      value={request.status}
                      onChange={(event) => handleStatusChange(request.id, event.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In progress</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                    </select>
                    <time className="whitespace-nowrap text-[12px] font-semibold uppercase text-[#a36a13]">{formatDate(request.created_at)}</time>
                    <Link className="inline-flex min-h-[34px] items-center justify-center rounded-md border border-[#dfe5da] bg-white px-3 text-[12px] font-black text-[#233126] transition hover:border-[#c6923d]/55 hover:text-[#c6923d]" to={`/dashboard/bookings/${request.id}`}>
                      Open
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Mail}
          title={`No ${requestGroups[activeTab].label.toLowerCase()} yet`}
          text={`When visitors send ${requestGroups[activeTab].label.toLowerCase()}, they will appear here.`}
        />
      )}
    </DashboardListPage>
  );
}

const defaultAffiliationLogos = {
  atta: attaLogo,
  rtta: rttaLogo,
  "visit-rwanda": visitRwandaLogo,
};

const emptyAffiliationForm = {
  logo_url: "",
  name: "",
  slug: "",
  sort_order: 0,
  status: "active",
  website_url: "",
};

function AffiliationsPage() {
  const [affiliations, setAffiliations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyAffiliationForm);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return loadRows(listAffiliations, setAffiliations, setIsLoading, setError);
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(emptyAffiliationForm);
    setError("");
    setIsCreating(false);
  }

  function handleCreateNew() {
    setEditingId(null);
    setForm({ ...emptyAffiliationForm, sort_order: affiliations.length + 1 });
    setError("");
    setIsCreating(true);
  }

  function handleEdit(affiliation) {
    setEditingId(affiliation.id);
    setForm({
      logo_url: affiliation.logo_url || "",
      name: affiliation.name || "",
      slug: affiliation.slug || "",
      sort_order: Number(affiliation.sort_order || 0),
      status: affiliation.status || "active",
      website_url: affiliation.website_url || "",
    });
    setError("");
    setIsCreating(true);
  }

  async function handleLogoUpload(file) {
    if (!file) return;

    setError("");
    setIsUploading(true);

    try {
      const result = await uploadAffiliationLogo(file);
      if (!result.file?.url) throw new Error("The logo uploaded, but no file URL was returned.");
      setFormValue(setForm, "logo_url", result.file.url);
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload affiliation logo");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!form.logo_url && !editingId) {
      setError("Please upload a logo before saving this affiliation.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const payload = {
        logo_url: form.logo_url,
        name: form.name.trim(),
        slug: editingId ? form.slug : slugify(form.name),
        sort_order: Number(form.sort_order || 0),
        status: form.status,
        website_url: form.website_url.trim(),
      };
      const saved = editingId
        ? await updateAffiliation(editingId, payload)
        : await createAffiliation(payload);

      setAffiliations((current) => sortAffiliations(
        editingId
          ? current.map((item) => (item.id === editingId ? { ...item, ...saved } : item))
          : [...current, saved],
      ));
      resetForm();
    } catch (saveError) {
      setError(saveError.message || "Unable to save affiliation");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(id, status) {
    setError("");

    try {
      const updated = await updateAffiliation(id, { status });
      setAffiliations((current) => current.map((item) => (item.id === id ? { ...item, ...updated } : item)));
    } catch (statusError) {
      setError(statusError.message || "Unable to update affiliation status");
    }
  }

  async function handleDelete(affiliation) {
    if (!window.confirm(`Remove "${affiliation.name}" from affiliations?`)) return;

    setError("");
    try {
      await deleteAffiliation(affiliation.id);
      setAffiliations((current) => current.filter((item) => item.id !== affiliation.id));
      if (editingId === affiliation.id) resetForm();
    } catch (deleteError) {
      setError(deleteError.message || "Unable to remove affiliation");
    }
  }

  const formLogo = mediaPreviewUrl(form.logo_url) || defaultAffiliationLogos[form.slug || slugify(form.name)];

  return (
    <section className="grid gap-4" aria-label="Affiliations">
      <div className={sectionHeadingClass}>
        <div>
          {sectionEyebrow("Website content")}
          <h2 className="m-0 text-[clamp(26px,2.5vw,38px)] font-semibold leading-tight text-[#0d3518]">Partners &amp; Affiliations</h2>
          <p className="mt-2 text-sm font-medium text-[#687265]">Manage the partner logos displayed near the bottom of the homepage.</p>
        </div>
        <button
          className={primaryLinkClass}
          type="button"
          onClick={() => (isCreating ? resetForm() : handleCreateNew())}
        >
          {isCreating ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
          {isCreating ? "Back to Affiliations" : "Add Affiliation"}
        </button>
      </div>

      {isCreating && (
        <form className={`${panelClass} grid gap-5`} onSubmit={handleSave}>
          <div>
            <h3 className="text-xl font-bold text-[#0b2a12]">{editingId ? "Edit Affiliation" : "Add Affiliation"}</h3>
            <p className="mt-1 text-[13px] font-medium text-[#687265]">Upload a clear logo with a transparent or white background for the best result.</p>
          </div>

          {error && <p className={inlineErrorClass}>{error}</p>}

          <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="grid gap-2 text-sm font-bold text-[#0b2a12]">
              <span>Logo</span>
              <label
                className="grid min-h-[210px] cursor-pointer place-items-center content-center gap-3 rounded-[8px] border border-dashed border-[#cfd9cb] bg-[#f8faf6] p-5 text-center transition hover:border-[#d3a14e]"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleLogoUpload(event.dataTransfer.files?.[0]);
                }}
              >
                {formLogo ? (
                  <img className="h-[120px] w-[180px] object-contain" src={formLogo} alt="Affiliation preview" />
                ) : (
                  <ImagePlus className="h-10 w-10 text-[#315a3c]" aria-hidden="true" />
                )}
                <span className="text-[12px] font-bold text-[#687265]">
                  {isUploading ? "Uploading logo..." : "Click or drag an image here"}
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  disabled={isUploading}
                  onChange={(event) => {
                    handleLogoUpload(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>
            </div>

            <div className="grid content-start gap-4 sm:grid-cols-2">
              <label className={`${formLabelClass} sm:col-span-2`}>
                Organization Name
                <input
                  className={formInputClass}
                  placeholder="Tourism organization"
                  value={form.name}
                  onChange={(event) => setFormValue(setForm, "name", event.target.value)}
                  required
                />
              </label>
              <label className={`${formLabelClass} sm:col-span-2`}>
                Website URL
                <input
                  className={formInputClass}
                  placeholder="https://example.com"
                  type="url"
                  value={form.website_url}
                  onChange={(event) => setFormValue(setForm, "website_url", event.target.value)}
                />
              </label>
              <label className={formLabelClass}>
                Display Order
                <input
                  className={formInputClass}
                  min="0"
                  type="number"
                  value={form.sort_order}
                  onChange={(event) => setFormValue(setForm, "sort_order", event.target.value)}
                />
              </label>
              <label className={formLabelClass}>
                Status
                <select className={formInputClass} value={form.status} onChange={(event) => setFormValue(setForm, "status", event.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button className={secondaryLinkClass} type="button" onClick={resetForm}>Cancel</button>
            <button className={primaryLinkClass} type="submit" disabled={isSaving || isUploading}>
              {isSaving ? "Saving..." : editingId ? "Save Changes" : "Add Affiliation"}
            </button>
          </div>
        </form>
      )}

      {!isCreating && (
        <DashboardListPage
          title="All Affiliations"
          description="Active affiliations are shown on the homepage in this display order."
          emptyIcon={Handshake}
          emptyTitle="No affiliations yet"
          emptyText="Add a tourism partner to display it on the homepage."
          error={error}
          isLoading={isLoading}
          rows={affiliations}
        >
          <div className={tableWrapClass}>
            <table className={tableClass}>
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Organization</th>
                  <th>Website</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliations.map((affiliation) => {
                  const logo = mediaPreviewUrl(affiliation.logo_url) || defaultAffiliationLogos[affiliation.slug];

                  return (
                    <tr key={affiliation.id}>
                      <td>
                        <div className="grid h-14 w-20 place-items-center overflow-hidden rounded-md border border-[#e1e7dc] bg-white p-1.5">
                          {logo ? <img className="h-full w-full object-contain" src={logo} alt="" /> : <ImagePlus className="h-6 w-6 text-[#809083]" aria-hidden="true" />}
                        </div>
                      </td>
                      <td><strong className="block min-w-[210px] text-[13px] font-semibold text-[#102616]">{affiliation.name}</strong></td>
                      <td>
                        {affiliation.website_url ? (
                          <a className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#855113] hover:text-[#0b2a12]" href={normalizeExternalHref(affiliation.website_url)} target="_blank" rel="noreferrer">
                            Visit website <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : <span className="text-[12px] font-medium text-[#7b857d]">Not added</span>}
                      </td>
                      <td>{affiliation.sort_order}</td>
                      <td>
                        <select className={requestStatusClass} value={affiliation.status} onChange={(event) => handleStatusChange(affiliation.id, event.target.value)}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td>
                        <div className={tableActionClass}>
                          <button className={secondaryLinkClass} type="button" onClick={() => handleEdit(affiliation)}>Edit</button>
                          <button className={dangerLinkClass} type="button" onClick={() => handleDelete(affiliation)}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DashboardListPage>
      )}
    </section>
  );
}

function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return loadRows(listSubscribers, setSubscribers, setIsLoading, setError);
  }, []);

  async function handleStatusChange(id, status) {
    const updated = await updateSubscriberStatus(id, status);
    setSubscribers((current) => current.map((item) => (item.id === id ? updated : item)));
  }

  return (
    <DashboardListPage
      title="Subscribers"
      eyebrow="Audience"
      description="Emails collected from the newsletter subscription form."
      emptyIcon={Mail}
      emptyTitle="No subscribers yet"
      emptyText="When visitors subscribe from the website, their emails will appear here."
      error={error}
      isLoading={isLoading}
      rows={subscribers}
    >
      <div className="overflow-hidden rounded-[8px] border border-[#e1e7dc]">
        {subscribers.map((subscriber) => (
          <article className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-[#edf1e9] bg-white px-4 py-3 last:border-b-0 max-[640px]:grid-cols-1" key={subscriber.id}>
            <div className="min-w-0">
              <strong className="block truncate text-[13px] font-semibold text-[#102616]">{subscriber.email}</strong>
              <span className="mt-1 block text-[12px] font-medium text-[#6c766e]">{subscriber.source || "website"}</span>
            </div>
            <div className="flex items-center justify-end gap-3 max-[640px]:justify-start">
              <time className="whitespace-nowrap text-[12px] font-semibold uppercase text-[#a36a13]">{formatDate(subscriber.created_at)}</time>
              <select
                className={requestStatusClass}
                value={subscriber.status}
                onChange={(event) => handleStatusChange(subscriber.id, event.target.value)}
              >
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
            </div>
          </article>
        ))}
      </div>
    </DashboardListPage>
  );
}

function RequestDetailPage() {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return loadRows((params) => listInquiries({ ...params, limit: 500 }), setRequests, setIsLoading, setError);
  }, []);

  const request = requests.find((item) => String(item.id) === String(id));
  const requestType = request ? getRequestType(request) : "inquiries";
  const typeLabel = requestTabConfig.find((tab) => tab.id === requestType)?.label || "Request";
  const subject = request ? getRequestSubject(request, typeLabel) : "Request";

  useEffect(() => {
    if (!request || Number(request.is_read) !== 0) {
      return;
    }

    let isMounted = true;

    async function markRead() {
      try {
        const updated = await markInquiryRead(request.id);

        if (isMounted) {
          setRequests((current) => current.map((item) => (item.id === request.id ? updated : item)));
          window.dispatchEvent(new CustomEvent("imigani:request-read"));
        }
      } catch {
        // Keep the detail page usable even if the read-state update fails.
      }
    }

    markRead();

    return () => {
      isMounted = false;
    };
  }, [request]);

  async function handleStatusChange(status) {
    if (!request) return;

    const updated = await updateInquiryStatus(request.id, status);
    setRequests((current) => current.map((item) => (item.id === request.id ? updated : item)));
  }

  return (
    <section className="grid gap-4" aria-label="Request details">
      <div className={sectionHeadingClass}>
        <div>
          {sectionEyebrow("Requests")}
          <h2 className="m-0 text-[clamp(26px,2.5vw,38px)] font-semibold leading-tight text-[#0d3518]">Request Details</h2>
          <p className="mt-2 text-sm font-medium text-[#687265]">Read the full message and update its response status.</p>
        </div>
        <Link className={secondaryLinkClass} to="/dashboard/bookings">
          Back to Requests
        </Link>
      </div>

      <article className={panelClass}>
        {error && <p className={inlineErrorClass}>{error}</p>}
        {!error && isLoading && (
          <EmptyState icon={Mail} title="Loading request" text="Please wait while we fetch the request details." />
        )}
        {!error && !isLoading && !request && (
          <EmptyState icon={Mail} title="Request not found" text="This request could not be found in the database." />
        )}
        {!error && !isLoading && request && (
          <div className="grid gap-5">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e4eadf] pb-5">
              <div>
                <span className="mb-2 inline-flex rounded-full bg-[#edf3eb] px-3 py-1 text-[11px] font-black uppercase text-[#a36a13]">{typeLabel}</span>
                <h3 className="m-0 text-[22px] font-semibold leading-tight text-[#102616]">{subject}</h3>
                <p className="mt-2 text-sm font-semibold text-[#4c574f]">{request.name}</p>
                <a className="mt-1 block text-sm font-semibold text-[#4c574f] hover:text-[#a36a13]" href={`mailto:${request.email}`}>{request.email}</a>
                {request.phone && <a className="mt-1 block text-sm font-semibold text-[#4c574f] hover:text-[#a36a13]" href={`tel:${request.phone}`}>{request.phone}</a>}
              </div>
              <div className="flex flex-col items-end gap-2 max-[640px]:items-start">
                <select
                  className={requestStatusClass}
                  value={request.status}
                  onChange={(event) => handleStatusChange(event.target.value)}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In progress</option>
                  <option value="responded">Responded</option>
                  <option value="closed">Closed</option>
                </select>
                <time className="text-[12px] font-semibold uppercase text-[#a36a13]">{formatDate(request.created_at)}</time>
              </div>
            </div>
            <div className="min-h-[240px] whitespace-pre-wrap rounded-[8px] border border-[#e4eadf] bg-[#fbfcfa] px-5 py-4 text-[15px] font-medium leading-8 text-[#2f3a33]">{request.inquiry}</div>
          </div>
        )}
      </article>
    </section>
  );
}

const requestTabConfig = [
  { id: "trip-plans", label: "Trip Plans" },
  { id: "inquiries", label: "Inquiries" },
  { id: "consultancy", label: "Consultancy" },
];

function buildRequestGroups(requests = []) {
  return requestTabConfig.reduce((groups, tab) => {
    const items = requests.filter((request) => getRequestType(request) === tab.id);

    return {
      ...groups,
      [tab.id]: {
        count: items.filter((item) => Number(item.is_read) === 0).length,
        items,
        label: tab.label,
      },
    };
  }, {});
}

function getRequestType(request = {}) {
  const inquiry = String(request.inquiry || "").trim().toLowerCase();

  if (inquiry.startsWith("plan your visit request")) return "trip-plans";
  if (inquiry.startsWith("tour consultancy request")) return "consultancy";

  return "inquiries";
}

function getRequestSubject(request = {}, fallback = "Request") {
  const lines = String(request.inquiry || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const subjectLine = lines.find((line) => line.toLowerCase().startsWith("subject:"));

  if (subjectLine) return subjectLine.replace(/^subject:\s*/i, "");
  if (lines[0]) return lines[0];

  return fallback;
}

function getRequestPreview(message = "", subject = "") {
  const cleaned = String(message || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line !== subject && !line.toLowerCase().startsWith("subject:"))
    .join(" ");

  return cleaned || "Open message to view details.";
}

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return loadRows(listReviews, setReviews, setIsLoading, setError);
  }, []);

  async function handleStatusChange(id, status) {
    const updated = await updateReview(id, { status });
    setReviews((current) => current.map((item) => (item.id === id ? updated : item)));
  }

  async function handleDelete(id) {
    await deleteReview(id);
    setReviews((current) => current.filter((item) => item.id !== id));
  }

  return (
    <DashboardListPage
      title="Reviews"
      eyebrow="Guest feedback"
      description="Approve, reject, or remove tour reviews from the database."
      emptyIcon={Star}
      emptyTitle="No reviews yet"
      emptyText="Reviews submitted by guests will appear here once they exist in the database."
      error={error}
      isLoading={isLoading}
      rows={reviews}
    >
      {reviews.map((review) => (
        <article className="rounded-lg border border-[#dce4d8] bg-white p-4" key={review.id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--deep-green)]">{review.name}</h3>
              <p className="mt-1 text-sm font-bold text-[#d3a14e]">{"★".repeat(Number(review.rating || 0))}</p>
            </div>
            <div className="flex gap-2">
              <select
                className={requestStatusClass}
                value={review.status}
                onChange={(event) => handleStatusChange(review.id, event.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className={dangerLinkClass} type="button" onClick={() => handleDelete(review.id)}>
                Delete
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm font-bold leading-6 text-[#3f4c42]">{review.review}</p>
        </article>
      ))}
    </DashboardListPage>
  );
}

function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ content: "", cover_image_url: "", title: "" });
  const [editingPostId, setEditingPostId] = useState(null);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    return loadRows(listBlogPosts, setPosts, setIsLoading, setError);
  }, []);

  function resetBlogForm() {
    setForm({ content: "", cover_image_url: "", title: "" });
    setEditingPostId(null);
    setUploadError("");
    setIsCreating(false);
  }

  function handleCreateNew() {
    setForm({ content: "", cover_image_url: "", title: "" });
    setEditingPostId(null);
    setUploadError("");
    setIsCreating(true);
  }

  function handleEditPost(post) {
    setForm({
      content: post.content || "",
      cover_image_url: post.cover_image_url || "",
      title: post.title || "",
    });
    setEditingPostId(post.id);
    setUploadError("");
    setIsCreating(true);
  }

  async function handleSavePost(event, status) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const payload = {
        content: form.content,
        cover_image_url: form.cover_image_url,
        status,
        title: form.title,
      };
      const post = editingPostId
        ? await updateBlogPost(editingPostId, payload)
        : await createBlogPost(payload);

      setPosts((current) => {
        if (editingPostId) {
          return current.map((item) => (item.id === editingPostId ? { ...item, ...post } : item));
        }

        return [post, ...current];
      });
      resetBlogForm();
    } catch (saveError) {
      setError(saveError.message || "Unable to save blog post");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    await deleteBlogPost(id);
    setPosts((current) => current.filter((item) => item.id !== id));
  }

  async function handleStatusChange(id, status) {
    setError("");

    try {
      const updatedPost = await updateBlogPost(id, { status });
      setPosts((current) => current.map((item) => (item.id === id ? { ...item, ...updatedPost } : item)));
    } catch (statusError) {
      setError(statusError.message || "Unable to update blog status");
    }
  }

  async function handleImageUpload(file) {
    if (!file) return;

    setUploadError("");
    setIsUploadingImage(true);

    try {
      const result = await uploadBlogImage(file, { folder: "blog-posts" });

      if (result.file?.url) {
        setFormValue(setForm, "cover_image_url", result.file.url);
        return;
      }

      setUploadError("The image uploaded, but no file URL was returned.");
    } catch (uploadImageError) {
      setUploadError(uploadImageError.message || "Unable to upload cover image");
    } finally {
      setIsUploadingImage(false);
    }
  }

  return (
    <section className="grid gap-4" aria-label="Blog posts">
      <div className={sectionHeadingClass}>
        <div>
          <h2 className="m-0 text-[clamp(26px,2.5vw,38px)] font-semibold leading-tight text-[#0d3518]">Blog Posts</h2>
        </div>
        <button
          className={primaryLinkClass}
          type="button"
          onClick={() => {
            if (isCreating) {
              resetBlogForm();
              return;
            }

            handleCreateNew();
          }}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {isCreating ? "Back to Posts" : "Create New Post"}
        </button>
      </div>

      {isCreating && (
        <form className={`${panelClass} mb-2 grid gap-4`} onSubmit={(event) => handleSavePost(event, "draft")}>
          <h3 className="text-xl font-bold text-[var(--deep-green)]">
            {editingPostId ? "Edit Blog Post" : "Create Blog Post"}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className={formLabelClass}>
              Title
              <input className={formInputClass} placeholder="Blog title" value={form.title} onChange={(event) => setFormValue(setForm, "title", event.target.value)} required />
            </label>
            <div className="grid gap-2 text-sm font-bold text-[var(--deep-green)]">
              <span>Cover Image</span>
              <label
                className="grid min-h-[116px] cursor-pointer grid-cols-[140px_minmax(0,1fr)] items-center gap-4 rounded-lg border border-[#dce4d8] bg-[#fbfcfa] p-3 transition hover:border-[#d3a14e] max-sm:grid-cols-1"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleImageUpload(event.dataTransfer.files?.[0]);
                }}
              >
                <div className="grid h-[94px] place-items-center overflow-hidden rounded-md bg-[#e9f0e7] text-[#0c3b1a] max-sm:h-[170px]">
                  {form.cover_image_url ? (
                    <img className="h-full w-full object-cover" src={mediaPreviewUrl(form.cover_image_url)} alt="" />
                  ) : (
                    <ImagePlus className="h-9 w-9" aria-hidden="true" />
                  )}
                </div>
                <div className="grid gap-1">
                  <strong className="text-[13px] font-black text-[#142319]">
                    {isUploadingImage ? "Uploading cover image..." : "Drag and drop or click to upload"}
                  </strong>
                  <span className="text-[12px] font-bold text-[#687265]">JPG, PNG, WebP or GIF. Max size 5MB</span>
                  {form.cover_image_url && <span className="text-[12px] font-bold text-[#0c4a23]">Image uploaded</span>}
                </div>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => {
                    handleImageUpload(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>
              {uploadError && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">{uploadError}</p>}
            </div>
          </div>
          <div className="grid gap-2 text-sm font-bold text-[var(--deep-green)]">
            <span>Content</span>
            <RichTextEditor
              key={editingPostId || "new-blog-post"}
              value={form.content}
              onChange={(value) => setFormValue(setForm, "content", value)}
              placeholder="Write the full blog story. You can use headings, bold text, lists, italic text, and links."
              minHeightClass="min-h-[260px]"
            />
          </div>
          <div className="flex flex-wrap justify-end gap-3">
              <button
                className={secondaryLinkClass}
                type="button"
                onClick={resetBlogForm}
              >
                Cancel
              </button>
              <button className={secondaryLinkClass} type="submit" disabled={isSaving || isUploadingImage}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
              <button
                className={primaryLinkClass}
                type="button"
                disabled={isSaving || isUploadingImage}
                onClick={(event) => handleSavePost(event, "published")}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {isSaving ? "Publishing..." : "Publish"}
              </button>
          </div>
        </form>
      )}

      <article className={`${panelClass} grid gap-3`}>
        {error && <p className={inlineErrorClass}>{error}</p>}
        {!error && isLoading && <EmptyState icon={FileText} title="Loading blog posts" text="Please wait while we fetch the latest posts." />}
        {!error && !isLoading && posts.length === 0 && (
          <EmptyState icon={FileText} title="No blog posts yet" text="Use the Create New Post button above to add the first blog story." />
        )}
        {!error &&
          !isLoading &&
          posts.length > 0 &&
          posts.map((post) => (
            <article className="rounded-lg border border-[#dce4d8] bg-white p-4" key={post.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--deep-green)]">{post.title}</h3>
                  <p className="mt-1 text-sm font-bold text-[#617064]">/{post.slug}</p>
                  <p className="mt-2 text-sm font-bold text-[#617064]">{plainTextSummary(post.content, 150) || "No content added."}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className={secondaryLinkClass} type="button" onClick={() => handleEditPost(post)}>
                    Edit Full Post
                  </button>
                  <select
                    className={requestStatusClass}
                    value={post.status}
                    onChange={(event) => handleStatusChange(post.id, event.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button className={dangerLinkClass} type="button" onClick={() => handleDelete(post.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
      </article>
    </section>
  );
}

function RichTextEditor({ value, onChange, placeholder, minHeightClass = "min-h-[220px]" }) {
  const editorRef = useRef(null);
  const currentHtmlRef = useRef("");

  useEffect(() => {
    const nextValue = value || "";

    if (nextValue === currentHtmlRef.current) {
      return;
    }

    if (!editorRef.current || editorRef.current.innerHTML === nextValue) {
      currentHtmlRef.current = nextValue;
      return;
    }

    currentHtmlRef.current = nextValue;
    editorRef.current.innerHTML = nextValue;
  }, [value]);

  function syncEditorValue() {
    const nextValue = editorRef.current?.innerHTML || "";
    currentHtmlRef.current = nextValue;
    onChange(nextValue);
  }

  function runCommand(command, commandValue = null) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncEditorValue();
  }

  function addLink() {
    const url = window.prompt("Enter link URL");
    if (url) {
      runCommand("createLink", normalizeExternalHref(url));
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-[#dce4d8] bg-white focus-within:border-[#d3a14e] focus-within:shadow-[0_0_0_3px_rgb(211_161_78/0.16)]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#e3e9df] bg-[#fbfcfa] px-2 py-2">
        <EditorButton label="Bold" onClick={() => runCommand("bold")}><Bold aria-hidden="true" /></EditorButton>
        <EditorButton label="Italic" onClick={() => runCommand("italic")}><Italic aria-hidden="true" /></EditorButton>
        <EditorButton label="Underline" onClick={() => runCommand("underline")}><Underline aria-hidden="true" /></EditorButton>
        <span className="mx-1 h-6 w-px bg-[#dce4d8]" aria-hidden="true" />
        <EditorButton label="Heading 1" onClick={() => runCommand("formatBlock", "H1")}><Heading1 aria-hidden="true" /></EditorButton>
        <EditorButton label="Heading 2" onClick={() => runCommand("formatBlock", "H2")}><Heading2 aria-hidden="true" /></EditorButton>
        <EditorButton label="Paragraph" onClick={() => runCommand("formatBlock", "P")}>P</EditorButton>
        <span className="mx-1 h-6 w-px bg-[#dce4d8]" aria-hidden="true" />
        <EditorButton label="Bullet list" onClick={() => runCommand("insertUnorderedList")}><List aria-hidden="true" /></EditorButton>
        <EditorButton label="Numbered list" onClick={() => runCommand("insertOrderedList")}><ListOrdered aria-hidden="true" /></EditorButton>
        <span className="mx-1 h-6 w-px bg-[#dce4d8]" aria-hidden="true" />
        <EditorButton label="Align left" onClick={() => runCommand("justifyLeft")}><AlignLeft aria-hidden="true" /></EditorButton>
        <EditorButton label="Align center" onClick={() => runCommand("justifyCenter")}><AlignCenter aria-hidden="true" /></EditorButton>
        <EditorButton label="Align right" onClick={() => runCommand("justifyRight")}><AlignRight aria-hidden="true" /></EditorButton>
        <span className="mx-1 h-6 w-px bg-[#dce4d8]" aria-hidden="true" />
        <EditorButton label="Add link" onClick={addLink}><LinkIcon aria-hidden="true" /></EditorButton>
      </div>
      <div className="relative">
        {!value && (
          <span className="pointer-events-none absolute left-3 top-3 text-[13px] font-bold text-[#8a9489]">
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          aria-label={placeholder}
          aria-multiline="true"
          className={`${minHeightClass} px-3 py-3 text-[13px] font-medium leading-7 text-[#142319] outline-none [&_a]:text-[#a36a13] [&_a]:underline [&_b]:font-semibold [&_h1]:mb-3 [&_h1]:mt-1 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-1 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_strong]:font-semibold [&_ul]:list-disc`}
          contentEditable
          role="textbox"
          suppressContentEditableWarning
          onInput={syncEditorValue}
        />
      </div>
    </div>
  );
}

function EditorButton({ children, label, onClick }) {
  return (
    <button
      className="grid h-8 min-w-8 place-items-center rounded border border-transparent px-2 text-[12px] font-black text-[#142319] transition hover:border-[#d3a14e] hover:bg-white"
      type="button"
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}

function normalizeExternalHref(href) {
  const value = String(href || "").trim();

  if (!value || value.startsWith("#") || value.startsWith("/") || /^(mailto:|tel:|https?:\/\/)/i.test(value)) {
    return value;
  }

  return `https://${value}`;
}

function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const data = await getSettings();
        if (isMounted) setSettings(data || {});
      } catch (loadError) {
        if (isMounted) setError(loadError.message || "Unable to load settings");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
    } catch (saveError) {
      setError(saveError.message || "Unable to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  const fields = [
    ["business_name", "Business Name"],
    ["business_email", "Business Email"],
    ["business_phone", "Business Phone"],
    ["business_whatsapp", "WhatsApp Number"],
    ["office_address", "Office Address"],
    ["notification_email", "Notification Email"],
  ];

  return (
    <section className="grid gap-4" aria-label="Settings">
      <div className={sectionHeadingClass}>
        <div>
          {sectionEyebrow("Settings")}
          <h2 className="m-0 text-[clamp(26px,2.5vw,38px)] font-semibold leading-tight text-[#0d3518]">Website Settings</h2>
          <p className="mt-2 text-sm font-medium text-[#687265]">Manage core business details used across the website and notifications.</p>
        </div>
      </div>
      <form className={`${panelClass} grid gap-4`} onSubmit={handleSubmit}>
        {error && <p className={inlineErrorClass}>{error}</p>}
        {isLoading ? (
          <p className="text-sm font-bold text-[#617064]">Loading settings...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(([key, label]) => (
              <label className={formLabelClass} key={key}>
                {label}
                <input className={formInputClass} value={settings[key] || ""} onChange={(event) => setFormValue(setSettings, key, event.target.value)} />
              </label>
            ))}
          </div>
        )}
        <button className={`${primaryLinkClass} justify-self-start`} type="submit" disabled={isSaving || isLoading}>
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </section>
  );
}

function DashboardListPage({ children, description, emptyIcon: EmptyIcon, emptyText, emptyTitle, error, eyebrow, isLoading, rows, title }) {
  return (
    <section className="grid gap-4" aria-label={title}>
      {(eyebrow || description) && (
        <div>
          {eyebrow && sectionEyebrow(eyebrow)}
          <h2 className="m-0 text-[clamp(26px,2.5vw,38px)] font-semibold leading-tight text-[#0d3518]">{title}</h2>
          {description && <p className="mt-2 text-sm font-medium text-[#687265]">{description}</p>}
        </div>
      )}
      <article className={`${panelClass} grid gap-3`}>
        {error && <p className={inlineErrorClass}>{error}</p>}
        {!error && isLoading && <EmptyState icon={EmptyIcon} title={`Loading ${title.toLowerCase()}`} text="Please wait while we fetch the latest data." />}
        {!error && !isLoading && rows.length === 0 && <EmptyState icon={EmptyIcon} title={emptyTitle} text={emptyText} />}
        {!error && !isLoading && rows.length > 0 && children}
      </article>
    </section>
  );
}

function EmptyState({ icon: Icon, text, title }) {
  return (
    <div className={emptyStateClass}>
      <Icon className="h-[42px] w-[42px] text-[#0b2a12]" aria-hidden="true" />
      <strong className="text-lg font-black text-[#0b2a12]">{title}</strong>
      <span className="max-w-[420px] text-sm font-bold text-[#687265]">{text}</span>
    </div>
  );
}

function EmptySmall({ message }) {
  return <p className="rounded-lg bg-[#f4f7f0] px-4 py-5 text-sm font-bold text-[#617064]">{message}</p>;
}

function buildContentMetrics(summary) {
  return [
    {
      icon: Package,
      label: "Tour Packages",
      meta: [
        { label: "Published", value: summary?.tours?.published || 0, tone: "green" },
        { label: "Draft", value: summary?.tours?.draft || 0 },
      ],
      note: "Total Packages",
      value: summary?.tours?.total || 0,
    },
    {
      gold: true,
      icon: Mail,
      label: "Requests",
      meta: [
        { label: "New", value: summary?.inquiries?.new || 0, tone: "green" },
        { label: "Replied", value: summary?.inquiries?.responded || 0, tone: "green" },
        { label: "Pending", value: summary?.inquiries?.inProgress || 0, tone: "gold" },
      ],
      note: "Total Requests",
      value: summary?.inquiries?.total || 0,
    },
    {
      icon: FileText,
      label: "Blog Posts",
      meta: [
        { label: "Published", value: summary?.blogs?.published || 0, tone: "green" },
        { label: "Draft", value: summary?.blogs?.draft || 0 },
      ],
      note: "Total Posts",
      value: summary?.blogs?.total || 0,
    },
    {
      icon: Star,
      label: "Reviews",
      meta: [
        { label: "Approved", value: summary?.reviews?.approved || 0, tone: "green" },
        { label: "Pending", value: summary?.reviews?.pending || 0, tone: "gold" },
      ],
      note: "Total Reviews",
      value: summary?.reviews?.total || 0,
    },
  ];
}

function loadRows(loader, setter, setIsLoading, setError) {
  let isMounted = true;

  async function run() {
    setIsLoading(true);
    setError("");

    try {
      const rows = await loader({ limit: 100 });
      if (isMounted) setter(Array.isArray(rows) ? rows : []);
    } catch (loadError) {
      if (isMounted) setError(loadError.message || "Unable to load data");
    } finally {
      if (isMounted) setIsLoading(false);
    }
  }

  run();

  return () => {
    isMounted = false;
  };
}

function setFormValue(setter, key, value) {
  setter((current) => ({ ...current, [key]: value }));
}

function sortAffiliations(rows) {
  return [...rows].sort((left, right) => {
    const orderDifference = Number(left.sort_order || 0) - Number(right.sort_order || 0);
    return orderDifference || String(left.name || "").localeCompare(String(right.name || ""));
  });
}

function slugify(value) {
  return String(value || "tour-category")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDuration(tour) {
  const days = Number(tour.duration_days || 0);
  const nights = Number(tour.duration_nights || 0);

  if (!days && !nights) {
    return "Not set";
  }

  if (days && nights) {
    return `${days} days / ${nights} nights`;
  }

  return days ? `${days} days` : `${nights} nights`;
}

function formatDate(date) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatStatus(status = "") {
  return String(status || "draft")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function plainTextSummary(value, maxLength = 72) {
  const text = String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function mediaPreviewUrl(url) {
  if (!url || url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }

  if (url.startsWith("/uploads")) {
    return `${apiBaseUrl}${url}`;
  }

  return url;
}

export default Dashboard;
