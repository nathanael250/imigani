import {
  Bell,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  FileText,
  ExternalLink,
  Globe2,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPinned,
  Package,
  Plus,
  PenLine,
  Settings,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../assets/imigani tours.png";
import gorillaImage from "../../assets/gollira.png";
import rwandaImage from "../../assets/Rwanda.png";
import ugandaImage from "../../assets/Uganda.png";
import kenyaImage from "../../assets/Kenya.png";
import kigaliImage from "../../assets/Destinations/Kigali.jpg";
import { getCurrentUser, logout } from "../../services/authService";
import { deleteTour, listTours } from "../../services/tourService";
import TourPackageBuilder from "./TourPackageBuilder";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:6003").replace(/\/$/, "");

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Tour packages", href: "/dashboard/tour-packages", icon: Package },
  { label: "Destinations", href: "/dashboard/destinations", icon: MapPinned },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Blogs", href: "/dashboard/blogs", icon: PenLine },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const contentMetrics = [
  {
    label: "Tour Packages",
    value: "28",
    note: "Total Packages",
    icon: Package,
    meta: [
      { label: "Published", value: "24", tone: "green" },
      { label: "Draft", value: "4" },
    ],
  },
  {
    label: "Enquiries",
    value: "312",
    note: "Total Enquiries",
    icon: Mail,
    gold: true,
    meta: [
      { label: "New", value: "87", tone: "green" },
      { label: "Replied", value: "64", tone: "green" },
      { label: "Pending", value: "35", tone: "gold" },
    ],
  },
  {
    label: "Blog Posts",
    value: "16",
    note: "Total Posts",
    icon: FileText,
    meta: [
      { label: "Published", value: "13", tone: "green" },
      { label: "Draft", value: "3" },
    ],
  },
];

const latestEnquiries = [
  {
    name: "Emma Johnson",
    message: "Interested in a 5-day gorilla trekking experience in Rwanda.",
    time: "2h ago",
    status: "New",
  },
  {
    name: "Michael Brown",
    message: "Request for a family safari package in Uganda.",
    time: "4h ago",
    status: "New",
  },
  {
    name: "Sarah Williams",
    message: "Can you customize a trip to include cultural tours?",
    time: "1d ago",
    status: "Replied",
  },
  {
    name: "David Lee",
    message: "Group of 6 people looking for a Kenya safari.",
    time: "1d ago",
    status: "Pending",
  },
  {
    name: "Olivia Martinez",
    message: "Information about your tour packages and prices.",
    time: "2d ago",
    status: "Replied",
  },
];

const recentBlogPosts = [
  {
    title: "Gorilla Trekking in Rwanda: A Life-Changing Experience",
    time: "2d ago",
    status: "Published",
    image: gorillaImage,
  },
  {
    title: "10 Best Wildlife Safari Destinations in East Africa",
    time: "5d ago",
    status: "Published",
    image: kenyaImage,
  },
  {
    title: "Exploring the Beauty of Lake Kivu",
    time: "1w ago",
    status: "Published",
    image: kigaliImage,
  },
  {
    title: "Cultural Experiences You Shouldn't Miss in Rwanda",
    time: "2w ago",
    status: "Draft",
    image: rwandaImage,
  },
  {
    title: "Best Time to Visit East Africa: Month by Month Guide",
    time: "2w ago",
    status: "Draft",
    image: ugandaImage,
  },
];

const quickActions = [
  { label: "Add Tour Package", icon: Package },
  { label: "Add Blog Post", icon: PenLine },
  { label: "View Enquiries", icon: Mail },
  { label: "Upload Media", icon: Image },
  { label: "Manage Users", icon: Users },
  { label: "Settings", icon: Settings },
];

const statusClass = {
  New: "new",
  Replied: "replied",
  Pending: "pending",
  Published: "published",
  Draft: "draft",
};

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
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = getCurrentUser();
  const userName = user?.name || "Administrator";
  const userRole = user?.role || "admin";
  const firstName = userName.split(" ")[0] || "there";
  const userInitials = getInitials(userName);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const isOverview = pathname === "/dashboard";

  return (
    <main className={`dashboard-page${isOverview ? " is-overview" : ""}`}>
      <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
        <div className="dashboard-brand flex-col">
          <h1 className="dashboard-brand-title font-bold text-4xl">IMIGANI</h1>
          <span className="dashboard-brand-subtitle ">Tours & Safaris</span>
        </div>

        <nav className="dashboard-nav">
          {navItems.map(({ label, href, icon: Icon, end }) => (
            <NavLink
              className={({ isActive }) =>
                `dashboard-nav-link${isActive ? " is-active" : ""}`
              }
              end={end}
              to={href}
              key={label}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dashboard-sidebar-footer">
          <section className="dashboard-help-box" aria-label="Visit public website">
            <Globe2 aria-hidden="true" />
            <strong>Visit Website</strong>
            <p>Open the public IMIGANI Tours &amp; Safaris website.</p>
            <a href="/" target="_blank" rel="noreferrer">
              Go to Website
              <ExternalLink aria-hidden="true" />
            </a>
          </section>

          <section className="dashboard-profile-menu" aria-label="Signed in user">
            <button
              className="dashboard-user-card"
              type="button"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              <div className="dashboard-avatar" aria-hidden="true">
                {userInitials}
              </div>
              <div>
                <strong>{userName}</strong>
                <span>{userRole}</span>
              </div>
              <ChevronDown className="dashboard-user-chevron" aria-hidden="true" />
            </button>

            {isProfileOpen && (
              <div className="dashboard-profile-dropdown">
                <div>
                  <strong>{userName}</strong>
                  <span>{user?.email || "Signed in"}</span>
                </div>
                <button type="button" onClick={handleLogout}>
                  <LogOut aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </section>
        </div>
      </aside>

      <section className="dashboard-main" aria-label="IMIGANI admin overview">
        <header className="dashboard-header">
          <div>
            <h1>
              Welcome back, {firstName}! <span aria-hidden="true">👋</span>
            </h1>
            <p>Here&apos;s what&apos;s happening with your content today.</p>
          </div>

          <div className="dashboard-header-controls">
            <button
              className="dashboard-icon-button"
              type="button"
              aria-label="Notifications"
            >
              <Bell aria-hidden="true" />
              <span>3</span>
            </button>
            <button className="dashboard-account-button" type="button">
              <span className="dashboard-account-logo">
                <img src={logoImage} alt="" />
              </span>
              <span>{userName}</span>
              <ChevronDown aria-hidden="true" />
            </button>
            <button className="dashboard-select-button" type="button">
              <CalendarDays aria-hidden="true" />
              May 12 - May 18, 2024
              <ChevronDown aria-hidden="true" />
            </button>
          </div>
        </header>

        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="tour-packages" element={<TourPackagesPage />} />
          <Route path="tour-packages/new" element={<TourPackageBuilder />} />
          <Route path="tour-packages/:id/edit" element={<TourPackageBuilder />} />
          <Route path="*" element={<DashboardPlaceholder />} />
        </Routes>
      </section>
    </main>
  );
}

function DashboardPlaceholder() {
  return (
    <article className="dashboard-panel dashboard-empty-state">
      <Settings aria-hidden="true" />
      <strong>This dashboard section is coming next</strong>
      <span>Use Tour packages for now while the other management pages are being built.</span>
      <Link to="/dashboard/tour-packages">Open Tour Packages</Link>
    </article>
  );
}

function DashboardOverview() {
  return (
    <>
        <section className="dashboard-content-metrics" aria-label="Content metrics">
          {contentMetrics.map(({ label, value, note, icon: Icon, meta, gold }) => (
            <article className="dashboard-content-stat-card" key={label}>
              <div className={`dashboard-content-stat-icon${gold ? " is-gold" : ""}`}>
                <Icon aria-hidden="true" />
              </div>
              <div className="dashboard-content-stat-copy">
                <p>{label}</p>
                <strong>{value}</strong>
                <span>{note}</span>
              </div>
              <div className="dashboard-content-stat-meta">
                {meta.map((item, index) => (
                  <span
                    className={item.tone ? `is-${item.tone}` : undefined}
                    key={`${label}-${item.label}`}
                  >
                    {index > 0 && <i aria-hidden="true" />}
                    {item.label}: <strong>{item.value}</strong>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="dashboard-content-grid dashboard-content-lists">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Latest Enquiries</h2>
              </div>
              <a href="/dashboard">View All</a>
            </div>
            <div className="dashboard-enquiry-list">
              {latestEnquiries.map((enquiry) => (
                <article
                  className="dashboard-enquiry-row"
                  key={`${enquiry.name}-${enquiry.time}`}
                >
                  <span className="dashboard-row-icon">
                    <Mail aria-hidden="true" />
                  </span>
                  <div>
                    <strong>{enquiry.name}</strong>
                    <span>{enquiry.message}</span>
                  </div>
                  <div className="dashboard-row-meta">
                    <time>{enquiry.time}</time>
                    <span
                      className={`dashboard-status ${statusClass[enquiry.status]}`}
                    >
                      {enquiry.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Recent Blog Posts</h2>
              </div>
              <a href="/dashboard">View All</a>
            </div>
            <div className="dashboard-blog-list">
              {recentBlogPosts.map((post) => (
                <article className="dashboard-blog-row" key={post.title}>
                  <img src={post.image} alt="" />
                  <div>
                    <strong>{post.title}</strong>
                  </div>
                  <div className="dashboard-row-meta">
                    <time>{post.time}</time>
                    <span className={`dashboard-status ${statusClass[post.status]}`}>
                      {post.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="dashboard-content-actions">
          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Quick Actions</h2>
              </div>
            </div>
            <div className="dashboard-action-grid">
              {quickActions.map(({ label, icon: Icon }) => (
                <button
                  className="dashboard-action-tile"
                  type="button"
                  key={label}
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </button>
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
    <section className="dashboard-packages-page" aria-label="Tour packages">
      <div className="dashboard-section-heading">
        <div>
          <span>Tour packages</span>
          <h2>Manage Tour Packages</h2>
          <p>View the tour packages stored in the database and create new safari experiences.</p>
        </div>
        <Link className="dashboard-primary-link" to="/dashboard/tour-packages/new">
          <Plus aria-hidden="true" />
          Create New Tour Package
        </Link>
      </div>

      <article className="dashboard-panel dashboard-table-panel">
        <div className="dashboard-panel-header">
          <div>
            <h2>All Tour Packages</h2>
            <p>{isLoading ? "Loading packages..." : `${packages.length} packages found`}</p>
          </div>
        </div>

        {error && <p className="dashboard-inline-error">{error}</p>}

        {!error && isLoading && (
          <div className="dashboard-empty-state">
            <Package aria-hidden="true" />
            <strong>Loading tour packages</strong>
            <span>Please wait while we fetch the latest data.</span>
          </div>
        )}

        {!error && !isLoading && packages.length === 0 && (
          <div className="dashboard-empty-state">
            <Package aria-hidden="true" />
            <strong>No tour packages yet</strong>
            <span>Create your first package to start building the catalogue.</span>
            <Link to="/dashboard/tour-packages/new">Create Package</Link>
          </div>
        )}

        {!error && !isLoading && packages.length > 0 && (
          <div className="dashboard-package-table-wrap">
            <table className="dashboard-package-table">
              <thead>
                <tr>
                  <th>Package</th>
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
                      <div className="dashboard-package-cell">
                        <span>
                          {tour.cover_image_url ? (
                            <img src={mediaPreviewUrl(tour.cover_image_url)} alt="" />
                          ) : (
                            <Package aria-hidden="true" />
                          )}
                        </span>
                        <div>
                          <strong>{tour.name}</strong>
                          <small>{plainTextSummary(tour.description, 72) || tour.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td>{formatDuration(tour)}</td>
                    <td>
                      <span className={`dashboard-status ${tour.status || "draft"}`}>
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
