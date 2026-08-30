import {
  ArrowLeft,
  ArrowRight,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Clock,
  ExternalLink,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  MapPin,
  Package,
  Plus,
  Save,
  Trash2,
  Underline,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createFullTourPackage,
  getFullTourPackage,
  getTourPackageLookups,
  updateFullTourPackage,
  uploadTourMedia,
} from "../../services/tourService";

const steps = [
  "Basic Information",
  "Highlights & Destinations",
  "Itinerary",
  "Pricing",
  "Inclusions, Exclusions & Extras",
  "Media & Review",
];

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:6003").replace(/\/$/, "");

const dashboardInlineErrorClass = "rounded-md bg-[#fff1ed] px-[14px] py-3 text-[13px] font-black text-[#9b2f20]";
const builderButtonClass =
  "inline-flex min-h-[42px] items-center justify-center gap-[9px] whitespace-nowrap rounded-md border border-[#dfe5da] bg-white px-[17px] text-[13px] font-semibold text-[#142819] transition hover:-translate-y-px hover:border-[#c6923d]/55 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0";
const builderPrimaryButtonClass =
  "inline-flex min-h-[42px] items-center justify-center gap-[9px] whitespace-nowrap rounded-md border border-[#0b2a12] bg-[#0b2a12] px-[17px] text-[13px] font-semibold text-white transition hover:-translate-y-px hover:bg-[#14381d] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0";
const builderInputClass =
  "w-full rounded-md border border-[#dce4d8] bg-white px-[13px] py-3 text-[13px] font-medium text-[#142319] outline-none transition focus:border-[#d3a14e] focus:ring-4 focus:ring-[#d3a14e]/20";
const builderLabelClass = "grid gap-2 text-[13px] font-semibold text-[#253329]";
const builderEmptyStateClass =
  "grid min-h-[230px] place-items-center content-center gap-2.5 rounded-[8px] border border-dashed border-[#d8e0d5] bg-[#fbfcfa] p-8 text-center";

const emptyDraft = {
  basic: {
    category_id: "",
    description: "",
    duration_days: "",
    duration_nights: "",
    name: "",
    status: "draft",
  },
  destinations: [],
  exclusions: "",
  extras: "",
  highlights: [{ title: "" }],
  inclusions: "",
  itinerary_days: [
    {
      client_key: "day-1",
      day_number: "1",
      description: "",
      title: "",
    },
  ],
  media: [{ is_cover: true, media_type: "image", title: "Cover image", url: "" }],
  prices: [{ currency_id: "", price: "", price_note: "" }],
};

function TourPackageBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [activeStep, setActiveStep] = useState(0);
  const [draft, setDraft] = useState(() => cloneDraft(emptyDraft));
  const [error, setError] = useState("");
  const [isLoadingPackage, setIsLoadingPackage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lookups, setLookups] = useState({
    categories: [],
    currencies: [],
    destinations: [],
  });

  const selectedDestinationIds = useMemo(
    () => new Set(draft.destinations.map((destination) => String(destination.destination_id))),
    [draft.destinations],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadLookups() {
      try {
        const data = await getTourPackageLookups();

        if (isMounted) {
          setLookups({
            categories: data.categories || [],
            currencies: data.currencies || [],
            destinations: data.destinations || [],
          });
        }
      } catch (lookupError) {
        if (isMounted) {
          setError(lookupError.message || "Unable to load package form options");
        }
      }
    }

    loadLookups();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    let isMounted = true;

    async function loadPackage() {
      setIsLoadingPackage(true);
      setError("");

      try {
        const packageData = await getFullTourPackage(id);

        if (isMounted) {
          setDraft(hydratePackageDraft(packageData));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load tour package");
        }
      } finally {
        if (isMounted) {
          setIsLoadingPackage(false);
        }
      }
    }

    loadPackage();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function updateBasic(event) {
    const { name, value } = event.target;
    setDraft((current) => ({
      ...current,
      basic: {
        ...current.basic,
        [name]: isNumericField(name) ? value.replace(/\D/g, "") : value,
      },
    }));
  }

  function updateBasicField(name, value) {
    setDraft((current) => ({
      ...current,
      basic: {
        ...current.basic,
        [name]: value,
      },
    }));
  }

  function updateArray(section, index, key, value) {
    setDraft((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  }

  function updateSection(section, value) {
    setDraft((current) => ({
      ...current,
      [section]: value,
    }));
  }

  function addItem(section, item) {
    setDraft((current) => ({
      ...current,
      [section]: [...current[section], item],
    }));
  }

  function removeItem(section, index) {
    setDraft((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function toggleDestination(destination) {
    setDraft((current) => {
      const exists = current.destinations.some(
        (item) => String(item.destination_id) === String(destination.id),
      );

      return {
        ...current,
        destinations: exists
          ? current.destinations.filter((item) => String(item.destination_id) !== String(destination.id))
          : [
              ...current.destinations,
              {
                description: destination.description || "",
                destination_id: destination.id,
                name: destination.name,
              },
            ],
      };
    });
  }

  function addItineraryDay() {
    const nextDay = draft.itinerary_days.length + 1;
    addItem("itinerary_days", {
      client_key: `day-${Date.now()}`,
      day_number: String(nextDay),
      description: "",
      title: "",
    });
  }

  function updateItineraryDay(dayIndex, key, value) {
    setDraft((current) => ({
      ...current,
      itinerary_days: current.itinerary_days.map((day, index) =>
        index === dayIndex ? { ...day, [key]: value } : day,
      ),
    }));
  }

  async function savePackage(status = draft.basic.status) {
    setError("");
    setIsSaving(true);

    try {
      const payload = preparePayload({
        ...draft,
        basic: {
          ...draft.basic,
          status,
        },
      });

      if (isEditing) {
        await updateFullTourPackage(id, payload);
      } else {
        await createFullTourPackage(payload);
      }

      navigate("/dashboard/tour-packages");
    } catch (saveError) {
      setError(saveError.message || "Unable to save tour package");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="grid gap-4" aria-label={isEditing ? "Edit tour package" : "Add new tour package"}>
      <div className="flex items-center justify-between gap-[18px] max-[760px]:grid">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2.5 text-[12px] font-medium text-[#7c857d]">
            <Link to="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link to="/dashboard/tour-packages">Tour Packages</Link>
            <span>/</span>
            <strong>{isEditing ? "Edit Tour" : "Add New Tour"}</strong>
          </div>
          <h2 className="m-0 text-[clamp(28px,2.7vw,38px)] font-semibold leading-tight text-[#0d3518]">{isEditing ? "Edit Tour Package" : "Add New Tour Package"}</h2>
          <p className="mt-2 text-sm font-medium text-[#687265]">{isEditing ? "Update this tour package and keep every detail in sync." : "Create a new tour package and manage all the details."}</p>
        </div>

        <div className="flex items-center gap-3 max-[760px]:grid max-[760px]:grid-cols-2 max-[420px]:grid-cols-1">
          <button className={builderButtonClass} type="button" onClick={() => savePackage("draft")} disabled={isSaving}>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Draft
          </button>
          <button
            className={builderPrimaryButtonClass}
            type="button"
            onClick={() => (activeStep === steps.length - 1 ? savePackage("published") : setActiveStep(activeStep + 1))}
            disabled={isSaving}
          >
            {activeStep === steps.length - 1 ? "Review & Publish" : "Next Step"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 rounded-[8px] border border-[#e1e7dc] bg-white px-[26px] py-[23px] shadow-[0_14px_30px_rgba(18,53,27,0.06)] max-[920px]:grid-cols-3 max-[560px]:grid-cols-2 max-[420px]:grid-cols-1">
        {steps.map((step, index) => (
          <button
            className="grid place-items-center gap-2.5 text-center text-[12px] font-semibold text-[#4f5b52]"
            type="button"
            onClick={() => setActiveStep(index)}
            key={step}
          >
            <span className={`grid h-[38px] w-[38px] place-items-center rounded-full text-[13px] ${
              index <= activeStep ? "bg-[#0b2a12] text-white" : "bg-[#e1e3e2] text-[#142819]"
            }`}>{index < activeStep ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}</span>
            <small className={`${index === activeStep ? "text-[#0d3518]" : ""}`}>{step}</small>
          </button>
        ))}
      </div>

      {error && <p className={dashboardInlineErrorClass}>{error}</p>}

      <div className="rounded-[8px] border border-[#e1e7dc] bg-white shadow-[0_14px_30px_rgba(18,53,27,0.06)]">
        {isLoadingPackage && (
          <div className={builderEmptyStateClass}>
            <Package className="h-[42px] w-[42px] text-[#0b2a12]" aria-hidden="true" />
            <strong className="text-lg font-black text-[#0b2a12]">Loading tour package</strong>
            <span className="max-w-[420px] text-sm font-bold text-[#687265]">Please wait while we bring the saved details back into the form.</span>
          </div>
        )}

        {!isLoadingPackage && (
          <div className="p-6 max-[640px]:p-4">
        {activeStep === 0 && (
          <BasicStep
            basic={draft.basic}
            categories={lookups.categories}
            updateBasic={updateBasic}
            updateBasicField={updateBasicField}
          />
        )}

        {activeStep === 1 && (
          <HighlightsDestinationsStep
            destinations={lookups.destinations}
            draft={draft}
            selectedDestinationIds={selectedDestinationIds}
            addItem={addItem}
            removeItem={removeItem}
            toggleDestination={toggleDestination}
            updateArray={updateArray}
          />
        )}

        {activeStep === 2 && (
          <ItineraryStep
            days={draft.itinerary_days}
            addItineraryDay={addItineraryDay}
            updateItineraryDay={updateItineraryDay}
          />
        )}

        {activeStep === 3 && (
          <PricingStep
            currencies={lookups.currencies}
            prices={draft.prices}
            addItem={addItem}
            removeItem={removeItem}
            updateArray={updateArray}
          />
        )}

        {activeStep === 4 && (
          <InclusionsExtrasStep draft={draft} updateSection={updateSection} />
        )}

        {activeStep === 5 && (
          <MediaReviewStep
            draft={draft}
            updateBasicField={updateBasicField}
            updateArray={updateArray}
            addItem={addItem}
            removeItem={removeItem}
          />
        )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-[#e3e9df] px-5 py-4 max-[760px]:grid max-[760px]:grid-cols-1">
          <button className={builderButtonClass} type="button" onClick={() => setActiveStep(Math.max(activeStep - 1, 0))}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Previous Step
          </button>
          <div className="flex items-center justify-end gap-3 max-[760px]:grid max-[760px]:grid-cols-2 max-[420px]:grid-cols-1">
            <button className={builderButtonClass} type="button" onClick={() => savePackage("draft")} disabled={isSaving}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Draft
            </button>
            <button
              className={builderPrimaryButtonClass}
              type="button"
              onClick={() =>
                activeStep === steps.length - 1 ? savePackage("published") : setActiveStep(activeStep + 1)
              }
              disabled={isSaving}
            >
              {activeStep === steps.length - 1 ? "Review & Publish" : "Next Step"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function BasicStep({ basic, categories, updateBasic, updateBasicField }) {
  return (
    <section>
      <header className="mb-5">
        <h3 className="m-0 text-[24px] font-black leading-tight text-[#162a1a]">Basic Information</h3>
        <p className="mt-2 text-[14px] font-bold leading-snug text-[#687265]">
          Add the basic details about the tour package.
        </p>
      </header>
      <div className="grid gap-x-[18px] gap-y-4 md:grid-cols-2">
        <FormInput label="Tour Name" name="name" value={basic.name} onChange={updateBasic} required />
        <label className={builderLabelClass}>
          Tour Category *
          <select className={builderInputClass} name="category_id" value={basic.category_id} onChange={updateBasic}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <FormInput label="Duration (Days)" name="duration_days" value={basic.duration_days} onChange={updateBasic} required />
        <FormInput label="Duration (Nights)" name="duration_nights" value={basic.duration_nights} onChange={updateBasic} />
        <div className="grid gap-2 md:col-span-2">
          <span className="text-[13px] font-black text-[#253329]">Description *</span>
          <RichTextEditor
            value={basic.description}
            onChange={(value) => updateBasicField("description", value)}
            placeholder="Tell travelers everything about this tour..."
          />
        </div>
      </div>
    </section>
  );
}

function RichTextEditor({ value, onChange, placeholder, minHeightClass = "min-h-[220px]" }) {
  const editorRef = useRef(null);
  const currentHtmlRef = useRef("");

  useEffect(() => {
    const nextValue = value || "";

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
      runCommand("createLink", url);
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
          className={`${minHeightClass} px-3 py-3 text-[13px] font-bold leading-7 text-[#142319] outline-none [&_a]:text-[#a36a13] [&_a]:underline [&_h1]:mb-3 [&_h1]:mt-1 [&_h1]:text-2xl [&_h1]:font-black [&_h2]:mb-2 [&_h2]:mt-1 [&_h2]:text-xl [&_h2]:font-black [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc`}
          contentEditable
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

function HighlightsDestinationsStep({ destinations, draft, selectedDestinationIds, addItem, removeItem, toggleDestination, updateArray }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
      <section className="min-w-0">
        <SectionHeader title="Tour Highlights" copy="Add key highlights displayed on tour cards and details pages." />
        {draft.highlights.map((highlight, index) => (
          <div className="mb-2.5 grid grid-cols-[44px_minmax(0,1fr)_40px] items-center gap-3 rounded-lg border border-[#e3e9df] bg-[#fbfcfa] p-3" key={index}>
            <span className="grid h-[34px] w-[34px] place-items-center rounded-md bg-[#e4f2e6] text-[13px] font-black text-[#0c4a23]">{index + 1}</span>
            <input className={builderInputClass} value={highlight.title} onChange={(event) => updateArray("highlights", index, "title", event.target.value)} placeholder="Gorilla Trekking" />
            <IconButton onClick={() => removeItem("highlights", index)} />
          </div>
        ))}
        <AddButton onClick={() => addItem("highlights", { title: "" })}>Add Highlight</AddButton>
      </section>

      <section className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader title="Destinations" copy="Select one or more destinations included in this tour package." />
          <span className="mt-1 rounded-full bg-[#e4f2e6] px-3 py-1 text-[12px] font-black text-[#0c4a23]">
            {selectedDestinationIds.size} selected
          </span>
        </div>
        <div className="grid gap-3">
          {destinations.length === 0 && (
            <p className="rounded-lg border border-dashed border-[#dce4d8] bg-[#fbfcfa] px-4 py-5 text-center text-[13px] font-bold text-[#687265]">
              No active destinations were returned by the backend. Restart the backend after the latest query change, then refresh this page.
            </p>
          )}

          {destinations.map((destination) => {
            const isSelected = selectedDestinationIds.has(String(destination.id));

            return (
              <button
                className={`grid grid-cols-[28px_minmax(0,1fr)] items-center gap-3 rounded-lg border p-4 text-left transition ${
                  isSelected
                    ? "border-[#0b2a12] bg-[#edf6ee] shadow-[0_10px_24px_rgb(18_53_27/0.08)]"
                    : "border-[#e3e9df] bg-white hover:border-[#d3a14e] hover:bg-[#fbfcfa]"
                }`}
                type="button"
                onClick={() => toggleDestination(destination)}
                aria-pressed={isSelected}
                key={destination.id}
              >
                <span className={`grid h-7 w-7 place-items-center rounded-md border ${
                  isSelected ? "border-[#0b2a12] bg-[#0b2a12] text-white" : "border-[#aeb9ae] bg-white text-transparent"
                }`}>
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="grid gap-1">
                  <strong className="text-[14px] font-black text-[#132419]">{destination.name}</strong>
                  <small className="text-[12px] font-bold text-[#687265]">Active destination</small>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ItineraryStep({ days, addItineraryDay, updateItineraryDay }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDay = days[activeIndex] || days[0];

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="min-w-0">
        <SectionHeader title="Itinerary Days" copy="Add each day of the tour." />
        {days.map((day, index) => (
          <button
            className={`mb-2.5 block w-full rounded-lg border p-3 text-left transition ${
              index === activeIndex ? "border-[#cfe4d2] bg-[#edf6ee]" : "border-[#e3e9df] bg-white hover:border-[#d3a14e]"
            }`}
            type="button"
            onClick={() => setActiveIndex(index)}
            key={day.client_key}
          >
            <strong className="block text-[13px] font-black text-[#142819]">Day {day.day_number || index + 1}</strong>
            <span className="mt-1 block text-[12px] font-bold text-[#687265]">{day.title || "Untitled day"}</span>
          </button>
        ))}
        <AddButton onClick={addItineraryDay}>Add New Day</AddButton>
      </aside>

      <section className="min-w-0">
        <SectionHeader title="Day Details" copy="Add the day title and itinerary content exactly as it should appear." />
        <div className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
          <FormInput label="Day Number" value={activeDay.day_number} onChange={(event) => updateItineraryDay(activeIndex, "day_number", event.target.value.replace(/\D/g, ""))} />
          <FormInput label="Day Title" value={activeDay.title} onChange={(event) => updateItineraryDay(activeIndex, "title", event.target.value)} />
          <div className="grid gap-2 md:col-span-2">
            <span className="text-[13px] font-black text-[#253329]">Rich Description</span>
            <RichTextEditor
              value={activeDay.description}
              onChange={(value) => updateItineraryDay(activeIndex, "description", value)}
              placeholder={`Early morning pick up from your hotel in Kigali and drive to Akagera National Park.\n\n12:30 PM - Lunch at the lodge.\n02:00 PM - Proceed for the boat cruise on Lake Ihema.\n04:00 PM - Transfer back to the lodge.\n06:30 PM - Dinner and overnight stay at Akagera Game Lodge.`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingStep({ currencies, prices, addItem, removeItem, updateArray }) {
  return (
    <section>
      <SectionHeader title="Pricing" copy="Add the package price and a helpful note for travelers." />
      {prices.map((price, index) => (
        <div className="grid gap-4 rounded-lg border border-[#dce4d8] bg-white p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]" key={index}>
          <label className={builderLabelClass}>
            Currency
            <select className={builderInputClass} value={price.currency_id} onChange={(event) => updateArray("prices", index, "currency_id", event.target.value)}>
              <option value="">Select</option>
              {currencies.map((currency) => (
                <option value={currency.id} key={currency.id}>
                  {currency.code} {currency.symbol ? `(${currency.symbol})` : ""}
                </option>
              ))}
            </select>
          </label>
          <FormInput label="Price" value={price.price} onChange={(event) => updateArray("prices", index, "price", event.target.value)} />
          {prices.length > 1 && (
            <div className="flex items-end">
              <IconButton onClick={() => removeItem("prices", index)} />
            </div>
          )}
          <label className={`${builderLabelClass} md:col-span-3`}>
            Price Note
            <textarea
              className={`${builderInputClass} resize-y`}
              value={price.price_note}
              onChange={(event) => updateArray("prices", index, "price_note", event.target.value)}
              placeholder="Example: Price is per person based on double occupancy."
            />
          </label>
        </div>
      ))}
      <AddButton onClick={() => addItem("prices", { currency_id: "", price: "", price_note: "" })}>Add Price</AddButton>
    </section>
  );
}

function InclusionsExtrasStep({ draft, updateSection }) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <RichTextSection
        title="What's Included"
        copy="Add all included items as one formatted list."
        value={draft.inclusions}
        onChange={(value) => updateSection("inclusions", value)}
        placeholder={"Accommodation as specified\nMeals as specified in the itinerary\nTransportation in a 4x4 safari vehicle"}
      />
      <RichTextSection
        title="What's Excluded"
        copy="Add all excluded items as one formatted list."
        value={draft.exclusions}
        onChange={(value) => updateSection("exclusions", value)}
        placeholder={"International flights\nTravel insurance\nVisa fees"}
      />
      <RichTextSection
        title="Extra Information"
        copy="Add any extra text-based information travelers should know."
        value={draft.extras}
        onChange={(value) => updateSection("extras", value)}
        placeholder="Optional activities can be arranged on request. Special permits, upgrades, and private transfers may affect the final quote."
      />
    </div>
  );
}

function RichTextSection({ title, copy, value, onChange, placeholder }) {
  return (
    <section className="min-w-0">
      <SectionHeader title={title} copy={copy} />
      <RichTextEditor value={value} onChange={onChange} placeholder={placeholder} minHeightClass="min-h-[260px]" />
    </section>
  );
}

function MediaReviewStep({ draft, updateArray, addItem, removeItem }) {
  const [uploadingKey, setUploadingKey] = useState("");
  const [uploadError, setUploadError] = useState("");
  const coverIndex = draft.media.findIndex((media) => media.is_cover);
  const resolvedCoverIndex = coverIndex >= 0 ? coverIndex : 0;
  const coverMedia = draft.media[resolvedCoverIndex] || {};
  const galleryImages = draft.media
    .map((media, index) => ({ ...media, index }))
    .filter((media) => media.media_type !== "video" && !media.is_cover);
  const videoIndex = draft.media.findIndex((media) => media.media_type === "video");
  const videoUrl = videoIndex >= 0 ? draft.media[videoIndex].url : "";
  const previewImage = coverMedia.url || galleryImages.find((media) => media.url)?.url;
  const lowestPrice = draft.prices
    .map((price) => Number(String(price.price).replace(/,/g, "")))
    .filter((price) => Number.isFinite(price) && price > 0)
    .sort((a, b) => a - b)[0];
  const firstPriceNote = draft.prices.find((price) => price.price_note)?.price_note;

  function updateVideoUrl(value) {
    if (videoIndex >= 0) {
      updateArray("media", videoIndex, "url", value);
      return;
    }

    addItem("media", { is_cover: false, media_type: "video", title: "Tour video", url: value });
  }

  async function uploadImage(file, key = "image") {
    setUploadError("");
    setUploadingKey(key);

    try {
      const result = await uploadTourMedia(file, { folder: "tour-packages" });
      return result.file;
    } catch (error) {
      setUploadError(error.message || "Unable to upload image");
      return null;
    } finally {
      setUploadingKey("");
    }
  }

  async function uploadCover(file) {
    if (!file) return;
    const uploadedFile = await uploadImage(file, "cover");

    if (!uploadedFile?.url) return;

    updateArray("media", resolvedCoverIndex, "url", uploadedFile.url);
    updateArray("media", resolvedCoverIndex, "title", uploadedFile.original_name || "Cover image");
  }

  async function uploadGallery(files) {
    const selectedFiles = Array.from(files || []);
    if (selectedFiles.length === 0) return;

    setUploadError("");
    setUploadingKey("gallery");

    try {
      for (const file of selectedFiles) {
        const result = await uploadTourMedia(file, { folder: "tour-packages" });
        if (result.file?.url) {
          addItem("media", {
            is_cover: false,
            media_type: "image",
            title: result.file.original_name || file.name,
            url: result.file.url,
          });
        }
      }
    } catch (error) {
      setUploadError(error.message || "Unable to upload gallery images");
    } finally {
      setUploadingKey("");
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.28fr)]">
      <section className="min-w-0">
        <SectionHeader title="Tour Images" copy="Upload a cover image and additional gallery images for this tour." />

        {uploadError && (
          <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">
            {uploadError}
          </p>
        )}

        <div className="mb-4 grid gap-2 text-[13px] font-black text-[#253329]">
          <span>Cover Image <b className="text-red-600">*</b></span>
          <label
            className="grid min-h-[116px] cursor-pointer grid-cols-[250px_minmax(0,1fr)] items-center gap-4 rounded-lg border border-[#dce4d8] bg-[#fbfcfa] p-3 transition hover:border-[#d3a14e] max-md:grid-cols-1"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              uploadCover(event.dataTransfer.files?.[0]);
            }}
          >
            <div className="grid h-[94px] place-items-center overflow-hidden rounded-md bg-[#e9f0e7] text-[#0c3b1a] max-md:h-[190px]">
              {coverMedia.url ? (
                <img className="h-full w-full object-cover" src={mediaPreviewUrl(coverMedia.url)} alt="" />
              ) : (
                <ImagePlus className="h-9 w-9" aria-hidden="true" />
              )}
            </div>
            <div className="grid gap-1">
              <strong className="text-[13px] font-black text-[#142319]">
                {uploadingKey === "cover" ? "Uploading cover image..." : "Drag and drop or click to upload"}
              </strong>
              <span className="text-[12px] font-bold text-[#687265]">JPG, PNG or WebP. Max size 5MB</span>
              <span className="text-[12px] font-bold text-[#687265]">Recommended: 1920 x 1080 px</span>
            </div>
            <input
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => {
                uploadCover(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
        </div>

        <div className="mb-2 flex items-baseline gap-2">
          <strong className="text-[13px] font-black text-[#142319]">Gallery Images</strong>
          <span className="text-[12px] font-extrabold text-[#687265]">Max 12 images</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5 max-lg:grid-cols-3 max-sm:grid-cols-2">
          {galleryImages.map((media) => (
            <div className="group relative grid min-h-[92px] place-items-center overflow-hidden rounded-md border border-[#dce4d8] bg-[#fbfcfa]" key={media.index}>
              {media.url ? (
                <img className="h-full w-full object-cover" src={mediaPreviewUrl(media.url)} alt={media.title || ""} />
              ) : (
                <ImagePlus className="h-7 w-7 text-[#52615a]" aria-hidden="true" />
              )}
              <button
                className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-[#142319] shadow-[0_8px_18px_rgb(0_0_0/0.16)]"
                type="button"
                onClick={() => removeItem("media", media.index)}
                aria-label="Remove gallery image"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
          <label className="grid min-h-[92px] cursor-pointer place-items-center content-center gap-2 rounded-md border border-dashed border-[#dce4d8] bg-[#fbfcfa] text-center text-[12px] font-black text-[#142319] transition hover:border-[#d3a14e]">
            <Plus className="h-6 w-6" aria-hidden="true" />
            {uploadingKey === "gallery" ? "Uploading..." : "Add More Images"}
            <input
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={(event) => {
                uploadGallery(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </div>

        <label className="mt-5 grid gap-2 text-[13px] font-black text-[#253329]">
          Tour Video (Optional)
          <span className="-mt-1 text-[12px] font-bold text-[#687265]">Add a YouTube or Vimeo link to showcase your tour.</span>
          <div className="relative">
            <input className={`${builderInputClass} pr-10`} value={videoUrl} onChange={(event) => updateVideoUrl(event.target.value)} placeholder="Paste YouTube or Vimeo link here..." />
            <LinkIcon className="absolute bottom-3 right-3 h-[18px] w-[18px] text-[#52615a]" aria-hidden="true" />
          </div>
        </label>
      </section>

      <section className="min-w-0">
        <div className="flex items-start justify-between gap-4 max-md:grid">
          <SectionHeader title="Tour Preview" copy="This is how your tour will appear to visitors." />
          <button className="inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-md border border-[#dce4d8] bg-white px-4 text-[12px] font-black text-[#142319] max-md:w-full max-md:justify-center" type="button">
            Preview in New Tab
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <article className="grid grid-cols-[minmax(0,1fr)_320px] gap-5 rounded-lg border border-[#e3e9df] bg-white p-3.5 max-lg:grid-cols-[minmax(0,1fr)_280px] max-md:grid-cols-1">
          <div className="grid min-w-0 content-start gap-3 px-1.5 py-2.5">
            <span className="w-max rounded bg-[#e4f2e6] px-2.5 py-1 text-[11px] font-black capitalize text-[#0c4a23]">{draft.basic.status || "Draft"}</span>
            <h3 className="m-0 font-serif text-2xl font-extrabold text-[#102616]">{draft.basic.name || "11-Day Rwanda Highlights"}</h3>
            <ul className="m-0 flex list-none flex-wrap gap-3.5 p-0 text-[12px] font-extrabold text-[#52615a]">
              <li className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" /> {draft.basic.duration_days || 0} Days / {draft.basic.duration_nights || 0} Nights</li>
              <li className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden="true" /> {draft.destinations[0]?.name || "Rwanda"}</li>
            </ul>
            <strong className="text-[15px] font-black text-[#14321c]">
              From {lowestPrice ? `$${lowestPrice.toLocaleString()}` : "$1,250"} <small className="text-[11px] font-extrabold text-[#687265]">Per Person</small>
            </strong>
            <p className="m-0 text-[12px] font-bold leading-relaxed text-[#52615a]">{plainTextSummary(draft.basic.description, 190) || "Explore Rwanda's incredible wildlife, breathtaking landscapes and vibrant culture. From gorilla trekking in Volcanoes National Park to relaxing by Lake Kivu."}</p>
          </div>
          <div className="grid min-h-[188px] place-items-center overflow-hidden rounded-md bg-[#e9f0e7] text-[#52615a] max-md:min-h-[190px]">
            {previewImage ? <img className="h-full w-full object-cover" src={mediaPreviewUrl(previewImage)} alt="" /> : <ImagePlus className="h-10 w-10" aria-hidden="true" />}
          </div>
        </article>

        <div className="mt-3 grid grid-cols-4 gap-2.5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <PreviewFact icon={Users} label="Duration" value={`${draft.basic.duration_days || 0} Days`} />
          <PreviewFact icon={Users} label="Tour Type" value={draft.basic.tour_type || "Private"} />
          <PreviewFact icon={MapPin} label="Destinations" value={`${draft.destinations.length || 1} Selected`} />
          <PreviewFact icon={Utensils} label="Price Note" value={firstPriceNote || "Per person"} />
        </div>

        <div className="mt-3.5 rounded-lg border border-[#e3e9df] bg-white p-4">
          <h3 className="mb-3.5 mt-0 text-base font-black text-[#142319]">Tour Summary</h3>
          <dl className="m-0 grid grid-cols-4 gap-x-4 gap-y-3.5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            <SummaryItem label="Itinerary Days" value={`${draft.itinerary_days.length} Days`} />
            <SummaryItem label="Destinations" value={`${draft.destinations.length} Destinations`} />
            <SummaryItem label="Inclusions" value={draft.inclusions ? "Added" : "Empty"} />
            <SummaryItem label="Exclusions" value={draft.exclusions ? "Added" : "Empty"} />
            <SummaryItem label="Prices" value={`${draft.prices.filter((item) => item.price && item.currency_id).length} Added`} />
            <SummaryItem label="Extra Information" value={draft.extras ? "Added" : "Empty"} />
            <SummaryItem label="Images" value={`${draft.media.filter((item) => item.url && item.media_type !== "video").length} Images`} />
            <SummaryItem label="Status" value={draft.basic.status || "Draft"} isStatus />
          </dl>
        </div>
      </section>
    </div>
  );
}

function PreviewFact({ icon: Icon, label, value }) {
  return (
    <div className="grid grid-cols-[22px_minmax(0,1fr)] items-center gap-x-2 gap-y-0.5 rounded-md border border-[#e3e9df] bg-[#f5f9f3] p-2.5">
      <Icon className="row-span-2 h-[18px] w-[18px] text-[#0d4b22]" aria-hidden="true" />
      <span className="text-[10px] font-black text-[#687265]">{label}</span>
      <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-black text-[#142319]">{value}</strong>
    </div>
  );
}

function SummaryItem({ label, value, isStatus = false }) {
  return (
    <div className="grid gap-1">
      <dt className="text-[11px] font-black text-[#687265]">{label}</dt>
      <dd className="m-0 text-[12px] font-black text-[#142319]">
        {isStatus ? (
          <span className="inline-flex w-max rounded bg-[#dcecff] px-2 py-1 capitalize text-[#0d55a0]">{value}</span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function SectionHeader({ title, copy }) {
  return (
    <header className="mb-4">
      <h3 className="m-0 text-[19px] font-semibold text-[#162a1a]">{title}</h3>
      <p className="mt-1.5 text-[13px] font-medium text-[#687265]">{copy}</p>
    </header>
  );
}

function FormInput({ label, ...inputProps }) {
  return (
    <label className={builderLabelClass}>
      {label}
      <input className={builderInputClass} {...inputProps} />
    </label>
  );
}

function AddButton({ children, onClick }) {
  return (
    <button className={`${builderButtonClass} mt-2.5 border-[#b9c9b9]`} type="button" onClick={onClick}>
      <Plus className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  );
}

function IconButton({ onClick }) {
  return (
    <button className="grid h-9 w-9 place-items-center rounded-md border border-[#e5d6d3] bg-white text-[#b03622] transition hover:border-red-300 hover:bg-red-50" type="button" onClick={onClick}>
      <Trash2 className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function cloneDraft(draft) {
  return JSON.parse(JSON.stringify(draft));
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function valueString(value) {
  return value === undefined || value === null ? "" : String(value);
}

function hydratePackageDraft(packageData = {}) {
  const basic = packageData.basic || packageData.package || {};
  const media = ensureArray(packageData.media).map((item) => ({
    is_cover: Boolean(item.is_cover),
    media_type: item.media_type || "image",
    title: item.title || "",
    url: item.url || "",
  }));
  const hasCover = media.some((item) => item.media_type !== "video" && item.is_cover);
  const firstImageIndex = media.findIndex((item) => item.media_type !== "video");

  return {
    basic: {
      category_id: valueString(basic.category_id),
      description: basic.description || "",
      duration_days: valueString(basic.duration_days),
      duration_nights: valueString(basic.duration_nights),
      name: basic.name || "",
      status: basic.status || "draft",
    },
    destinations: ensureArray(packageData.destinations).map((destination) => ({
      description: destination.description || "",
      destination_id: destination.destination_id || destination.id,
      name: destination.name || "",
    })),
    exclusions: packageData.exclusions || "",
    extras: packageData.extras || "",
    highlights: ensureArray(packageData.highlights).length
      ? ensureArray(packageData.highlights).map((highlight) => ({ title: highlight.title || "" }))
      : [{ title: "" }],
    inclusions: packageData.inclusions || "",
    itinerary_days: ensureArray(packageData.itinerary_days).length
      ? ensureArray(packageData.itinerary_days).map((day, index) => ({
          client_key: `day-${day.id || index + 1}`,
          day_number: valueString(day.day_number || index + 1),
          description: day.description || "",
          title: day.title || "",
        }))
      : cloneDraft(emptyDraft.itinerary_days),
    media: media.length
      ? hasCover
        ? media
        : media.map((item, index) => ({ ...item, is_cover: item.media_type !== "video" && index === firstImageIndex }))
      : cloneDraft(emptyDraft.media),
    prices: ensureArray(packageData.prices).length
      ? ensureArray(packageData.prices).map((price) => ({
          currency_id: valueString(price.currency_id),
          price: valueString(price.price),
          price_note: price.price_note || "",
        }))
      : cloneDraft(emptyDraft.prices),
  };
}

function preparePayload(draft) {
  return {
    ...draft,
    exclusions: plainTextSummary(draft.exclusions, 1) ? draft.exclusions : "",
    extras: plainTextSummary(draft.extras, 1) ? draft.extras : "",
    highlights: draft.highlights.filter((item) => item.title),
    inclusions: plainTextSummary(draft.inclusions, 1) ? draft.inclusions : "",
    itinerary_days: draft.itinerary_days.filter((item) => item.day_number || item.title),
    media: draft.media.filter((item) => item.url),
    prices: draft.prices.filter((item) => item.price && item.currency_id),
  };
}

function isNumericField(name) {
  return name === "duration_days" || name === "duration_nights";
}

function plainTextSummary(value, maxLength = 220) {
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

export default TourPackageBuilder;
