import {
  AlignCenter,
  AlignLeft,
  AlignRight,
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
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import logoImage from "../../assets/imigani tours.png";
import { getCurrentUser, logout } from "../../services/authService";
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

  const isOverview = pathname === "/dashboard";
  const unreadCount = notifications.filter((item) => Number(item.is_read) === 0).length;

  return (
    <main className={`dashboard-page${isOverview ? " is-overview" : ""}`}>
      <aside className={`dashboard-sidebar${isDashboardMenuOpen ? " is-open" : ""}`} aria-label="Dashboard navigation">
        <div className="dashboard-mobile-bar">
          <div>
            <strong>IMIGANI</strong>
            <span>Tours &amp; Safaris</span>
          </div>
          <button
            type="button"
            aria-controls="dashboard-navigation"
            aria-expanded={isDashboardMenuOpen}
            aria-label={isDashboardMenuOpen ? "Close dashboard menu" : "Open dashboard menu"}
            onClick={() => setIsDashboardMenuOpen((current) => !current)}
          >
            {isDashboardMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <div className="dashboard-brand flex-col">
          <h1 className="dashboard-brand-title font-bold text-4xl">IMIGANI</h1>
          <span className="dashboard-brand-subtitle ">Tours & Safaris</span>
        </div>

        <nav id="dashboard-navigation" className="dashboard-nav">
          {navItems.map(({ label, href, icon: Icon, end }) => (
            <NavLink
              className={({ isActive }) =>
                `dashboard-nav-link${isActive ? " is-active" : ""}`
              }
              end={end}
              to={href}
              key={label}
              onClick={() => setIsDashboardMenuOpen(false)}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {label === "Requests" && newRequestCount > 0 && (
                <strong className="dashboard-nav-badge" aria-label={`${newRequestCount} new requests`}>
                  {newRequestCount > 99 ? "99+" : newRequestCount}
                </strong>
              )}
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
              aria-expanded={isSidebarProfileOpen}
              onClick={() => {
                setIsSidebarProfileOpen((current) => !current);
                setIsHeaderProfileOpen(false);
              }}
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

            {isSidebarProfileOpen && (
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
        <header className="dashboard-header dashboard-header-compact">
          <div className="dashboard-header-controls">
            <div className="relative">
              <button
                className="dashboard-icon-button"
                type="button"
                aria-expanded={isNotificationsOpen}
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen((current) => !current)}
              >
                <Bell aria-hidden="true" />
                {unreadCount > 0 && <span>{unreadCount}</span>}
              </button>
              {isNotificationsOpen && (
                <NotificationsDropdown
                  notifications={notifications}
                  onMarkAllRead={handleMarkAllNotificationsRead}
                  onMarkRead={handleMarkNotificationRead}
                />
              )}
            </div>
            <div className="dashboard-header-profile">
              <button
                className="dashboard-account-button"
                type="button"
                aria-expanded={isHeaderProfileOpen}
                onClick={() => {
                  setIsHeaderProfileOpen((current) => !current);
                  setIsSidebarProfileOpen(false);
                  setIsNotificationsOpen(false);
                }}
              >
                <span className="dashboard-account-logo">
                  <img src={logoImage} alt="" />
                </span>
                <span>{userName}</span>
                <ChevronDown aria-hidden="true" />
              </button>

              {isHeaderProfileOpen && (
                <div className="dashboard-header-profile-dropdown">
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
            </div>
            <LanguageMenu className="dashboard-language-menu" />
            <button className="dashboard-select-button" type="button">
              <CalendarDays aria-hidden="true" />
              May 12 - May 18, 2024
              <ChevronDown aria-hidden="true" />
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
    <article className="dashboard-panel dashboard-empty-state">
      <Settings aria-hidden="true" />
      <strong>This dashboard section is coming next</strong>
      <span>Use Tour packages for now while the other management pages are being built.</span>
      <Link to="/dashboard/tour-packages">Open Tour Packages</Link>
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
        {error && <p className="dashboard-inline-error">{error}</p>}
        {isLoading && <p className="mb-4 text-sm font-bold text-[#617064]">Loading dashboard data...</p>}
        <section className="dashboard-content-metrics" aria-label="Content metrics">
          {metrics.map(({ label, value, note, icon: Icon, meta, gold }) => (
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
              <Link to="/dashboard/bookings">View All</Link>
            </div>
            <div className="dashboard-enquiry-list">
              {latestInquiries.map((enquiry) => (
                <article
                  className={`dashboard-enquiry-row${Number(enquiry.is_read) === 0 ? " is-unread" : ""}`}
                  key={enquiry.id}
                >
                  <span className="dashboard-row-icon">
                    <Mail aria-hidden="true" />
                  </span>
                  <div>
                    <strong>{enquiry.name}</strong>
                    <span>{enquiry.inquiry}</span>
                  </div>
                  <div className="dashboard-row-meta">
                    <time>{formatDate(enquiry.created_at)}</time>
                    <span
                      className={`dashboard-status ${statusClass[enquiry.status] || "draft"}`}
                    >
                      {formatStatus(enquiry.status)}
                    </span>
                  </div>
                </article>
              ))}
              {latestInquiries.length === 0 && <EmptySmall message="No travel requests yet." />}
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Recent Blog Posts</h2>
              </div>
              <Link to="/dashboard/blogs">View All</Link>
            </div>
            <div className="dashboard-blog-list">
              {recentBlogPosts.map((post) => (
                <article className="dashboard-blog-row" key={post.id}>
                  {post.cover_image_url ? <img src={mediaPreviewUrl(post.cover_image_url)} alt="" /> : <FileText aria-hidden="true" />}
                  <div>
                    <strong>{post.title}</strong>
                  </div>
                  <div className="dashboard-row-meta">
                    <time>{formatDate(post.created_at)}</time>
                    <span className={`dashboard-status ${statusClass[post.status] || "draft"}`}>
                      {formatStatus(post.status)}
                    </span>
                  </div>
                </article>
              ))}
              {recentBlogPosts.length === 0 && <EmptySmall message="No blog posts created yet." />}
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
              {quickActions.map(({ href, label, icon: Icon }) => (
                <Link
                  className="dashboard-action-tile"
                  to={href}
                  key={label}
                >
                  <Icon aria-hidden="true" />
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
                    <td>{tour.category_name || "Uncategorized"}</td>
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
    <section className="dashboard-packages-page" aria-label="Tour categories">
      <div className="dashboard-section-heading">
        <div>
          <span>Tour packages</span>
          <h2>Tour Categories</h2>
          <p>Manage the categories used when creating and organizing tour packages.</p>
        </div>
        <button
          className="dashboard-primary-link"
          type="button"
          onClick={() => {
            if (isCreating) {
              resetCategoryForm();
              return;
            }

            handleCreateNew();
          }}
        >
          <Plus aria-hidden="true" />
          {isCreating ? "Back to Categories" : "Create Category"}
        </button>
      </div>

      {isCreating && (
        <form className="dashboard-panel mb-6 grid gap-4" onSubmit={handleSaveCategory}>
          <h3 className="text-xl font-bold text-[var(--deep-green)]">
            {editingCategoryId ? "Edit Tour Category" : "Create Tour Category"}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-[var(--deep-green)]">
              Category Name
              <input
                className="rounded-md border border-[#dce4d8] px-4 py-3 text-sm font-bold"
                placeholder="Wildlife Tours"
                value={form.name}
                onChange={(event) => setFormValue(setForm, "name", event.target.value)}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[var(--deep-green)]">
              Status
              <select
                className="rounded-md border border-[#dce4d8] px-4 py-3 text-sm font-bold"
                value={form.status}
                onChange={(event) => setFormValue(setForm, "status", event.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-[var(--deep-green)]">
            Description
            <textarea
              className="min-h-[110px] rounded-md border border-[#dce4d8] px-4 py-3 text-sm font-bold"
              placeholder="Short description for this tour package category"
              value={form.description}
              onChange={(event) => setFormValue(setForm, "description", event.target.value)}
            />
          </label>
          <div className="flex flex-wrap justify-end gap-3">
            <button className="dashboard-secondary-link" type="button" onClick={resetCategoryForm}>
              Cancel
            </button>
            <button className="dashboard-primary-link" type="submit" disabled={isSaving}>
              <Plus aria-hidden="true" />
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
        <div className="dashboard-package-table-wrap">
          <table className="dashboard-package-table dashboard-category-table">
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
                    <strong className="dashboard-category-name">{category.name}</strong>
                  </td>
                  <td className="dashboard-muted-cell">/{category.slug}</td>
                  <td>
                    <span className="dashboard-category-description">
                      {category.description || "No description added."}
                    </span>
                  </td>
                  <td>
                    <select
                      className="dashboard-request-status"
                      value={category.status}
                      onChange={(event) => handleStatusChange(category.id, event.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="dashboard-muted-cell">{formatDate(category.created_at)}</td>
                  <td>
                    <div className="dashboard-table-actions">
                      <button
                        className="dashboard-secondary-link"
                        type="button"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="dashboard-danger-link"
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
      <div className="dashboard-request-tabs" role="tablist" aria-label="Request types">
        {requestTabConfig.map((tab) => (
          <button
            className={activeTab === tab.id ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            {(requestGroups[tab.id]?.count || 0) > 0 && <em>{requestGroups[tab.id].count}</em>}
          </button>
        ))}
      </div>

      {activeRequests.length > 0 ? (
        <div className="dashboard-request-list">
          {activeRequests.map((request) => {
            const subject = getRequestSubject(request, requestGroups[activeTab].label);
            const preview = getRequestPreview(request.inquiry, subject);

            return (
              <article
                className={`dashboard-request-card${Number(request.is_read) === 0 ? " is-unread" : ""}`}
                key={request.id}
              >
                <div className="dashboard-request-row">
                  <span className="dashboard-request-dot" aria-hidden="true" />
                  <div className="dashboard-request-sender">
                    <strong>{request.name}</strong>
                    <span>{request.email}</span>
                  </div>
                  <Link
                    className="dashboard-request-summary"
                    to={`/dashboard/bookings/${request.id}`}
                  >
                    <strong>{subject}</strong>
                    <span>{preview}</span>
                  </Link>
                  <div className="dashboard-request-meta">
                    <select
                      className="dashboard-request-status"
                      value={request.status}
                      onChange={(event) => handleStatusChange(request.id, event.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In progress</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                    </select>
                    <time>{formatDate(request.created_at)}</time>
                    <Link className="dashboard-request-open-link" to={`/dashboard/bookings/${request.id}`}>
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
      emptyIcon={Mail}
      emptyTitle="No subscribers yet"
      emptyText="When visitors subscribe from the website, their emails will appear here."
      error={error}
      isLoading={isLoading}
      rows={subscribers}
    >
      <div className="dashboard-subscriber-list">
        {subscribers.map((subscriber) => (
          <article className="dashboard-subscriber-row" key={subscriber.id}>
            <div>
              <strong>{subscriber.email}</strong>
              <span>{subscriber.source || "website"}</span>
            </div>
            <div>
              <time>{formatDate(subscriber.created_at)}</time>
              <select
                className="dashboard-request-status"
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
    <section className="dashboard-packages-page" aria-label="Request details">
      <div className="dashboard-section-heading">
        <div>
          <span>Requests</span>
          <h2>Request Details</h2>
          <p>Read the full message and update its response status.</p>
        </div>
        <Link className="dashboard-secondary-link" to="/dashboard/bookings">
          Back to Requests
        </Link>
      </div>

      <article className="dashboard-panel">
        {error && <p className="dashboard-inline-error">{error}</p>}
        {!error && isLoading && (
          <EmptyState icon={Mail} title="Loading request" text="Please wait while we fetch the request details." />
        )}
        {!error && !isLoading && !request && (
          <EmptyState icon={Mail} title="Request not found" text="This request could not be found in the database." />
        )}
        {!error && !isLoading && request && (
          <div className="dashboard-request-detail">
            <div className="dashboard-request-detail-header">
              <div>
                <span className="dashboard-request-type">{typeLabel}</span>
                <h3>{subject}</h3>
                <p>{request.name}</p>
                <a href={`mailto:${request.email}`}>{request.email}</a>
                {request.phone && <a href={`tel:${request.phone}`}>{request.phone}</a>}
              </div>
              <div>
                <select
                  className="dashboard-request-status"
                  value={request.status}
                  onChange={(event) => handleStatusChange(event.target.value)}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In progress</option>
                  <option value="responded">Responded</option>
                  <option value="closed">Closed</option>
                </select>
                <time>{formatDate(request.created_at)}</time>
              </div>
            </div>
            <div className="dashboard-request-detail-message">{request.inquiry}</div>
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
                className="rounded-md border border-[#dce4d8] bg-white px-3 py-2 text-sm font-bold text-[var(--deep-green)]"
                value={review.status}
                onChange={(event) => handleStatusChange(review.id, event.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-red-700" type="button" onClick={() => handleDelete(review.id)}>
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
    <section className="dashboard-packages-page" aria-label="Blog posts">
      <div className="dashboard-section-heading">
        <div>
          <h2>Blog Posts</h2>
        </div>
        <button
          className="dashboard-primary-link"
          type="button"
          onClick={() => {
            if (isCreating) {
              resetBlogForm();
              return;
            }

            handleCreateNew();
          }}
        >
          <Plus aria-hidden="true" />
          {isCreating ? "Back to Posts" : "Create New Post"}
        </button>
      </div>

      {isCreating && (
        <form className="dashboard-panel mb-6 grid gap-4" onSubmit={(event) => handleSavePost(event, "draft")}>
          <h3 className="text-xl font-bold text-[var(--deep-green)]">
            {editingPostId ? "Edit Blog Post" : "Create Blog Post"}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-[var(--deep-green)]">
              Title
              <input className="rounded-md border border-[#dce4d8] px-4 py-3 text-sm font-bold" placeholder="Blog title" value={form.title} onChange={(event) => setFormValue(setForm, "title", event.target.value)} required />
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
                className="dashboard-secondary-link"
                type="button"
                onClick={resetBlogForm}
              >
                Cancel
              </button>
              <button className="dashboard-secondary-link" type="submit" disabled={isSaving || isUploadingImage}>
                <Plus aria-hidden="true" />
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
              <button
                className="dashboard-primary-link"
                type="button"
                disabled={isSaving || isUploadingImage}
                onClick={(event) => handleSavePost(event, "published")}
              >
                <Plus aria-hidden="true" />
                {isSaving ? "Publishing..." : "Publish"}
              </button>
          </div>
        </form>
      )}

      <article className="dashboard-panel grid gap-3">
        {error && <p className="dashboard-inline-error">{error}</p>}
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
                  <button className="dashboard-secondary-link" type="button" onClick={() => handleEditPost(post)}>
                    Edit Full Post
                  </button>
                  <select
                    className="rounded-md border border-[#dce4d8] bg-white px-3 py-2 text-sm font-bold text-[var(--deep-green)]"
                    value={post.status}
                    onChange={(event) => handleStatusChange(post.id, event.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-red-700" type="button" onClick={() => handleDelete(post.id)}>
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
          className={`dashboard-rich-editor-content ${minHeightClass} px-3 py-3 text-[13px] leading-7 text-[#142319] outline-none [&_a]:text-[#a36a13] [&_a]:underline [&_h1]:mb-3 [&_h1]:mt-1 [&_h1]:text-2xl [&_h2]:mb-2 [&_h2]:mt-1 [&_h2]:text-xl [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc`}
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
    <section className="dashboard-packages-page" aria-label="Settings">
      <div className="dashboard-section-heading">
        <div>
          <span>Settings</span>
          <h2>Website Settings</h2>
          <p>Manage core business details used across the website and notifications.</p>
        </div>
      </div>
      <form className="dashboard-panel grid gap-4" onSubmit={handleSubmit}>
        {error && <p className="dashboard-inline-error">{error}</p>}
        {isLoading ? (
          <p className="text-sm font-bold text-[#617064]">Loading settings...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(([key, label]) => (
              <label className="grid gap-2 text-sm font-bold text-[var(--deep-green)]" key={key}>
                {label}
                <input className="rounded-md border border-[#dce4d8] px-4 py-3 text-sm font-bold text-[#26332a]" value={settings[key] || ""} onChange={(event) => setFormValue(setSettings, key, event.target.value)} />
              </label>
            ))}
          </div>
        )}
        <button className="dashboard-primary-link justify-self-start" type="submit" disabled={isSaving || isLoading}>
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </section>
  );
}

function DashboardListPage({ children, emptyIcon: EmptyIcon, emptyText, emptyTitle, error, isLoading, rows, title }) {
  return (
    <section className="dashboard-packages-page" aria-label={title}>
      <article className="dashboard-panel grid gap-3">
        {error && <p className="dashboard-inline-error">{error}</p>}
        {!error && isLoading && <EmptyState icon={EmptyIcon} title={`Loading ${title.toLowerCase()}`} text="Please wait while we fetch the latest data." />}
        {!error && !isLoading && rows.length === 0 && <EmptyState icon={EmptyIcon} title={emptyTitle} text={emptyText} />}
        {!error && !isLoading && rows.length > 0 && children}
      </article>
    </section>
  );
}

function EmptyState({ icon: Icon, text, title }) {
  return (
    <div className="dashboard-empty-state">
      <Icon aria-hidden="true" />
      <strong>{title}</strong>
      <span>{text}</span>
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
