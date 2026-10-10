import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../styles/ProductCard.css";
import { CustomOrderForm, ThankYouCard } from "./customForm";
import { API_URL } from "../utils/api";
import giftBox from "../assets/giftBox.png";
import LazyImage from "./LazyImage";
import useCategories, { useSubcategories } from "../utils/useCategories";

import {
  Flower2,
  ImageDown,
  HandFist,
  Gift,
  ReceiptText,
  Leaf,
  CalendarClock,
  HandHeart,
  Truck,
  ChevronDown,
  ClipboardList,
  Info,
  MapPin,
  Package,
  ClipboardCheck,
  Heart,
  Tag,
  MessageCircleMore,
  Ruler,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

const WHATSAPP_NUMBER = "918077188283";

// Ye dono sab products ke liye same hain (admin se likhne ki zaroorat nahi).
// Alag-alag points ko "•" se alag karein, wo bullet list ban jayegi.
const PROCESSING_TIME =
  "Depends on size and design • Depends on flower preservation requirements • Final timeline confirmed at the time of order";

const CARE_INSTRUCTIONS =
  "Keep away from direct sunlight • Avoid excessive heat and moisture • Clean gently with a soft, dry cloth • Do not use harsh chemicals";

const getImageUrl = (image) => {
  if (!image) return "";

  // Cloudinary / complete image URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Old /uploads image
  return `${API_URL}${image}`;
};

const DEFAULT_FEATURES = [
  { icon: Flower2, label: "Real Flowers Preserved" },
  { icon: ImageDown, label: "Custom Photo Option" },
  { icon: HandFist, label: "Handmade with Love" },
  { icon: Gift, label: "A Timeless Keepsake" },
];

function ProductCard({ product }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(null);

  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  // ---- custom order flow ----
  const [view, setView] = useState("details");
  const [flip, setFlip] = useState("idle");
  const [orderForm, setOrderForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    customisation: "",
    eventDate: "",
    street: "",
    city: "",
    instructions: "",
  });
  const [toast, setToast] = useState(null);
  const [shippingInfoOpen, setShippingInfoOpen] = useState(false);
  const modalInfoRef = useRef(null);
  // On mobile (<=650px) .pc-modal itself becomes the scroll container
  // (see @media max-width:650px in ProductCard.css: height becomes
  // "auto" and overflow-y becomes "auto" on .pc-modal), instead of
  // .pc-modal-info. Without also resetting this ref, switching to the
  // form/thankyou view only reset modalInfoRef's scroll — not the
  // modal's — so on phones the new view opened wherever the page
  // happened to be scrolled to already, instead of from the top.
  const modalRef = useRef(null);

  // Product Details & Material & Quality ye order follow karte hain:
  // 1) subcategory ka text  2) category ka text  3) product ka apna text.
  // Admin -> Category / Subcategory form mein bhare jaate hain, to nayi
  // category ya subcategory add karne par bhi ye apne aap kaam karta hai.
  const categories = useCategories();
  const subcategories = useSubcategories();

  const productCategory = (product.category || "").trim().toLowerCase();
  const categoryContent =
    categories.find((c) => (c.name || "").trim().toLowerCase() === productCategory) || {};

  const productSubId =
    typeof product.subcategory === "object"
      ? product.subcategory?._id
      : product.subcategory;
  const subcategoryContent =
    (productSubId && subcategories.find((s) => s._id === productSubId)) || {};

  const contentDetails =
    subcategoryContent.details || categoryContent.details || product.details;
  const contentMaterial =
    subcategoryContent.material || categoryContent.material || product.material;

  const selected = product.variants?.[selectedIndex];
  const features =
    product.features?.length > 0 ? product.features : DEFAULT_FEATURES;

  const galleryImages = (() => {
    const original = product.image ? getImageUrl(product.image) : null;

    const crops =
      product.images?.length > 0
        ? product.images.map((img) => getImageUrl(img))
        : [];

    if (original) {
      return [original, ...crops];
    }

    return crops;
  })();

  const cardImage = galleryImages[0];

  const mainImage = galleryImages[activeImage] || cardImage;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };
  const renderAccordionContent = (content) => {
    if (!content) return null;
    const parts = content
      .split("•")
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length <= 1) {
      return <p className="pc-accordion-text">{content}</p>;
    }

    return (
      <ul className="pc-accordion-list">
        {parts.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    );
  };

  const showToastMessage = (message, duration = 3000) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const handleWishlist = () => {
    const willBeWishlisted = !wishlisted;
    toggleWishlist(product);
    showToastMessage(
      willBeWishlisted ? "♥ Added to Wishlist" : "Removed from Wishlist",
    );
  };

  const closeModal = () => {
    setIsOpen(false);
    // reset the flow so it reopens on the details view next time
    setView("details");
    setFlip("idle");
  };

  const updateOrderField = (key, value) => {
    setOrderForm((f) => ({ ...f, [key]: value }));
  };

  // ---- book-page-flip transition between details / form / thankyou ----
  const goTo = (nextView) => {
    setFlip("leaving");
    setTimeout(() => {
      setView(nextView);
      // Reset scroll on whichever element is the actual scroll
      // container for this viewport — .pc-modal-info on
      // desktop/tablet, .pc-modal itself on mobile — so the next view
      // always opens from the top instead of wherever the previous
      // view happened to be scrolled to.
      if (modalInfoRef.current) modalInfoRef.current.scrollTop = 0;
      if (modalRef.current) modalRef.current.scrollTop = 0;
      setFlip("entering-init"); // snap to the other side instantly, no transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFlip("idle")); // then animate back to flat
      });
    }, 350);
  };

  const handleCustomOrderClick = () => {
    goTo("form");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    goTo("thankyou");
  };
  const buildOrderMessage = () => {
    const lines = [
      `*New Custom Order Request*`,
      ``,
      `Product: ${product.name}`,
      `---------------------`,
      `Name: ${orderForm.name}`,
      `WhatsApp: ${orderForm.whatsapp}`,
    ];

    if (orderForm.email) lines.push(`Email: ${orderForm.email}`);
    if (orderForm.customisation)
      lines.push(`Customisation: ${orderForm.customisation}`);
    if (orderForm.eventDate) lines.push(`Event Date: ${orderForm.eventDate}`);

    lines.push(`Address: ${orderForm.street}, ${orderForm.city}`);

    if (orderForm.instructions)
      lines.push(`Special Instructions: ${orderForm.instructions}`);

    lines.push(
      `---------------------`,
      `Hi Resin Creations! I'd love to place this custom order.`,
      `Please confirm the price & timeline. Thank you!`,
    );

    return lines.join("\n");
  };

  const handleSendWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage())}`;
    window.open(url, "_blank");

    closeModal();
    showToastMessage("Message sent! We'll get back to you soon.", 5000);
  };

  // Product Details & Material subcategory / category se aate hain (product ka apna fallback).
  // Processing Time & Care Instructions hardcoded hain (sab products mein same).
  const accordionSections = [
    {
      key: "details",
      label: "Product Details",
      icon: ReceiptText,
      content: contentDetails,
    },
    {
      key: "material",
      label: "Material & Quality",
      icon: Leaf,
      content: contentMaterial,
    },
    {
      key: "processing",
      label: "Processing Time",
      icon: CalendarClock,
      content: PROCESSING_TIME,
    },
    {
      key: "care",
      label: "Care Instructions",
      icon: HandHeart,
      content: CARE_INSTRUCTIONS,
    },
  ].filter((s) => s.content);

  return (
    <>
      <div className="pc-card">
        <div className="pc-image">
          <div className="pc-image-inner" onClick={() => setIsOpen(true)}>
            {cardImage ? (
              <LazyImage src={cardImage} alt={product.name} />
            ) : (
              <span>{product.name}</span>
            )}
          </div>
        </div>

        <div className="pc-info">
          <p className="pc-kicker">{product.category}</p>

          <h3 className="pc-name">{product.name}</h3>

          {product.size && (
            <div className="pc-size-row">
              <span className="pc-size-badge">
                <Ruler size={14} strokeWidth={1.8} />
                {product.size}
              </span>
              <span className="pc-size-label">Size</span>
            </div>
          )}

          <button className="pc-cta" onClick={() => setIsOpen(true)}>
            <span>See the full vibe</span>
            <span className="pc-cta-arrow">→</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="pc-modal-overlay" onClick={closeModal}>
          <div
            ref={modalRef}
            className={`pc-modal ${view === "thankyou" ? "pc-modal-thankyou-only" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="pc-modal-close" onClick={closeModal}>
              ✕
            </button>

            {view !== "thankyou" && (
              <div className="pc-modal-left">
                <div className="pc-modal-image">
                  {mainImage ? (
                    <img src={mainImage} alt={product.name} />
                  ) : (
                    <span>{product.name}</span>
                  )}
                </div>

                {galleryImages.length > 0 && (
                  <div className="pc-thumbs">
                    {galleryImages.map((img, i) => (
                      <button
                        key={i}
                        className={
                          i === activeImage ? "pc-thumb active" : "pc-thumb"
                        }
                        onClick={() => setActiveImage(i)}
                      >
                        <img src={img} alt={`${product.name} ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pc-modal-info" ref={modalInfoRef}>
              <div className={`pc-flip ${flip}`}>
                {view === "details" && (
                  <>
                    <p className="pc-modal-category">{product.category}</p>
                    <h2 className="pc-modal-title">{product.name}</h2>

                    {/* MAKE IT YOURS */}
                    <div className="pc-make-yours">
                      <img src={giftBox} alt="" className="pc-make-yours-img" />
                      <div className="pc-make-yours-line" />
                      <div className="pc-make-yours-text">
                        <span className="pc-make-yours-title">
                          Make it Yours
                        </span>
                        <span className="pc-make-yours-sub">
                          Choose the details and create something uniquely
                          yours.
                        </span>
                      </div>
                      <Heart
                        size={12}
                        className="pc-deco-heart pc-deco-heart-1"
                      />
                      <Heart
                        size={9}
                        className="pc-deco-heart pc-deco-heart-2"
                      />
                    </div>

                    {/* PRICE & SIZE | CUSTOMISATION */}
                    <div className="pc-info-duo">
                      <div className="pc-info-duo-item">
                        <span className="pc-info-circle">
                          <Tag
                            size={20}
                            strokeWidth={1.6}
                            className="pc-tag-rotate"
                          />
                        </span>
                        <div className="pc-info-duo-text">
                          <span className="pc-info-duo-title">
                            Price &amp; Size
                          </span>
                          <span className="pc-info-duo-sub">
                            Final price and size will be confirmed based on your
                            design and customisation.
                          </span>
                        </div>
                      </div>

                      <div className="pc-info-duo-divider" />

                      <div className="pc-info-duo-item">
                        <span className="pc-info-circle">
                          <MessageCircleMore size={20} strokeWidth={1.6} />
                        </span>
                        <div className="pc-info-duo-text">
                          <span className="pc-info-duo-title">
                            Customisation
                          </span>
                          <span className="pc-info-duo-sub">
                            Share your preferences like size, frame style, name,
                            date or any special details while placing the order.
                          </span>
                        </div>
                      </div>
                    </div>

                    <hr className="pc-price-divider" />
                    <div
                      className={`pc-shipping-info ${shippingInfoOpen ? "open" : ""}`}
                    >
                      <button
                        type="button"
                        className="pc-shipping-header"
                        onClick={() => setShippingInfoOpen((v) => !v)}
                      >
                        <span className="pc-shipping-header-left">
                          {shippingInfoOpen ? (
                            <Truck size={16} className="pc-shipping-icon" />
                          ) : (
                            <Info size={16} className="pc-shipping-icon" />
                          )}
                          <span className="pc-shipping-header-text">
                            {shippingInfoOpen ? (
                              <span className="pc-shipping-title">
                                Shipping Information
                              </span>
                            ) : (
                              <>
                                <span className="pc-shipping-title">
                                 Shipping Charges
                                </span>
                                <span className="pc-shipping-subtext">
                                  Shipping charges will be calculated separately
                                  based on your location.
                                </span>
                              </>
                            )}
                          </span>
                        </span>
                        <span className="pc-shipping-toggle">
                          {shippingInfoOpen ? "Know less" : "Know more"}
                          <ChevronDown
                            size={14}
                            className={
                              shippingInfoOpen
                                ? "pc-shipping-chevron open"
                                : "pc-shipping-chevron"
                            }
                          />
                        </span>
                      </button>

                      {shippingInfoOpen && (
                        <div className="pc-shipping-body">
                          <p className="pc-shipping-lead">
                            Shipping charges are calculated separately for every
                            order.
                          </p>
                          <p className="pc-shipping-desc">
                            Shipping cost depends on your delivery location,
                            package size, weight, and order requirements. Once
                            your product details are finalised, the exact
                            shipping charge will be confirmed with you before
                            your order is placed.
                          </p>

                          <div className="pc-shipping-grid">
                            <div className="pc-shipping-item">
                              <MapPin
                                size={20}
                                className="pc-shipping-item-icon"
                                strokeWidth={1.5}
                              />
                              <span className="pc-shipping-item-label">
                                Your Location
                              </span>
                              <span className="pc-shipping-item-sub">
                                Delivery city / pincode
                              </span>
                            </div>
                            <div className="pc-shipping-item">
                              <Package
                                size={20}
                                className="pc-shipping-item-icon"
                                strokeWidth={1.5}
                              />
                              <span className="pc-shipping-item-label">
                                Package Weight
                              </span>
                              <span className="pc-shipping-item-sub">
                                Final packed product dimensions
                              </span>
                            </div>
                            <div className="pc-shipping-item">
                              <ClipboardCheck
                                size={20}
                                className="pc-shipping-item-icon"
                                strokeWidth={1.5}
                              />
                              <span className="pc-shipping-item-label">
                                Order Requirements
                              </span>
                              <span className="pc-shipping-item-sub">
                                Packaging & any special requirements
                              </span>
                            </div>
                          </div>

                          <div className="pc-shipping-note">
                            <Heart
                              size={14}
                              className="pc-shipping-note-icon"
                              fill="currentColor"
                            />
                            <span>
                              Every order is unique, and we ensure the best and
                              most accurate shipping rate for your location and
                              requirements.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {features.length > 0 && (
                      <div className="pc-features-row">
                        {features.map((f, i) => {
                          const Icon = f.icon;
                          return (
                            <div className="pc-feature" key={i}>
                              <Icon
                                className="pc-feature-icon"
                                size={28}
                                strokeWidth={1.3}
                              />
                              <span className="pc-feature-label">
                                {f.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {accordionSections.length > 0 && (
                      <div className="pc-accordion">
                        {accordionSections.map((s) => {
                          const Icon = s.icon;
                          return (
                            <div className="pc-accordion-item" key={s.key}>
                              <button
                                className="pc-accordion-header"
                                onClick={() => toggleSection(s.key)}
                              >
                                <span className="pc-accordion-header-label">
                                  <Icon
                                    className="pc-accordion-icon"
                                    size={18}
                                    strokeWidth={1.6}
                                  />
                                  {s.label}
                                </span>
                                <ChevronDown
                                  className={
                                    openSection === s.key
                                      ? "pc-chevron open"
                                      : "pc-chevron"
                                  }
                                  size={17}
                                  strokeWidth={2}
                                />
                              </button>
                              {openSection === s.key && (
                                <div className="pc-accordion-body">
                                  {renderAccordionContent(s.content)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="pc-action-row">
                      <button
                        className="pc-wishlist-btn"
                        onClick={handleWishlist}
                      >
                        {wishlisted ? "♥ Wishlisted" : "♡ Add to Wishlist"}
                      </button>

                      <button
                        className="pc-custom-order-btn"
                        onClick={handleCustomOrderClick}
                      >
                        <ClipboardList size={16} strokeWidth={2} />
                        Custom Order
                      </button>
                    </div>
                  </>
                )}

                {view === "form" && (
                  <CustomOrderForm
                    product={product}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    orderForm={orderForm}
                    updateOrderField={updateOrderField}
                    onSubmit={handleFormSubmit}
                    onBack={() => goTo("details")}
                    onToast={showToastMessage}
                  />
                )}

                {view === "thankyou" && (
                  <ThankYouCard
                    onSend={handleSendWhatsApp}
                    onBack={() => goTo("form")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast &&
        createPortal(
          <div className="pc-toast-pill">
            <span className="pc-toast-check">✓</span>
            {toast}
          </div>,
          document.body,
        )}
    </>
  );
}

export default ProductCard;